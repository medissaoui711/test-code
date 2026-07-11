import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { google } from "googleapis";
import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";
import parserRouter from "./src/parser.js";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.use('/api/parser', parserRouter);

  app.post("/api/scan", async (req, res) => {
    const { target, metrics } = req.body;
    let { files } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key is not configured." });
    }

    try {
      let fileCount = metrics?.fileCount || files.length;
      
      // If no files are provided but a GitHub URL is given, attempt to fetch the repository structure
      if (files.length === 0 && target.includes('github.com')) {
        try {
          const match = target.match(/github\.com\/([^/]+)\/([^/]+)/);
          if (match) {
            const owner = match[1];
            const repo = match[2].replace('.git', '');
            
            const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`);
            if (treeRes.ok) {
              const treeData = await treeRes.json();
              const treeFiles = treeData.tree.filter((t: any) => t.type === 'blob' && !t.path.includes('node_modules') && !t.path.includes('.git'));
              
              fileCount = treeFiles.length;
              
              const filesToFetch = treeFiles
                .filter((t: any) => t.path.endsWith('.ts') || t.path.endsWith('.js') || t.path.endsWith('.tsx') || t.path.endsWith('.jsx') || t.path.endsWith('.py') || t.path.endsWith('.json') || t.path.endsWith('.md'))
                .slice(0, 15); // Limit to 15 files to avoid long waiting times
                
              const fetchedFiles = await Promise.all(filesToFetch.map(async (f: any) => {
                const rawRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${f.path}`);
                const content = await rawRes.text();
                return { path: f.path, content };
              }));
              
              files = fetchedFiles;
            }
          }
        } catch (e) {
          console.error("Failed to fetch github", e);
        }
      }

      // Calculate basic metrics from provided files or use provided metrics
      const totalLoc = metrics?.linesOfCode || files.reduce((acc: number, f: any) => acc + f.content.split('\n').length, 0);
      const languages = Array.from(new Set(files.map((f: any) => {
        const ext = f.path.split('.').pop();
        if (ext === 'ts') return 'TypeScript';
        if (ext === 'tsx') return 'TSX';
        if (ext === 'py') return 'Python';
        if (ext === 'js') return 'JavaScript';
        if (ext === 'jsx') return 'JSX';
        if (ext === 'json') return 'JSON';
        if (ext === 'md') return 'Markdown';
        return ext;
      }))).filter(Boolean) as string[];

      const prompt = `You are a Precise Senior Software Architect.
TARGET PROJECT: ${target}

CORE DIRECTIVE: Provide a high-precision technical audit. 
IMPORTANT: You are seeing a SAMPLED VIEW (${files.length} out of ${fileCount} files). 
- DO NOT flag files as "missing" just because they aren't in this list. 
- DO NOT flag files as "truncated" or "broken at the end" if you see the marker "[SCANNED_PARTIAL_CONTENT]". This is a scanner limitation, not a code bug.
- Empty __init__.py files in Python are NORMAL and should NOT be flagged as empty modules.
- Only flag a "NOT RUNNABLE" verdict if you see a CRITICAL syntax error in a main entry point or a massive security hole that makes operation impossible.

AUDIT SCOPE:
- Security (Exposed secrets, weak fallbacks, injection).
- Architecture (Modularity, best practices).
- Code Quality (Logic flaws, performance).
- Accessibility & UX (WCAG 2.2, semantic HTML, missing roles/tabIndex, ARIA tags, contrast issues).

PROJECT CONTEXT:
Total Files in Project: ${fileCount}
Total Lines: ${totalLoc}
Languages: ${languages.join(', ')}

JSON STRUCTURE:
{
  "scores": { "security": 0-100, "architecture": 0-100, "codeQuality": 0-100, "dependencies": 0-100, "accessibility": 0-100 },
  "issues": [
    {
      "id": "UNIQ-ID",
      "title": "Clear Title",
      "description": "Technical description",
      "severity": "Critical" | "Major" | "Minor" | "Info",
      "category": "Security" | "Architecture" | "Code Quality" | "Dependencies" | "Accessibility/UX",
      "file": "Exact path",
      "line": number,
      "impact": "Honest impact analysis",
      "remediation": "Exact fix",
      "proLogs": {
        "snippet": "Code snippet or context",
        "payload": "Target payload or risk detail"
      },
      "learnHub": {
        "problem": "Simple explanation of the problem",
        "impact": "Why this is dangerous (impact)",
        "solution": "How to fix it in seconds"
      }
    }
  ],
  "overview": {
    "fileCount": ${fileCount},
    "linesOfCode": ${totalLoc},
    "languages": ${JSON.stringify(languages)},
    "projectType": "Detect from context",
    "functionsCount": number,
    "vulnerabilityCount": number,
    "performanceScore": 0-100
  },
  "missingParts": ["Only list things you are CERTAIN are missing from the ENTIRE project architecture"],
  "plan": { "fixNow": ["Immediate"], "next": ["Medium"], "later": ["Future"] },
  "assumptions": ["List context assumptions based on the partial view"],
  "runReadyVerdict": "Runnable" | "Not Runnable" | "Conditional"
}

CODE CONTENT:
${files.map((f: any) => {
  const isTruncated = f.content.length >= 10000;
  return `--- FILE: ${f.path} ${isTruncated ? '[SCANNED_PARTIAL_CONTENT]' : ''} ---\n${f.content.substring(0, 10000)}${isTruncated ? '\n... [CONTENT_TRUNCATED_BY_SCANNER]' : ''}`;
}).join('\n\n')}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
        },
      });

      let report;
      try {
        report = JSON.parse(response.text);
      } catch (parseError) {
        console.warn("JSON parse failed, returning raw text as fallback.");
        report = {
          scores: { security: 0, architecture: 0, codeQuality: 0, dependencies: 0, accessibility: 0 },
          issues: [],
          overview: {
            fileCount,
            linesOfCode: totalLoc,
            languages,
            projectType: "Unknown",
            functionsCount: 0,
            vulnerabilityCount: 0,
            performanceScore: 0
          },
          health: { emptyFiles: [], missingFiles: [], duplicateFiles: [], largeFiles: [] },
          missingParts: [],
          plan: { fixNow: [], next: [], later: [] },
          assumptions: [],
          runReadyVerdict: "Conditional",
          rawText: response.text
        };
      }
      res.json(report);
    } catch (error: any) {
      console.error("Scan error:", error);
      let msg = error.message || "Failed to analyze code.";
      
      if (typeof msg === 'string' && (msg.includes('503') || msg.includes('high demand') || msg.includes('UNAVAILABLE'))) {
        msg = "The AI model is currently experiencing high demand. Please wait a few moments and try again.";
      }
      
      res.status(500).json({ error: msg });
    }
  });

  // GitHub Connector
  app.post("/api/connectors/github", async (req, res) => {
    const { owner, repo, path: repoPath = '', token } = req.body;
    if (!owner || !repo) {
      return res.status(400).json({ error: "Owner and repo are required." });
    }
    try {
      const octokit = new Octokit({ auth: token }); // Will work without token for public repos (rate limited)
      const response = await octokit.repos.getContent({
        owner,
        repo,
        path: repoPath,
      });
      res.json(response.data);
    } catch (error: any) {
      console.error("GitHub connector error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch from GitHub" });
    }
  });

  // Google Drive Connector
  app.post("/api/connectors/drive", async (req, res) => {
    const { accessToken, fileId } = req.body;
    if (!accessToken) {
      return res.status(400).json({ error: "Google Drive Access Token is required." });
    }
    try {
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: accessToken });
      const drive = google.drive({ version: 'v3', auth: oauth2Client });
      
      if (fileId) {
        const response = await drive.files.get(
          { fileId: fileId, alt: 'media' },
          { responseType: 'arraybuffer' }
        );
        const buffer = Buffer.from(response.data as ArrayBuffer);
        const base64File = buffer.toString('base64');
        res.json({ fileBuffer: base64File });
      } else {
        const response = await drive.files.list({
          pageSize: 10,
          fields: 'nextPageToken, files(id, name, mimeType, webViewLink)',
        });
        res.json(response.data.files);
      }
    } catch (error: any) {
      console.error("Google Drive connector error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch from Google Drive" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

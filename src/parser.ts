import { Request, Response, Router } from 'express';

const parserRouter = Router();

interface ParseRequest {
  fileUrl?: string;
  fileBuffer?: string;
  fileName: string;
}

async function parseFileContent(fileName: string, buffer: Buffer): Promise<string> {
  const extension = fileName.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'md':
    case 'txt':
    case 'json':
    case 'js':
    case 'ts':
    case 'tsx':
    case 'csv':
    case 'html':
    case 'css':
      return buffer.toString('utf-8');

    case 'pdf':
      const pdfModule = await import('pdf-parse');
      const pdf = (pdfModule as any).default || pdfModule;
      const pdfData = await (pdf as any)(buffer);
      return pdfData.text;

    default:
      throw new Error(`امتداد الملف (.${extension}) غير مدعوم حالياً في نظام المعالجة.`);
  }
}

parserRouter.post('/process', async (req: Request, res: Response): Promise<void> => {
  try {
    const { fileUrl, fileBuffer, fileName } = req.body as ParseRequest;

    if (!fileName) {
      res.status(400).json({ error: 'اسم الملف (fileName) مطلوب لتحديد طريقة المعالجة.' });
      return;
    }

    let inputBuffer: Buffer;

    if (fileBuffer) {
      inputBuffer = Buffer.from(fileBuffer, 'base64');
    } else if (fileUrl) {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('فشل جلب الملف من الرابط السحابي المزود.');
      const arrayBuffer = await response.arrayBuffer();
      inputBuffer = Buffer.from(arrayBuffer);
    } else {
      res.status(400).json({ error: 'يجب تزويد إما fileBuffer كـ Base64 أو fileUrl لمعالجة الملف.' });
      return;
    }

    const extractedText = await parseFileContent(fileName, inputBuffer);

    const cleanedText = extractedText
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    res.status(200).json({
      success: true,
      fileName,
      characterCount: cleanedText.length,
      wordCount: cleanedText.split(/\s+/).filter(Boolean).length,
      extractedText: cleanedText
    });

  } catch (error: any) {
    console.error('خطأ أثناء معالجة الملف:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'حدث خطأ داخلي أثناء استخراج النصوص من الملف.'
    });
  }
});

export default parserRouter;

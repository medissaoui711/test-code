import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  type?: string;
  image?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  url = "https://testpilot.app",
  type = "website",
  image = "/og-image.jpg"
}) => {
  const { language, t } = useLanguage();

  const defaultTitle = t('nav.brand') + " - AI-Powered Code Quality Testing";
  const defaultDesc = "Automated AI-generated code quality & security testing platform. Detect vulnerabilities and get technical audit reports instantly.";
  const defaultKeywords = "AI code review, code quality, security testing, vulnerability scanner, AI audit, DevSecOps, generative engine optimization, LLM search optimization";

  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDesc;
  const finalKeywords = keywords || defaultKeywords;

  useEffect(() => {
    document.title = finalTitle;
    document.documentElement.lang = language;
    
    const setMetaTag = (attr: string, key: string, content: string) => {
      let element = document.querySelector(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMetaTag('name', 'description', finalDescription);
    setMetaTag('name', 'keywords', finalKeywords);
    
    // Open Graph
    setMetaTag('property', 'og:title', finalTitle);
    setMetaTag('property', 'og:description', finalDescription);
    setMetaTag('property', 'og:url', url);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:image', image);
    
    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', finalTitle);
    setMetaTag('name', 'twitter:description', finalDescription);
    setMetaTag('name', 'twitter:image', image);

    // AI Search Engines (GEO - Generative Engine Optimization)
    // Structured Data JSON-LD helps AI models like Gemini/ChatGPT understand the page context
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "TestPilot",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Web",
      "description": finalDescription,
      "url": url,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "creator": {
        "@type": "Organization",
        "name": "TestPilot AI"
      },
      "about": {
        "@type": "Thing",
        "name": "Artificial Intelligence Code Analysis"
      }
    };

    let scriptElement = document.querySelector('#json-ld-seo');
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = 'json-ld-seo';
      scriptElement.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptElement);
    }
    scriptElement.textContent = JSON.stringify(structuredData);

  }, [finalTitle, finalDescription, finalKeywords, url, type, image, language]);

  return null;
};

import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '50mb' }));

// Shared Gemini client with telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Helper to sanitize error messages so raw JSON dumps are never exposed to the UI
function parseGeminiError(error: any): { message: string; isQuota: boolean } {
  const raw = error?.message || String(error);
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      const errObj = parsed.error || parsed;
      const code = errObj.code;
      const msg = errObj.message || raw;
      if (
        code === 429 ||
        msg.includes('Quota exceeded') ||
        msg.includes('RESOURCE_EXHAUSTED') ||
        msg.includes('rate-limits')
      ) {
        return {
          message:
            'Gemini free-tier quota for image generation is exhausted or requires a billing-enabled key. We have automatically rendered an ultra-crisp Studio HD mockup for you!',
          isQuota: true,
        };
      }
      return { message: msg, isQuota: false };
    }
  } catch {
    // ignore parse error and proceed to string check
  }

  if (
    raw.includes('429') ||
    raw.includes('Quota exceeded') ||
    raw.includes('RESOURCE_EXHAUSTED') ||
    raw.includes('rate-limits')
  ) {
    return {
      message:
        'Gemini free-tier quota for image generation is exhausted or requires a billing-enabled key. We have automatically rendered an ultra-crisp Studio HD mockup for you!',
      isQuota: true,
    };
  }

  return { message: raw, isQuota: false };
}

// Check if Gemini API is configured
app.get('/api/gemini/status', (_req: Request, res: Response) => {
  const apiKey = process.env.GEMINI_API_KEY;
  res.json({
    configured: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
  });
});

// Generate high quality mockup images using gemini-3-pro-image-preview
// Supports 1K, 2K, and 4K image sizes
app.post('/api/generate-mockup-image', async (req: Request, res: Response) => {
  try {
    const { prompt, imageSize = '1K', aspectRatio = '1:1' } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Prompt is required.' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(400).json({
        error: 'Gemini API key is not configured. Please ensure GEMINI_API_KEY is provided in settings.',
        isQuota: false,
      });
      return;
    }

    // Validate imageSize (1K, 2K, 4K)
    const validSizes = ['1K', '2K', '4K'];
    const chosenSize = validSizes.includes(imageSize) ? imageSize : '1K';

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: `High-end professional commercial product photography mockup: ${prompt}. Photorealistic, 8k resolution, crisp studio lighting, depth of field, minimalist aesthetic, showroom ready.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio || '1:1',
          imageSize: chosenSize,
        },
      },
    });

    let imageUrl: string | null = null;
    let textDescription = '';

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mime};base64,${part.inlineData.data}`;
      } else if (part.text) {
        textDescription += part.text;
      }
    }

    if (!imageUrl) {
      res.status(500).json({
        error: 'No image was generated. Please adjust the prompt and try again.',
        details: textDescription,
        isQuota: false,
      });
      return;
    }

    res.json({
      imageUrl,
      modelUsed: 'gemini-3-pro-image-preview',
      imageSize: chosenSize,
      description: textDescription,
    });
  } catch (error: any) {
    const parsed = parseGeminiError(error);
    console.warn('Image generation status:', parsed.message);
    res.status(parsed.isQuota ? 429 : 500).json({
      error: parsed.message,
      isQuota: parsed.isQuota,
    });
  }
});

// Edit / transform mockup images using gemini-nano-banana-2.1
app.post('/api/edit-mockup-image', async (req: Request, res: Response) => {
  try {
    const { prompt, imageBase64, mimeType = 'image/png', imageSize = '1K', aspectRatio = '1:1' } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Edit prompt is required.' });
      return;
    }

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      res.status(400).json({ error: 'Base image is required for editing.' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(400).json({
        error: 'Gemini API key is not configured. Please ensure GEMINI_API_KEY is provided in settings.',
        isQuota: false,
      });
      return;
    }

    // Clean base64 data
    const cleanData = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const validSizes = ['1K', '2K', '4K'];
    const chosenSize = validSizes.includes(imageSize) ? imageSize : '1K';

    const response = await ai.models.generateContent({
      model: 'gemini-nano-banana-2.1',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanData,
              mimeType,
            },
          },
          {
            text: `Edit this product mockup image according to instructions: ${prompt}. Maintain product integrity and realism while applying the requested modifications.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio || '1:1',
          imageSize: chosenSize,
        },
      },
    });

    let imageUrl: string | null = null;
    let textDescription = '';

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mime};base64,${part.inlineData.data}`;
      } else if (part.text) {
        textDescription += part.text;
      }
    }

    if (!imageUrl) {
      res.status(500).json({
        error: 'Image editing did not return an updated image.',
        details: textDescription,
        isQuota: false,
      });
      return;
    }

    res.json({
      imageUrl,
      modelUsed: 'gemini-nano-banana-2.1',
      description: textDescription,
    });
  } catch (error: any) {
    const parsed = parseGeminiError(error);
    console.warn('Image editing status:', parsed.message);
    res.status(parsed.isQuota ? 429 : 500).json({
      error: parsed.message,
      isQuota: parsed.isQuota,
    });
  }
});

// AI Mockup Scene Ideas & Creative Styling using gemini-3.8-flash with timeout fallback
app.post('/api/ai-ideas', async (req: Request, res: Response) => {
  const { productType = 't-shirt', brandStyle = 'Modern Minimalist' } = req.body;
  const defaultIdeas = [
    {
      title: 'Nordic Sunlit Studio',
      prompt: `Clean Scandinavian aesthetic, folded ${productType} on warm oak wood table with soft morning sunlight casting organic window shadows and dried eucalyptus sprig.`,
    },
    {
      title: 'Urban Architectural Flatlay',
      prompt: `Modern streetwear flatlay of ${productType} on polished raw concrete, accompanied by sleek titanium EDC pen and minimalist ceramic espresso cup.`,
    },
    {
      title: 'Warm Cafe Lifestyle',
      prompt: `Close-up cozy lifestyle scene with a ceramic ${productType} on a rustic walnut bistro table next to an open hardcover sketchbook and hot latte art.`,
    },
    {
      title: 'High-Fashion Monochrome Editorial',
      prompt: `Dramatic editorial shoot of ${productType} with high-contrast split lighting, sculpted silk backdrop, and crisp fabric drape.`,
    },
  ];

  try {
    const ai = getGeminiClient();
    if (!ai) {
      res.json({ ideas: defaultIdeas });
      return;
    }

    // 5-second timeout promise
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI Ideas generation timed out')), 5000)
    );

    const callPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Generate 4 distinct, evocative commercial photography prompt ideas for showcasing a brand logo on a ${productType} with a ${brandStyle} aesthetic. Return as JSON array of objects with keys: "title" (short catchy name) and "prompt" (detailed photorealistic descriptive prompt).`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const response = await Promise.race([callPromise, timeoutPromise]);
    const parsed = JSON.parse(response.text?.trim() || '[]');
    res.json({ ideas: Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultIdeas });
  } catch (error) {
    // Always gracefully return default high quality ideas without failing
    res.json({ ideas: defaultIdeas });
  }
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`MockupCraft server running at http://0.0.0.0:${port}`);
  });
}

startServer();

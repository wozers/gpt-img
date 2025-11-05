import { NextRequest } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { createOllama } from 'ollama-ai-provider';
import { generateText } from 'ai';
import { Buffer } from 'buffer';
import path from 'path';
import { getPromptStyle, applyNegativeFilters } from '@/lib/prompt-styles';

const formatCaption = (caption: string, prefix: string, suffix: string, maxChars?: number): string => {
  // remove trailing comma from prefix
  const trimmedPrefix = prefix.trim().replace(/,$/, '');
  // remove leading comma from suffix
  const trimmedSuffix = suffix.trim().replace(/^,/, '');

  // lowercase the first letter
  caption = caption.charAt(0).toLowerCase() + caption.slice(1);
  // remove trailing period
  caption = caption.replace(/\.$/, '');

  // format prefix and suffix
  const prefixPart = trimmedPrefix ? `${trimmedPrefix}, ` : '';
  const suffixPart = trimmedSuffix ? `, ${trimmedSuffix}` : '';

  // remove newlines and multiple spaces
  let formatted = `${prefixPart}${caption}${suffixPart}`.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

  // Apply character limit if specified
  if (maxChars && formatted.length > maxChars) {
    formatted = formatted.substring(0, maxChars).trim();
    // Try to end at a word boundary
    const lastSpace = formatted.lastIndexOf(' ');
    if (lastSpace > maxChars * 0.8) {
      // Only trim to word boundary if we're not losing more than 20% of content
      formatted = formatted.substring(0, lastSpace).trim();
    }
  }

  return formatted;
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const images = formData.getAll('images') as File[];
  const prefix = (formData.get('prefix') as string) || '';
  const suffix = (formData.get('suffix') as string) || '';
  const systemMessage =
    (formData.get('systemMessage') as string) ||
    'Generate a concise, yet detailed comma-separated caption. Do not use markdown. Do not have an intro or outro.';
  const userPrompt =
    (formData.get('userPrompt') as string) ||
    'Describe this image, focusing on the main elements, style, and composition.';

  // Get service type and configuration
  const service = (formData.get('service') as string) || 'openai';
  const model = (formData.get('model') as string) || '';
  const detail = (formData.get('detail') as string) || 'auto';
  const apiKey = (formData.get('apiKey') as string) || process.env['OPENAI_API_KEY'];
  const ollamaUrl = (formData.get('ollamaUrl') as string) + '/api' || 'http://localhost:11434/api';
  const maxChars = formData.get('maxChars') ? parseInt(formData.get('maxChars') as string) : undefined;

  // Get prompt style for negative filtering
  const promptStyleId = (formData.get('promptStyleId') as string) || '';
  const promptStyle = promptStyleId ? getPromptStyle(promptStyleId) : undefined;
  const negativeFilters = promptStyle?.negativeFilters || [];

  // Create the appropriate client based on service
  let client: any;
  if (service === 'ollama') {
    client = createOllama({
      baseURL: ollamaUrl,
    });
  } else {
    // Default to OpenAI
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    client = createOpenAI({ apiKey });
  }

  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const buffer = await image.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');

        try {
          const { text } = await generateText({
            model: client(model),
            messages: [
              { role: 'system', content: systemMessage },
              {
                role: 'user',
                content: [
                  { type: 'text', text: userPrompt },
                  {
                    type: 'image',
                    image: `data:${image.type};base64,${base64Image}`,
                    providerOptions: {
                      openai: { imageDetail: detail as 'auto' | 'low' | 'high' },
                    },
                  },
                ],
              },
            ],
          });

          let caption = text;

          // Apply negative filters to remove meta-phrases
          if (negativeFilters.length > 0) {
            caption = applyNegativeFilters(caption, negativeFilters);
          }

          const formattedCaption = formatCaption(caption, prefix, suffix, maxChars);
          const txtFilename = `${path.parse(image.name).name}.txt`;
          controller.enqueue(`data: ${JSON.stringify({ filename: txtFilename, caption: formattedCaption })}\n\n`);
        } catch (error) {
          console.error('Error generating caption:', error);
          const txtFilename = `${path.parse(image.name).name}.txt`;
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          controller.enqueue(
            `data: ${JSON.stringify({ filename: txtFilename, caption: `Error: ${errorMessage}` })}\n\n`,
          );
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

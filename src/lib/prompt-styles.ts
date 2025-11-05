/**
 * Prompt style presets for different image generation models and tagging systems
 */

export type PromptStyle = {
  id: string;
  name: string;
  description: string;
  systemMessage: string;
  userPrompt: string;
  defaultMaxChars?: number;
};

export const promptStyles: PromptStyle[] = [
  {
    id: 'flux-generic',
    name: 'FLUX Generic',
    description: 'Generic FLUX model captions with natural language descriptions',
    systemMessage:
      'Generate a concise, yet detailed comma-separated caption for FLUX image generation. Focus on visual elements, composition, lighting, and style. Do not use markdown. Do not have an intro or outro.',
    userPrompt:
      'Describe this image in natural language, focusing on the subject, setting, lighting, composition, colors, mood, and artistic style. Use comma-separated phrases.',
    defaultMaxChars: 500,
  },
  {
    id: 'seeddream',
    name: 'Seeddream Style',
    description: 'Optimized for Seeddream model with emphasis on artistic details',
    systemMessage:
      'Create a detailed, artistic caption optimized for Seeddream image generation. Emphasize artistic style, technique, mood, and aesthetic qualities. Use descriptive, flowing language separated by commas. Do not use markdown.',
    userPrompt:
      'Analyze this image focusing on: artistic medium and technique, color palette and lighting, emotional mood and atmosphere, composition and perspective, fine details and textures, overall aesthetic style. Describe in a flowing, artistic manner.',
    defaultMaxChars: 600,
  },
  {
    id: 'nano-banana',
    name: 'Nano Banana Style',
    description: 'Nano Banana model with concise, focused descriptions',
    systemMessage:
      'Generate ultra-concise, keyword-rich captions for Nano Banana model. Focus on essential visual elements only. Use short comma-separated phrases. No markdown, no unnecessary words.',
    userPrompt:
      'List the key visual elements: main subject, primary colors, lighting type, background, notable objects, art style. Be extremely concise.',
    defaultMaxChars: 300,
  },
  {
    id: 'sdxl',
    name: 'SDXL (Stable Diffusion XL)',
    description: 'Stable Diffusion XL format with detailed scene descriptions',
    systemMessage:
      'Create detailed captions for SDXL training. Include subject details, environment, lighting, camera angle, art style, and quality descriptors. Use comma-separated format. Do not use markdown.',
    userPrompt:
      'Describe: main subject and pose, clothing/appearance details, environment and setting, lighting and time of day, camera angle and framing, art style (photograph, digital art, painting, etc.), quality indicators (high detail, 4k, professional, etc.). Use comma-separated descriptors.',
    defaultMaxChars: 550,
  },
  {
    id: 'booru',
    name: 'Booru Tags',
    description: 'Booru-style tagging system with underscored keywords',
    systemMessage:
      'Generate Booru-style tags. Use underscored lowercase keywords separated by commas. Include: character count (1girl, 2boys, etc.), appearance features, clothing, pose/action, setting, art style, quality tags. Do not use markdown or natural language.',
    userPrompt:
      'Tag this image in Booru format: start with character count, then physical features (hair_color, eye_color, body_type), clothing items, pose/expression, objects, background, art_style, quality_tags. Use underscored lowercase tags separated by commas.',
    defaultMaxChars: 400,
  },
  {
    id: 'wdtagger',
    name: 'WD Tagger Style',
    description: 'WaifuDiffusion tagger format with confidence-based tags',
    systemMessage:
      'Generate WaifuDiffusion-style tags focusing on anime/illustration characteristics. Use comma-separated tags prioritizing most relevant features. Include character traits, clothing, pose, setting, and art quality. Do not use markdown.',
    userPrompt:
      'Identify and list tags: character count and gender, hair details (color, length, style), eye color and expression, clothing items, pose and action, background elements, art style and quality. List most important tags first.',
    defaultMaxChars: 450,
  },
  {
    id: 'natural-language',
    name: 'Natural Language',
    description: 'Full sentence descriptions in natural language',
    systemMessage:
      'Generate natural, flowing descriptions in complete sentences. Describe the image as you would to someone who cannot see it. Be detailed but conversational. Do not use markdown.',
    userPrompt:
      'Describe this image in natural, flowing sentences. What do you see? Include details about subjects, actions, setting, colors, mood, and any notable elements. Write as if describing to a friend.',
    defaultMaxChars: 700,
  },
  {
    id: 'technical',
    name: 'Technical/Photography',
    description: 'Technical photography terms and camera settings style',
    systemMessage:
      'Generate captions using technical photography terminology. Include composition rules, lighting techniques, and photographic concepts. Use comma-separated format. Do not use markdown.',
    userPrompt:
      'Analyze using technical terms: subject and framing, composition rules (rule of thirds, leading lines, etc.), lighting setup (key light, fill, backlight), depth of field, color grading, camera angle, shot type (close-up, wide, etc.), photographic style.',
    defaultMaxChars: 500,
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Use your own custom system message and user prompt',
    systemMessage:
      'Generate a concise, yet detailed comma-separated caption. Do not use markdown. Do not have an intro or outro.',
    userPrompt:
      'Describe this image, focusing on the main elements, style, and composition.',
    defaultMaxChars: 500,
  },
];

/**
 * Get a prompt style by its ID
 */
export function getPromptStyle(id: string): PromptStyle | undefined {
  return promptStyles.find((style) => style.id === id);
}

/**
 * Get the default prompt style
 */
export function getDefaultPromptStyle(): PromptStyle {
  return promptStyles[0]; // FLUX Generic
}

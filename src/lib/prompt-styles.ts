/**
 * Prompt style presets for different image generation models and tagging systems
 */

export type PromptStyleFormat = 'tags' | 'semantic';

export type PromptStyle = {
  id: string;
  name: string;
  description: string;
  format: PromptStyleFormat;
  systemMessage: string;
  userPrompt: string;
  defaultMaxChars?: number;
  negativeFilters?: string[];
};

// Common negative phrases to filter out
const commonMetaPhrases = [
  'this image shows',
  'the image depicts',
  'this picture shows',
  'the picture depicts',
  'the photo shows',
  'this photo shows',
  'we can see',
  'you can see',
  'there is a',
  'there are',
  'it appears',
  'it seems',
  'looking at',
];

export const promptStyles: PromptStyle[] = [
  {
    id: 'flux-semantic',
    name: 'FLUX (Semantic)',
    description: 'Natural language descriptions in semantic sentences',
    format: 'semantic',
    systemMessage:
      'Generate a detailed, natural language caption for FLUX image generation. Use complete phrases and descriptive language. Focus on visual elements, composition, lighting, and style. Describe directly without meta-commentary. No markdown.',
    userPrompt:
      'Describe the image directly: subject and pose, clothing and appearance, environment and setting, lighting and mood, colors and textures, artistic style. Use natural, flowing phrases separated by commas.',
    defaultMaxChars: 500,
    negativeFilters: commonMetaPhrases,
  },
  {
    id: 'sdxl-tags',
    name: 'SDXL (Tags)',
    description: 'Tag-based format with comma-separated descriptors',
    format: 'tags',
    systemMessage:
      'Generate SDXL training tags. Use concise, comma-separated descriptors. Include: subject details, clothing, pose, environment, lighting, camera angle, art medium, quality tags. Use direct tags only, no sentences or meta-phrases.',
    userPrompt:
      'Tag: subject and pose, clothing items, environment type, lighting condition, camera angle, shot distance, art medium (photograph/digital art/painting), quality level, specific details. Use comma-separated tags.',
    defaultMaxChars: 450,
    negativeFilters: commonMetaPhrases,
  },
  {
    id: 'booru-tags',
    name: 'Booru (Tags)',
    description: 'Booru-style underscored tags',
    format: 'tags',
    systemMessage:
      'Generate Booru-style tags. Use underscored lowercase keywords separated by commas. Start with character count (1girl, 2boys, etc.), then appearance, clothing, pose, setting, art_style, quality. No natural language or meta-phrases.',
    userPrompt:
      'Tag in Booru format: character_count, hair_color, eye_color, clothing_items, body_pose, facial_expression, background_type, art_style, quality_level. Use underscored lowercase tags.',
    defaultMaxChars: 400,
    negativeFilters: commonMetaPhrases,
  },
  {
    id: 'seeddream-semantic',
    name: 'SeedDream (Semantic)',
    description: 'Artistic, flowing descriptions with aesthetic focus',
    format: 'semantic',
    systemMessage:
      'Create artistic captions for SeedDream. Emphasize aesthetic qualities, artistic technique, mood, and visual atmosphere. Use descriptive, evocative language. No meta-commentary or markdown.',
    userPrompt:
      'Describe artistically: medium and technique, color harmony and palette, lighting and atmosphere, emotional mood, composition and flow, textural details, aesthetic qualities. Use evocative, flowing phrases.',
    defaultMaxChars: 550,
    negativeFilters: commonMetaPhrases,
  },
  {
    id: 'nano-banana-tags',
    name: 'Nano Banana (Tags)',
    description: 'Ultra-concise keyword tags',
    format: 'tags',
    systemMessage:
      'Generate ultra-concise tags for Nano Banana. Use minimal keywords only. Focus on essential visual elements. Comma-separated, no filler words or meta-phrases.',
    userPrompt:
      'List key elements only: subject, colors, lighting, setting, objects, style. Maximum brevity. Single word or two-word tags.',
    defaultMaxChars: 250,
    negativeFilters: commonMetaPhrases,
  },
  {
    id: 'human-character',
    name: 'Human Character',
    description: 'Structured human description with mandatory fields',
    format: 'semantic',
    systemMessage:
      'Generate a structured human character caption covering all mandatory fields: face (gaze, expression, skin texture), hair (style, color, length), clothing (specific items, colors, fit), body posture (stance, weight distribution, limb position), anatomy (proportions, visible features), hands (position, gesture, visibility), environment (setting, background elements), lighting (direction, quality, shadows), composition (framing, angle, distance). Use neutral, precise language. No demographic assumptions. Describe only what is visible.',
    userPrompt:
      'Describe the human character systematically:\n1. Face: gaze direction, facial expression, skin texture and tone\n2. Hair: style, color, length, texture\n3. Clothing: specific garments, colors, fit, style\n4. Body posture: stance (standing/sitting/etc), weight distribution, shoulder position, hip position\n5. Anatomy: body proportions, visible physical features, build\n6. Hands: position, gesture, visibility, what they hold or touch\n7. Environment: immediate surroundings, background elements, spatial context\n8. Lighting: light source direction, quality (soft/harsh), shadows, highlights\n9. Composition: camera angle, shot distance (close-up/medium/wide), framing\n10. Pose hint: specific pose description (e.g., "standing, weight on left leg, right hand raised, shoulders relaxed, head tilted slightly")\n\nUse neutral, descriptive language. Avoid unnecessary demographics. Focus on observable details.',
    defaultMaxChars: 700,
    negativeFilters: [...commonMetaPhrases, 'appears to be', 'seems to be', 'looks like'],
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Define your own prompts and format',
    format: 'semantic',
    systemMessage:
      'Generate a detailed caption. Do not use markdown. Do not use meta-phrases like "this image shows".',
    userPrompt: 'Describe this image, focusing on the main elements, style, and composition.',
    defaultMaxChars: 500,
    negativeFilters: commonMetaPhrases,
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
  return promptStyles[0]; // FLUX Semantic
}

/**
 * Apply negative filters to a caption
 * Removes meta-phrases and cleans up the text
 */
export function applyNegativeFilters(caption: string, filters: string[]): string {
  let cleaned = caption;

  // Remove negative phrases (case insensitive)
  for (const filter of filters) {
    const regex = new RegExp(`\\b${filter}\\b`, 'gi');
    cleaned = cleaned.replace(regex, '').trim();
  }

  // Clean up extra spaces and commas
  cleaned = cleaned.replace(/\s+/g, ' '); // Multiple spaces to single
  cleaned = cleaned.replace(/,\s*,/g, ','); // Multiple commas to single
  cleaned = cleaned.replace(/^[,\s]+/, ''); // Leading commas/spaces
  cleaned = cleaned.replace(/[,\s]+$/, ''); // Trailing commas/spaces

  // Capitalize first letter if needed
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  return cleaned;
}

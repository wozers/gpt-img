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
    id: 'character-flux',
    name: 'Character FLUX',
    description: 'Comprehensive character LoRA training with tattoo/text preservation (100-150 words)',
    format: 'semantic',
    systemMessage:
      'You are a specialized caption generator for Flux LoRa character training. Generate comprehensive natural language descriptions that preserve fine details like text tattoos, accessories, and defining features.\n\nCRITICAL RULES:\n1. Start every caption with [TRIGGER] placeholder\n2. ALWAYS describe permanent features consistently: tattoos (including exact text if visible), distinctive markings, accessories worn in multiple images\n3. Caption both permanent features AND variables (clothing, environment, pose)\n4. For text tattoos: transcribe the exact text and describe placement\n5. Be exhaustive about visible details - Flux\'s T5 encoder handles 200+ tokens well\n6. Use flowing natural language, but be highly specific\n7. Target 100-150 words for character LoRas\n\nSTRUCTURE (as natural prose): [TRIGGER] + medium + detailed permanent features (tattoos with text, consistent accessories) + current clothing details + pose/action + environment description + lighting + camera angle\n\nTEXT TATTOOS: Always format as: "[exact text] tattoo on [location]"\nEXAMPLE: "\'KARMA\' text tattoo in capital letters on front of neck below chin"',
    userPrompt:
      'Describe this image in comprehensive natural language for Flux character LoRa training, preserving all fine details.\n\nFollow this structure as flowing prose (100-150 words):\n\n1. Start with [TRIGGER]\n2. Identify medium (photograph/digital art)\n3. COMPREHENSIVELY describe all visible tattoos:\n   - For text tattoos: transcribe exact text in quotes, specify exact placement\n   - For image tattoos: describe subject, style, and precise location\n   - Include visibility (partially visible, fully visible, obscured)\n4. Describe any consistent accessories (jewelry, piercings)\n5. Describe current variable clothing with specific colors, styles, and fit\n6. Describe the action, pose, and body positioning in detail\n7. Describe environment with specific elements and spatial relationships\n8. Describe lighting: direction, quality (harsh/soft), color temperature, shadows\n9. Describe camera: angle, distance, framing, perspective\n\nBe exhaustively detailed on permanent features (tattoos, jewelry) and precise about variables. Flux handles long captions well - use the full 150 words.',
    defaultMaxChars: 750,
    negativeFilters: [...commonMetaPhrases, 'appears to be', 'seems to be', 'looks like', 'might be'],
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
    id: 'character-sdxl',
    name: 'Character SDXL',
    description: 'Character LoRA training with permanent feature focus (60-90 words)',
    format: 'semantic',
    systemMessage:
      'You are a specialized caption generator for SDXL LoRa character training. Generate detailed natural language descriptions focusing on permanent features and key variables.\n\nCRITICAL RULES:\n1. Start every caption with [TRIGGER] placeholder\n2. ALWAYS describe permanent tattoos consistently, including text content\n3. Prioritize important details - SDXL prefers 60-90 words\n4. Use complete sentences with natural flow\n5. For text tattoos: include exact text in quotes and location\n6. Balance permanent features with variable elements (clothing, setting, pose)\n\nSTRUCTURE (as natural prose): [TRIGGER] + medium + key permanent features (tattoos with text) + clothing + pose + environment + lighting + camera angle',
    userPrompt:
      'Describe this image in detailed natural language for SDXL character LoRa training (60-90 words).\n\nStructure as flowing prose:\n\n1. Start with [TRIGGER]\n2. Describe visible tattoos including exact text for text tattoos (e.g., "\'KARMA\' tattoo on neck")\n3. Describe key accessories (jewelry)\n4. Describe clothing with colors and style\n5. Describe pose/action\n6. Describe environment briefly\n7. Describe lighting and camera angle\n\nPrioritize tattoo details and then most visually important elements. Keep total under 90 words while maintaining natural sentence flow.',
    defaultMaxChars: 500,
    negativeFilters: [...commonMetaPhrases, 'appears to be', 'seems to be', 'looks like', 'might be'],
  },
  {
    id: 'booru-tags',
    name: 'Booru (Tags)',
    description: 'Booru-style underscored tags following Danbooru/WD14 conventions',
    format: 'tags',
    systemMessage:
      'You generate booru-style tags. Output one line with lowercase tags separated by commas. Use underscores for multi-word tags. Order: subject count first (1girl, 1boy, 1person, 2girls, etc.), then anatomy or body parts visible, hair color and length, eye color, clothing items, actions or pose, camera view, environment, lighting, style. Avoid adjectives that are not part of common booru vocabulary. Do not invent artist tags. No sentences, no natural language.',
    userPrompt:
      'Generate one booru tag line for this image. Lowercase, comma separated, use underscores for multi-word tags. Start with subject count (1girl, 1boy, or 1person). Then anatomy/body parts visible, hair details, eye color, clothing items, action/pose, camera view (close-up, medium_shot, full_body, etc.), environment, lighting, art style. Follow Danbooru/WD14 tag conventions. No sentences.',
    defaultMaxChars: 400,
    negativeFilters: commonMetaPhrases,
  },
  {
    id: 'seeddream-semantic',
    name: 'SeedDream (Semantic)',
    description: 'Natural language 25-45 words with composition and mood focus',
    format: 'semantic',
    systemMessage:
      'You generate SeedDream-style semantic captions. Output one to two English sentences, 25–45 words total. Use evocative but concrete language. Always include subject and action, composition and lens or perspective, lighting and color palette, and stylistic intent or genre. Keep it readable, no tag spam. Emphasize mood and art direction since SeedDream supports rich natural language. No markdown, no meta-phrases.',
    userPrompt:
      'Create a SeedDream semantic caption. One or two sentences, 25–45 words total. Include: subject and action, composition or lens perspective, lighting and color palette, and stylistic intent or genre. Use natural, flowing language. No tag lists, no bullet points. Be evocative but concrete.',
    defaultMaxChars: 300,
    negativeFilters: commonMetaPhrases,
  },
  {
    id: 'nano-banana-tags',
    name: 'Nano Banana (Tags)',
    description: 'Ultra-minimal 8-12 keyword tokens',
    format: 'tags',
    systemMessage:
      'You generate ultra-concise tag keywords. Output one line with 8–12 comma-separated tokens. Only the most essential subject, action, environment, lighting, and one style term. No sentences, no weights, no negatives. Keep it minimal and focused.',
    userPrompt:
      'Produce one ultra-short keyword line for this image. 8–12 comma-separated tokens that cover: subject, action, environment, lighting, and one style term. Maximum brevity. No full sentences, no prompt weights, no negative prompts.',
    defaultMaxChars: 150,
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

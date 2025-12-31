/**
 * Caption Templates for Different AI Models
 *
 * These templates are optimized for specific AI image generation models
 * based on community best practices and official documentation.
 */

export interface CaptionTemplate {
  id: string;
  name: string;
  description: string;
  systemMessage: string;
  userPrompt: string;
  modelType: 'general' | 'z-image' | 'flux' | 'sdxl';
  category: 'general' | 'person' | 'style';
}

export const captionTemplates: CaptionTemplate[] = [
  // Default General Template
  {
    id: 'default-general',
    name: 'Default General',
    description: 'Standard captioning for most models',
    systemMessage:
      'Generate a concise, yet detailed comma-separated caption. Do not use markdown. Do not have an intro or outro.',
    userPrompt: 'Describe this image, focusing on the main elements, style, and composition.',
    modelType: 'general',
    category: 'general',
  },

  // Z-IMAGE General Template
  {
    id: 'z-image-general',
    name: 'Z-IMAGE General',
    description: 'Optimized for Z-IMAGE/Z-IMAGE Turbo - detailed natural language (80-250 words)',
    systemMessage:
      'You are a professional image captioner for Z-IMAGE model training. Generate detailed, natural language descriptions in 80-250 words. Use structured, camera-direction style descriptions. Do NOT use markdown, bullet points, or conversational intros/outros. Output ONLY the caption text. Remember: Z-IMAGE does not use negative prompts, so include all constraints positively (e.g., "correct human anatomy, no extra limbs" instead of relying on negative prompts).',
    userPrompt: `Provide a comprehensive description following this structure:

[Shot type & Subject] - Specify the framing (close-up, medium shot, wide shot, full-body) and viewing angle (front view, 45° angle, profile, looking up/down)

[Main Elements] - Describe the primary subjects, objects, and their relationships in detail

[Environment & Setting] - Detail the location, background elements, spatial arrangement

[Lighting & Atmosphere] - Describe light sources, quality (soft/hard), direction, time of day, overall mood

[Colors & Textures] - Specify dominant colors, materials, surface qualities

[Composition & Style] - Camera settings implied (depth of field, focal length), artistic style, overall aesthetic

[Technical Quality] - Resolution indicators, clarity, focus points

Include explicit details about: correct anatomy, proper proportions, sharp focus, clean composition. Specify "no text, no watermarks, no logos" if image should be clean. Keep description flowing and natural, like professional photography direction.`,
    modelType: 'z-image',
    category: 'general',
  },

  // Z-IMAGE Person Template
  {
    id: 'z-image-person',
    name: 'Z-IMAGE Person/Portrait',
    description: 'Optimized for Z-IMAGE person/portrait training - detailed, safe, professional (80-250 words)',
    systemMessage:
      'You are a professional portrait captioner for Z-IMAGE model training. Generate detailed, natural language descriptions in 80-250 words specifically for person/portrait images. Use structured descriptions that specify age, appearance, clothing, pose, and setting clearly. Do NOT use markdown, bullet points, or conversational text. Output ONLY the caption. Always maintain professional, safe-for-work descriptions with explicit age and coverage specifications.',
    userPrompt: `Provide a detailed portrait description following this structure:

[Shot Type & Angle] - Specify framing (headshot, medium shot, full-body portrait, environmental portrait) and camera angle (straight-on, 45°, slightly above/below eye level)

[Subject Details] - ALWAYS specify:
  - Age category explicitly (e.g., "adult woman in her 30s", "adult man in his 20s")
  - Physical features: hair (color, length, style), facial features, skin tone, body type
  - Expression and emotion (calm, confident, thoughtful, smiling, neutral)

[Clothing & Coverage] - Provide detailed descriptions:
  - Specific garments (business suit, casual sweater, formal dress)
  - Colors, patterns, textures, fit
  - Coverage level (fully clothed, modest, professional attire)
  - Accessories if visible (glasses, jewelry, watch)

[Pose & Body Language] - Describe position, gesture, stance, what they're doing

[Environment & Context] - Setting (office, outdoor park, studio, home interior), background details (blurred, detailed, plain), props or objects

[Lighting] - Light direction, quality (soft window light, studio lighting, natural daylight), how it affects the subject

[Mood & Atmosphere] - Overall feeling, professional/casual tone, color grading

[Technical & Safety] - Include: "correct human anatomy, proper proportions, natural pose, realistic photography, sharp focus, no extra limbs". Add "safe for work, professional context, modest presentation" for portraits. Specify "plain background" or background style, and "no text, no watermarks".

Keep the description flowing naturally like professional photography direction, not a list.`,
    modelType: 'z-image',
    category: 'person',
  },

  // Z-IMAGE LoRA Training Simplified Template
  {
    id: 'z-image-lora-simple',
    name: 'Z-IMAGE LoRA Training (Simple)',
    description: 'Simplified captions for Z-IMAGE LoRA training - model learns features automatically',
    systemMessage:
      'You are captioning images for Z-IMAGE LoRA training. Generate simple, concise captions that describe only the essential elements. The model will learn consistent features automatically, so avoid over-describing repeated elements. Keep captions to 1-2 sentences unless the image has unusual elements that need specification. Do NOT use markdown or conversational text.',
    userPrompt: `Generate a simple, concise caption describing:
- The main subject and action
- Key pose or expression (if person)
- Notable setting or background (if different from usual)
- Any unique elements (e.g., "wearing glasses", "holding umbrella", "at night")

Keep it brief and natural. Example: "Adult woman with brown hair sitting at a cafe table, smiling at camera, casual blue sweater, warm afternoon lighting"

Only elaborate on elements that are unusual or important to capture for this specific image.`,
    modelType: 'z-image',
    category: 'general',
  },
];

/**
 * Get templates filtered by model type
 */
export function getTemplatesByModel(modelType: CaptionTemplate['modelType']): CaptionTemplate[] {
  return captionTemplates.filter((t) => t.modelType === modelType || t.modelType === 'general');
}

/**
 * Get templates filtered by category
 */
export function getTemplatesByCategory(category: CaptionTemplate['category']): CaptionTemplate[] {
  return captionTemplates.filter((t) => t.category === category);
}

/**
 * Get a specific template by ID
 */
export function getTemplateById(id: string): CaptionTemplate | undefined {
  return captionTemplates.find((t) => t.id === id);
}

/**
 * Get all available model types
 */
export function getAvailableModelTypes(): CaptionTemplate['modelType'][] {
  return Array.from(new Set(captionTemplates.map((t) => t.modelType)));
}

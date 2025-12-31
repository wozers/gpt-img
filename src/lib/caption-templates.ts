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
    description: 'Standard captioning for most models (not optimized for Z-IMAGE LoRA training)',
    systemMessage:
      'Generate a concise, yet detailed comma-separated caption. Do not use markdown. Do not have an intro or outro.',
    userPrompt: 'Describe this image, focusing on the main elements, style, and composition.',
    modelType: 'general',
    category: 'general',
  },

  // Z-IMAGE Character LoRA (Trigger Only)
  {
    id: 'z-image-character-trigger',
    name: 'Z-IMAGE Character LoRA (Trigger Only)',
    description: 'Single trigger word - focuses 100% training energy on character features (recommended)',
    systemMessage:
      'You are creating TRAINING CAPTIONS for Z-IMAGE character LoRA. Generate ONLY a unique trigger word/token for each image. This focuses all training energy on learning the character\'s unique features. Do NOT describe the character\'s appearance - the model will learn this automatically. Do NOT use conversational text or markdown. Output ONLY the trigger word.',
    userPrompt: `Generate a single, unique trigger word/token for this character.

Guidelines:
- Use a distinctive, non-common word to avoid vocabulary collisions
- Examples: "j0hnd0e", "alicechar", "cyb3rpunk_guy", "mystic_woman"
- Can include underscores or numbers for uniqueness
- Must be consistent across all images of the same character
- Output ONLY the trigger word, nothing else

Example outputs:
"chr_alex"
"m4r1a_character"
"detective_jones"`,
    modelType: 'z-image',
    category: 'person',
  },

  // Z-IMAGE Character LoRA (Trigger + Context)
  {
    id: 'z-image-character-context',
    name: 'Z-IMAGE Character LoRA (Trigger + Context)',
    description: 'Trigger word + minimal context - excludes background/props from learning',
    systemMessage:
      'You are creating TRAINING CAPTIONS for Z-IMAGE character LoRA. Generate a trigger word followed by minimal context description. Caption what you DON\'T want the model to learn (background, props, temporary clothing) but DO NOT caption defining features you WANT it to learn (face, hair, body features). Keep it simple - 1 short sentence. Do NOT use markdown.',
    userPrompt: `Generate a caption with this format: [trigger_word], [context elements to exclude]

What to caption:
- Trigger word (must be first)
- Background setting (to exclude from character learning)
- Temporary props or objects (to exclude)
- Non-defining clothing items (optional)

What NOT to caption:
- Character's face, hair, or defining physical features
- Character's signature outfit or style
- Character's unique attributes

Examples:
"j0hnd0e, office background, holding coffee cup"
"alicechar, outdoor park setting, wearing glasses"
"cyb3r_sam, city street, night scene"
"m4r1a, indoor studio, plain background"

Keep it SHORT - the model learns character features automatically.`,
    modelType: 'z-image',
    category: 'person',
  },

  // Z-IMAGE Style LoRA (Caption-Only)
  {
    id: 'z-image-style-caption',
    name: 'Z-IMAGE Style LoRA (Caption-Only)',
    description: 'Neutral descriptions without style keywords - learns pure visual style',
    systemMessage:
      'You are creating TRAINING CAPTIONS for Z-IMAGE style LoRA. Describe the subject neutrally WITHOUT mentioning the style itself. Treat the image as if it\'s a normal photograph, even if it\'s a drawing, painting, or stylized. The model will learn the visual style automatically. Do NOT use style descriptors like "cartoon", "anime", "oil painting", "sketch", etc. Keep captions simple and factual. Do NOT use markdown.',
    userPrompt: `Describe what you see in the image without mentioning artistic style.

DO describe:
- The subject (person, object, animal, scene)
- Actions or poses
- Setting or environment
- Basic composition

DO NOT mention:
- Artistic style ("watercolor", "anime", "3D render", "sketch")
- Visual qualities ("stylized", "artistic", "illustrated")
- Medium ("painting", "drawing", "digital art")
- Art movements or styles ("impressionist", "cyberpunk style")

Examples:
❌ "A cartoon character standing in a forest"
✅ "A person standing in a forest"

❌ "An oil painting of a vase with flowers"
✅ "A vase with flowers on a table"

❌ "Anime-style girl with pink hair"
✅ "A woman with pink hair, smiling"

Describe it as if it's a regular photograph, even if it clearly isn't. The style will be learned automatically.`,
    modelType: 'z-image',
    category: 'general',
  },

  // Z-IMAGE Concept LoRA
  {
    id: 'z-image-concept-lora',
    name: 'Z-IMAGE Concept LoRA',
    description: 'For specific objects/props - associates visual features with text descriptions',
    systemMessage:
      'You are creating TRAINING CAPTIONS for Z-IMAGE concept LoRA. Generate captions that describe the specific object, prop, or concept you want to teach the model. Include a trigger word and describe the concept\'s appearance, context, and variations. Keep captions focused but descriptive (2-4 sentences). This helps the model associate visual features with text descriptions. Do NOT use markdown.',
    userPrompt: `Generate a caption for this concept/object following this format:

[trigger_word] [detailed description of the concept]

Structure:
1. Start with a unique trigger word for this concept
2. Describe what the object/concept IS
3. Include key visual characteristics (color, shape, material, details)
4. Mention context or how it's being used (if relevant)
5. Note any variations in this specific image

Examples:
"retro_phone, a vintage rotary telephone with cream-colored plastic casing, round dial with numbers, sitting on a wooden desk"

"magic_staff, an ornate wooden staff with glowing blue crystal at the top, intricate carved patterns along the shaft, held by a hand"

"cyber_helmet, futuristic motorcycle helmet with angular design, metallic silver finish, tinted blue visor, LED accent lights on the sides"

Keep focused on the concept itself, not elaborate scene descriptions. The model needs to learn what THIS specific object/concept looks like.`,
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

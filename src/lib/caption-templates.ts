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
    description: 'Use Caption Prefix for trigger word - caption will be empty (recommended for character LoRAs)',
    systemMessage:
      'You are creating TRAINING CAPTIONS for Z-IMAGE character LoRA using the "trigger only" method. Since the user has provided the trigger word in the Caption Prefix field, you should output NOTHING. The caption should be completely empty. The trigger word from the prefix is sufficient. Do NOT describe the character, do NOT repeat the trigger word, do NOT add any text. Output should be completely empty or just a single space.',
    userPrompt: `IMPORTANT: Output an empty caption.

The user has already set their trigger word in the "Caption Prefix" field above.
For "trigger only" training, the caption should be empty - just the trigger word is used.

Output: (leave empty or output a single space)`,
    modelType: 'z-image',
    category: 'person',
  },

  // Z-IMAGE Character LoRA (Trigger + Context)
  {
    id: 'z-image-character-context',
    name: 'Z-IMAGE Character LoRA (Trigger + Context)',
    description: 'Use Caption Prefix for trigger word - caption describes context to exclude from learning',
    systemMessage:
      'You are creating TRAINING CAPTIONS for Z-IMAGE character LoRA. The user has provided the trigger word in the Caption Prefix field. Generate ONLY the minimal context description. Caption what you DON\'T want the model to learn (background, props, temporary clothing) but DO NOT caption defining features you WANT it to learn (face, hair, body features). Keep it very short - just list context elements. Do NOT repeat the trigger word, do NOT use markdown.',
    userPrompt: `Generate ONLY the context part of the caption (the trigger word is already in the Prefix field).

Describe what to EXCLUDE from character learning:
- Background setting (e.g., "office interior", "outdoor park", "studio")
- Temporary props or objects (e.g., "holding coffee cup", "wearing sunglasses")
- Non-defining clothing items if needed (e.g., "blue jacket")
- Environmental context (e.g., "night scene", "rainy weather")

What NOT to caption:
- DO NOT include trigger word (it's already in the prefix)
- DO NOT describe character's face, hair, or defining physical features
- DO NOT describe character's signature outfit or unique style
- DO NOT describe character's unique attributes

Examples (context only, without trigger word):
"office background, holding coffee cup"
"outdoor park setting, wearing sunglasses"
"city street, night scene"
"indoor studio, plain white background"
"forest setting, holding backpack"

Keep it VERY SHORT - just essential context to exclude.`,
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
    description: 'Use Caption Prefix for trigger word - caption provides detailed object/concept description',
    systemMessage:
      'You are creating TRAINING CAPTIONS for Z-IMAGE concept LoRA. The user has provided the trigger word in the Caption Prefix field. Generate a focused, detailed description of the specific object, prop, or concept. Describe what the object IS, its key visual characteristics (color, shape, material, details), and context. Keep it descriptive but focused (2-4 sentences). Do NOT repeat the trigger word, do NOT use markdown.',
    userPrompt: `Generate a detailed description of the concept/object (the trigger word is already in the Prefix field).

Describe:
1. What the object/concept IS (the category/type)
2. Key visual characteristics:
   - Color, finish, material
   - Shape, size, proportions
   - Distinctive details, patterns, textures
3. Context or usage (if visible in this image)
4. Any variations specific to this image

Examples (without trigger word):
"a vintage rotary telephone with cream-colored plastic casing, round dial with numbers, sitting on a wooden desk"

"an ornate wooden staff with glowing blue crystal at the top, intricate carved patterns along the shaft, held by a hand"

"futuristic motorcycle helmet with angular design, metallic silver finish, tinted blue visor, LED accent lights on the sides"

"hand-woven wicker basket with brown and tan pattern, curved handle, filled with red apples"

Keep focused on the concept itself, 2-4 sentences. The model needs to learn what THIS specific object looks like.`,
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

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

  // FLUX 2 Character/Person LoRA
  {
    id: 'flux-2-character',
    name: 'FLUX 2 Character/Person LoRA',
    description: 'Detailed natural language for FLUX 2 (40-100 words) - use Caption Prefix for trigger word',
    systemMessage:
      'You are creating TRAINING CAPTIONS for FLUX 2 character LoRA. FLUX 2 uses Mistral-3 text encoder and understands detailed natural language exceptionally well. The user has provided the trigger word in the Caption Prefix field. Generate a detailed, natural language description in full sentences (40-100 words). Focus on precise details that matter for learning the character: age, physical features, clothing, expression, pose, lighting, and setting. Write naturally as if describing a photograph to someone, NOT as tag lists. Do NOT repeat the trigger word, do NOT use markdown.',
    userPrompt: `Generate a detailed natural language description of this person (40-100 words).

The trigger word is already in the Caption Prefix field.

Write in full sentences describing:
1. Age and demographic (e.g., "a young woman in her late twenties")
2. Physical features in detail:
   - Hair: color, length, style, texture
   - Eyes: color, expression
   - Skin: tone, notable features (freckles, etc.)
   - Facial features: shape, distinguishing characteristics
3. Clothing: specific items, colors, style, fit
4. Expression and demeanor: emotion, gaze direction, posture
5. Pose and body language: position, what they're doing
6. Lighting: type, direction, quality (e.g., "soft natural window light")
7. Background/setting: environment, depth, details

Example style (DO NOT copy, adapt to the actual image):
"A professional photograph of a young woman in her late twenties with shoulder-length brown hair styled in loose waves, warm brown eyes, fair skin with subtle freckles across her nose, wearing natural makeup with defined eyeliner, dressed in a casual navy blue sweater, looking directly at the camera with a gentle smile in soft natural window light against a blurred outdoor background."

Write naturally, use full sentences, be specific and detailed. 40-100 words.`,
    modelType: 'flux',
    category: 'person',
  },

  // FLUX 2 Style LoRA
  {
    id: 'flux-2-style',
    name: 'FLUX 2 Style LoRA',
    description: 'Detailed natural language describing subjects without style keywords (40-100 words)',
    systemMessage:
      'You are creating TRAINING CAPTIONS for FLUX 2 style LoRA. FLUX 2 uses Mistral-3 text encoder and understands natural language exceptionally well. Describe what you see in detailed, natural language (40-100 words) WITHOUT mentioning the artistic style, medium, or visual aesthetic. Treat every image as if it\'s a normal photograph, even if it\'s clearly stylized, drawn, or painted. Write in full sentences. The model will learn the visual style automatically from the images themselves. Do NOT use markdown.',
    userPrompt: `Describe what you see in natural, detailed language (40-100 words) WITHOUT mentioning style.

Write in full sentences about:
- The subject (person, object, animal, scene)
- Their appearance, features, characteristics
- Actions, poses, expressions
- Clothing or attributes
- Setting and environment
- Composition and arrangement
- Lighting and atmosphere

DO NOT mention:
- Artistic style (watercolor, anime, cartoon, illustration, etc.)
- Medium (painting, drawing, digital art, 3D render, etc.)
- Visual qualities (stylized, artistic, graphic, etc.)
- Art movements (impressionist, art nouveau, cyberpunk aesthetic, etc.)

Example:
❌ "An anime-style illustration of a magical girl with pink hair in a fantasy setting with sparkles"
✅ "A young woman with vibrant pink hair flowing past her shoulders, wearing an ornate white and pink dress with ribbons and bows, standing in a dreamy outdoor setting with floating light particles around her, one hand raised gracefully as she gazes upward with a gentle expression"

Describe it as a photograph. Full sentences. Natural language. 40-100 words.`,
    modelType: 'flux',
    category: 'general',
  },

  // FLUX 2 Concept/Object LoRA
  {
    id: 'flux-2-concept',
    name: 'FLUX 2 Concept/Object LoRA',
    description: 'Detailed natural language for objects/concepts (40-100 words) - use Caption Prefix for trigger',
    systemMessage:
      'You are creating TRAINING CAPTIONS for FLUX 2 concept LoRA. FLUX 2 uses Mistral-3 text encoder and understands detailed natural language exceptionally well. The user has provided the trigger word in the Caption Prefix field. Generate a detailed, natural language description in full sentences (40-100 words) of the specific object, prop, or concept. Focus on what it IS, its visual characteristics, materials, colors, details, and context. Write as if describing it to someone who can\'t see it. Do NOT repeat the trigger word, do NOT use markdown.',
    userPrompt: `Generate a detailed natural language description of this object/concept (40-100 words).

The trigger word is already in the Caption Prefix field.

Write in full sentences describing:
1. What the object IS (category, type, purpose)
2. Physical characteristics:
   - Size, shape, proportions, structure
   - Materials, textures, surface qualities
   - Colors, finishes, patterns
   - Distinctive details, features, embellishments
3. Condition and quality (new, vintage, worn, pristine, etc.)
4. Context: how it's positioned, being used, or displayed
5. Surrounding elements if relevant to understanding the object

Example style:
"A vintage rotary telephone from the 1970s with a cream-colored plastic body and chrome rotary dial, featuring a curved handset resting in its cradle, round dial face with black numbers and finger holes, coiled cord connecting the handset, all sitting on a polished wooden desk surface with warm lighting highlighting its glossy finish and retro aesthetic."

Natural sentences, specific details, 40-100 words.`,
    modelType: 'flux',
    category: 'general',
  },

  // FLUX 2 General
  {
    id: 'flux-2-general',
    name: 'FLUX 2 General',
    description: 'Detailed natural language for any subject (40-100 words)',
    systemMessage:
      'You are creating TRAINING CAPTIONS for FLUX 2. FLUX 2 uses Mistral-3 text encoder and understands detailed natural language exceptionally well. Generate a detailed, natural language description in full sentences (40-100 words). Describe what you see precisely: subjects, their characteristics, actions, settings, lighting, composition. Write as if you\'re describing the image to someone who can\'t see it. Use full sentences, not tag lists. Be specific and detailed. Do NOT use markdown.',
    userPrompt: `Generate a detailed natural language description of this image (40-100 words).

Write in full, natural sentences describing:
- Main subjects: what/who they are, their appearance, characteristics
- Actions, poses, expressions, interactions
- Details: clothing, objects, specific features
- Setting and environment: location, background, context
- Lighting: type, direction, mood it creates
- Composition: arrangement, framing, perspective
- Atmosphere and mood

Write like you're describing a photograph to someone. Full sentences. Specific details. Natural language.

Target: 40-100 words. Too short misses details, too long dilutes key information.`,
    modelType: 'flux',
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

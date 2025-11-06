# GPT Image Captioner 🖼️

A web app that generates AI-powered image captions optimized for image generation model training. Ideal for LoRA model training on platforms like [fal LoRA Trainer](https://fal.ai/models/fal-ai/flux-lora-fast-training) and [Replicate LoRA Trainer](https://replicate.com/ostris/flux-dev-lora-trainer/train).

**[Live Demo](https://gptcaptioner.aleksa.codes/)**

## ✨ Features

### Core Features
- **Dual Model Support**: OpenAI API (GPT-5 series) or Ollama (local models)
- **Batch Processing**: Upload and caption multiple images at once
- **Smart Export**: Download all captions as a ZIP file with matching filenames
- **API Key Management**: Securely store OpenAI keys in-app

### Advanced Caption Control
- **9 Prompt Style Presets**: Optimized templates for different use cases and models (including specialized character LoRA presets)
- **Tags vs Semantic Formats**: Choose between tag-based or natural language captions
- **Character Limits**: Control caption length with smart word-boundary truncation
- **Negative Phrase Filtering**: Automatically removes meta-phrases like "this image shows"
- **Customizable Prompts**: Edit system and user prompts before generation
- **Prefix/Suffix Support**: Add consistent text to all captions

## 🎨 Prompt Style Presets

The app includes 9 carefully crafted presets optimized for different models and training goals:

### 📌 Tags Format (Keyword-Based)

Perfect for tag-based training systems that expect comma-separated keywords:

#### **SDXL (Tags)**
- **Use for**: Stable Diffusion XL training (general purpose)
- **Format**: Comma-separated descriptors
- **Output**: `subject and pose, clothing items, environment type, lighting condition, camera angle, art medium, quality level`
- **Character limit**: 450

#### **Character SDXL** ⭐
- **Use for**: SDXL character LoRA training with permanent feature preservation
- **Format**: Natural language (60-90 words, optimized for SDXL)
- **Special features**:
  - Starts with `[TRIGGER]` placeholder for your trigger word
  - Prioritizes permanent features (tattoos with exact text, accessories)
  - Balances detail with SDXL's shorter optimal caption length
  - Consistent description of defining characteristics
- **Output example**: `[TRIGGER] woman, photograph, head and shoulders portrait showing 'KARMA' text tattoo on front of neck, wearing gold necklace with red heart pendant and coral-red off-shoulder top, dark hair with caramel highlights in loose waves, direct gaze at camera against plain beige wall, harsh frontal flash lighting, centered medium close-up`
- **Character limit**: 500
- **Best for**: SDXL character LoRAs where tattoos and permanent features must be preserved

#### **Booru (Tags)**
- **Use for**: Booru-style tagging systems
- **Format**: Underscored lowercase tags
- **Output**: `1girl, long_hair, blue_eyes, red_dress, smiling, outdoor, high_quality`
- **Character limit**: 400

#### **Nano Banana (Tags)**
- **Use for**: Models that need ultra-concise descriptions
- **Format**: Minimal keyword tags
- **Output**: `woman, portrait, natural light, casual, smiling`
- **Character limit**: 250

### 💬 Semantic Format (Natural Language)

Perfect for models that benefit from descriptive, flowing text:

#### **FLUX (Semantic)**
- **Use for**: FLUX model training (general purpose)
- **Format**: Natural language descriptions
- **Output**: `A woman in a red dress standing outdoors, soft natural lighting, warm color palette, professional photography style`
- **Character limit**: 500

#### **Character FLUX** ⭐
- **Use for**: FLUX character LoRA training with tattoos, text, and permanent features
- **Format**: Comprehensive natural language (100-150 words)
- **Special features**:
  - Starts with `[TRIGGER]` placeholder for your trigger word
  - Transcribes exact text from tattoos (e.g., "'KARMA' text tattoo on neck")
  - Describes permanent features consistently (tattoos, jewelry, piercings)
  - Exhaustive detail on pose, anatomy, and environment
  - Prevents tattoo/text smudging in training
- **Output example**: `[TRIGGER] woman, high-quality photograph, head and shoulders portrait showing 'KARMA' text tattoo in dark capital letters on front of neck positioned horizontally below chin, wearing delicate gold chain necklace with small heart-shaped red gemstone pendant, dressed in bright coral-red off-shoulder fitted top...` (continues for 100-150 words)
- **Character limit**: 750
- **Best for**: Character LoRAs where fine details like tattoos, text, and accessories must be accurately preserved

#### **SeedDream (Semantic)**
- **Use for**: Artistic image generation
- **Format**: Artistic, evocative descriptions
- **Output**: `Ethereal portrait bathed in golden hour light, delicate color harmonies, dreamy atmospheric quality, fine artistic rendering`
- **Character limit**: 550

#### **Human Character (Semantic)**
- **Use for**: Training on human subjects with detailed pose and anatomy
- **Format**: Structured description with mandatory fields
- **Includes**:
  - Face: gaze direction, expression, skin texture
  - Hair: style, color, length, texture
  - Clothing: specific items, colors, fit
  - Body posture: stance, weight distribution, limb positions
  - Anatomy: proportions, visible features
  - Hands: position, gesture, visibility
  - Environment: surroundings, spatial context
  - Lighting: direction, quality, shadows
  - Composition: camera angle, shot distance, framing
  - **Pose hint**: Specific pose description (e.g., "standing, weight on left leg, right hand raised, shoulders relaxed")
- **Character limit**: 700
- **Special**: Uses neutral language, no demographic assumptions, extra filtering for phrases like "appears to be"

#### **Custom**
- **Use for**: Your own custom requirements
- **Format**: Define your own system and user prompts
- **Character limit**: 500 (adjustable)

## 🔧 Character Limit Control

Every preset includes a recommended character limit, but you can customize it:

- **Min**: 50 characters
- **Step**: 50 characters
- **Recommended**: 300-700 depending on style
- **Smart truncation**: Cuts at word boundaries to avoid mid-word splits
- **Auto-applied**: Limits enforced during generation

## 🧹 Negative Phrase Filtering

Automatically removes unwanted meta-commentary from captions:

**Filtered phrases include:**
- "this image shows", "the image depicts"
- "we can see", "you can see"
- "there is a", "there are"
- "it appears", "it seems"
- "looking at"

**Plus extra filtering for Human Character preset:**
- "appears to be", "seems to be", "looks like"

**Cleanup:**
- Removes extra spaces and duplicate commas
- Capitalizes first letter
- Results in clean, direct captions

## 🧠 Model Options

### OpenAI API
- **GPT-5**: Highest quality, best for complex scenes
- **GPT-5-mini**: Balanced quality and cost
- **GPT-5-nano**: Fastest and most affordable
- **Detail levels**: Auto, Low (faster), High (more detailed)

### Ollama (Local)
- **Supported models**: LLaVA, moondream, bakLLaVA, and other vision-capable models
- **No API key needed**: Runs entirely on your machine
- **Privacy**: Images never leave your computer

> **Note**: When using the deployed web app with Ollama, you have several options:
>
> 1. Use [ngrok](https://ngrok.com/) to create a secure tunnel to your local Ollama server. [Learn more](https://github.com/ollama/ollama/blob/main/docs/faq.md#how-can-i-use-ollama-with-ngrok).
> 2. Configure Ollama to allow additional web origins using the `OLLAMA_ORIGINS` environment variable. [Learn more](https://github.com/ollama/ollama/blob/main/docs/faq.md#how-can-i-allow-additional-web-origins-to-access-ollama) and check out [LobeHub's Ollama provider documentation](https://lobehub.com/docs/usage/providers/ollama).

## 🛠️ Tech Stack

Next.js 14, Tailwind CSS, shadcn/ui, Lucide React, Vercel AI SDK

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+)
- Bun
- OpenAI API key (if using OpenAI)
- Ollama installed locally (if using local models)

### Install & Run

```bash
# Clone repo
git clone https://github.com/aleksa-codes/gpt-flux-img-captioner.git
cd gpt-image-captioner

# Install dependencies
bun install

# Start development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 💡 Usage

### Basic Workflow

1. **Choose your model**: Select between OpenAI or Ollama tabs
2. **Select a prompt style preset**: Choose from 7 optimized presets based on your training goal
   - Notice the **Tags** or **Semantic** badge showing the format type
3. **Customize (optional)**:
   - Adjust character limit if needed
   - Add prefix/suffix text (e.g., "your_style_name" prefix)
   - Open "Advanced Settings" to edit prompts before generation
4. **Upload images**: Select one or more images to caption
5. **Generate captions**: Click the generate button and watch captions appear in real-time
6. **Download**: Get all captions as a ZIP file with matching `.txt` filenames

### Choosing the Right Preset

**For character LoRA training (with tattoos, permanent features):**
- Use **Character FLUX** ⭐ for FLUX character LoRAs with fine detail preservation (100-150 words)
- Use **Character SDXL** ⭐ for SDXL character LoRAs with permanent feature focus (60-90 words)
- Both automatically include `[TRIGGER]` placeholder and transcribe text from tattoos

**For tag-based training (SDXL, Booru systems):**
- Use **SDXL (Tags)** for Stable Diffusion XL
- Use **Booru (Tags)** for Booru-style datasets
- Use **Nano Banana (Tags)** for minimal keyword descriptions

**For natural language training (FLUX, artistic models):**
- Use **FLUX (Semantic)** for standard FLUX training
- Use **SeedDream (Semantic)** for artistic/aesthetic focus
- Use **Human Character (Semantic)** for detailed human pose and anatomy descriptions

**Not sure?** Start with **FLUX (Semantic)** - it's versatile and works well for most use cases.

### Understanding [TRIGGER] Placeholder

**Character FLUX** and **Character SDXL** presets automatically include a `[TRIGGER]` placeholder at the start of every caption. This is essential for character LoRA training:

**What is [TRIGGER]?**
- A placeholder you replace with your actual trigger word
- Used to activate your character LoRA during inference
- Should be a unique word not commonly found in training data

**How to use it:**
1. Generate captions with Character FLUX or Character SDXL preset
2. Download the ZIP file
3. Use find-and-replace to change `[TRIGGER]` to your chosen trigger word
   - Example: Replace `[TRIGGER]` with `ohwx woman` or `TOK` or your character's name

**Example:**
```
Before: [TRIGGER] woman, photograph, 'KARMA' text tattoo on neck...
After:  ohwx woman, photograph, 'KARMA' text tattoo on neck...
```

**Why?** The trigger word teaches the model to recognize your specific character. Using a consistent trigger across all captions ensures the model learns this association.

### Advanced: Editing Prompts

All prompts are **fully editable** before generation:

1. Select your preferred preset (e.g., "Human Character")
2. Click **"Advanced Settings"** to expand
3. Edit the **System Message** to change overall behavior
4. Edit the **User Prompt** to adjust what the AI focuses on
5. Changes are preserved until you select a different preset

**Example customization:**
```
System Message: Generate detailed captions for portrait photography training.
Focus on facial features, expression, lighting, and pose. Use natural language.

User Prompt: Describe: facial expression, gaze direction, skin tone and texture,
hair details, clothing visible, body pose, lighting setup, background elements,
camera angle and composition.
```

### Using with OpenAI

1. Click "Set API Key" and enter your OpenAI API key
2. Choose model quality (GPT-5-nano recommended for batch processing)
3. Select detail level (Auto works well for most images)
4. Generate captions

### Using with Ollama (Local)

1. [Install Ollama](https://ollama.com/download)
2. Pull a vision model: `ollama pull llava` (or `llava:13b` for better quality)
3. Start Ollama server
4. In the app, select the "Ollama" tab
5. Verify server status shows "Connected"
6. Choose your model from the dropdown
7. Generate captions

**Recommended Ollama models:**
- `llava` - Fast, good quality
- `llava:13b` - Better quality, slower
- `llava:34b` - Best quality, requires powerful GPU
- `moondream` - Lightweight alternative

## 📚 Tips & Best Practices

### Caption Quality

**For best results:**
- Use **GPT-5** or **GPT-5-mini** for highest quality captions
- Enable **High detail** for images with fine details
- Use **Character FLUX/SDXL** presets for character LoRAs (prevents tattoo/text smudging)
- Use **Human Character** preset when training on people (better hand and pose accuracy)
- Review a few captions before processing large batches

### Character Limits

**Recommended limits by use case:**
- **Character FLUX**: 700-750 characters (100-150 words, exhaustive detail)
- **Character SDXL**: 450-500 characters (60-90 words, prioritized detail)
- **FLUX training**: 400-500 characters (balanced detail)
- **SDXL training**: 300-450 characters (tag-focused)
- **Booru datasets**: 250-400 characters (concise tags)
- **Human characters**: 600-700 characters (detailed descriptions)

### Character LoRA Training Tips

**For tattoo/text preservation:**
- Use **Character FLUX** or **Character SDXL** presets specifically
- These presets transcribe exact text from tattoos consistently
- Higher network rank recommended: 64-128 (FLUX), 32-64 (SDXL)
- Train text encoders: both CLIP and T5 at 1e-5 (FLUX), TE1 at 3e-6 (SDXL)
- 200 images × 15-20 repeats = 3000-4000 optimal steps

**Replace [TRIGGER] placeholder:**
- After downloading, find-and-replace `[TRIGGER]` with your trigger word
- Examples: `ohwx woman`, `TOK`, unique character name
- Consistent trigger word across all captions is critical

### Prefix/Suffix Usage

**Common patterns:**
```
Prefix: "your_character_name, your_style_name"
Suffix: "high quality, detailed, professional"
```

**For LoRA training:**
```
Prefix: "TOK" (your trigger word)
Suffix: (leave empty or add quality tags)
```

### Batch Processing

**Tips for large batches:**
1. Start with 5-10 images to test your settings
2. Use **GPT-5-nano** or **Ollama** for cost-effective processing
3. Monitor the real-time caption output to verify quality
4. Adjust prompts in Advanced Settings if needed
5. Process remaining images once satisfied

### Negative Filtering

The app automatically removes meta-phrases, but you can enhance this by:
- Using prompts that say "Describe directly without commentary"
- Adding "No meta-phrases" to your system message
- The **Human Character** preset has extra filtering built-in

## 🎯 Use Cases

### LoRA Training
Perfect for creating training datasets for:
- FLUX LoRA (character, style, object)
- SDXL LoRA (any subject)
- Pony Diffusion training
- Custom model fine-tuning

### Dataset Preparation
- Tag existing image datasets
- Convert natural language captions to tags (or vice versa)
- Add consistent trigger words via prefix
- Standardize caption format across datasets

### Image Analysis
- Batch describe image collections
- Generate alt-text for accessibility
- Create searchable image metadata
- Document visual assets

## 🤝 Contributing

Contributions welcome! Fork the repo, create a feature branch, and submit a pull request.

## 📝 License

MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">Made with ❤️ by <a href="https://github.com/aleksa-codes">aleksa.codes</a></p>

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2Icon, ImageIcon, FileTextIcon, InfoIcon, KeyIcon, TagIcon, TypeIcon, SparklesIcon, CopyIcon, EyeIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDownIcon, ChevronUpIcon, WrenchIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import APIKeyManager from '@/components/api-key-manager';
import { promptStyles, getDefaultPromptStyle } from '@/lib/prompt-styles';

const openaiFormSchema = z.object({
  images: z.array(z.instanceof(File)).nonempty('At least one image is required.'),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  systemMessage: z.string().optional(),
  userPrompt: z.string().optional(),
  model: z.string(),
  detail: z.enum(['auto', 'low', 'high']).optional(),
  promptStyleId: z.string(),
  maxChars: z.number().int().positive().optional(),
});

type OpenAIFormValues = z.infer<typeof openaiFormSchema>;

interface OpenAIFormProps {
  initialApiKey: string | null;
  onApiKeyChange: (key: string | null) => void;
  onSubmit: (captions: { filename: string; content: string }[]) => void;
  onProgress: (caption: { filename: string; content: string }) => void;
  onError: (error: string) => void;
}

export default function OpenAIForm({ initialApiKey, onApiKeyChange, onSubmit, onProgress, onError }: OpenAIFormProps) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true); // Advanced settings open by default
  const [captionCount, setCaptionCount] = useState(0);
  const [apiKey, setApiKey] = useState<string | null>(initialApiKey);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    onApiKeyChange(apiKey);
  }, [apiKey, onApiKeyChange]);

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const defaultStyle = getDefaultPromptStyle();

  const form = useForm<OpenAIFormValues>({
    resolver: zodResolver(openaiFormSchema),
    defaultValues: {
      prefix: '',
      suffix: '',
      systemMessage: defaultStyle.systemMessage,
      userPrompt: defaultStyle.userPrompt,
      model: 'gpt-4o',
      detail: 'auto',
      promptStyleId: defaultStyle.id,
      maxChars: defaultStyle.defaultMaxChars,
    },
  });

  const handleSubmit = async (data: OpenAIFormValues) => {
    if (data.images.length === 0) {
      onError('At least one image is required.');
      return;
    }

    if (!apiKey) {
      onError('OpenAI API key is required');
      return;
    }

    setLoading(true);
    setCaptionCount(0);

    const formData = new FormData();
    for (let i = 0; i < data.images.length; i++) {
      formData.append('images', data.images[i]);
    }
    formData.append('prefix', data.prefix || '');
    formData.append('suffix', data.suffix || '');
    formData.append('systemMessage', data.systemMessage || '');
    formData.append('userPrompt', data.userPrompt || '');
    formData.append('service', 'openai');
    formData.append('model', data.model || '');
    formData.append('detail', data.detail || 'auto');
    formData.append('apiKey', apiKey);
    formData.append('promptStyleId', data.promptStyleId || '');
    if (data.maxChars) {
      formData.append('maxChars', data.maxChars.toString());
    }

    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error with the API request');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let completeData = '';

      const tempCaptions: { filename: string; content: string }[] = [];

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          completeData += decoder.decode(value, { stream: true });

          const lines = completeData.split('\n\n');
          completeData = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const { filename, caption } = JSON.parse(line.substring(6));
              if (caption.startsWith('Error:')) {
                onError(caption.substring(7));
                setLoading(false);
                return;
              } else {
                const newCaption = { filename, content: caption };
                tempCaptions.push(newCaption);
                onProgress(newCaption);
                setCaptionCount((prev) => prev + 1);
              }
            }
          }
        }
      }

      onSubmit(tempCaptions);
    } catch (err) {
      onError('An unexpected error occurred.');
      console.error('Submission error:', err);
    }

    setLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
        <Card className='overflow-hidden border-2 bg-gradient-to-br from-background via-background to-primary/5 shadow-xl transition-all duration-300 hover:shadow-2xl'>
          <CardHeader className='bg-gradient-to-r from-primary/10 via-primary/5 to-background pb-4'>
            <CardTitle className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='rounded-lg bg-primary/10 p-2'>
                  <SparklesIcon className='text-primary h-5 w-5' />
                </div>
                <span className='bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
                  OpenAI Configuration
                </span>
              </div>
              <APIKeyManager onApiKeyChange={setApiKey} />
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='mb-4'>
              <FormField
                control={form.control}
                name='model'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select model' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>GPT-4o Series (Recommended)</SelectLabel>
                          <SelectItem value='gpt-4o'>GPT-4o - Latest, multimodal, less restrictive</SelectItem>
                          <SelectItem value='gpt-4o-mini'>GPT-4o Mini - Fast, efficient, cost-effective</SelectItem>
                        </SelectGroup>
                        <SelectSeparator />
                        <SelectGroup>
                          <SelectLabel>GPT-4 Turbo Series</SelectLabel>
                          <SelectItem value='gpt-4-turbo'>GPT-4 Turbo - Powerful vision analysis</SelectItem>
                          <SelectItem value='gpt-4-turbo-2024-04-09'>GPT-4 Turbo (Apr 2024) - Specific snapshot</SelectItem>
                        </SelectGroup>
                        <SelectSeparator />
                        <SelectGroup>
                          <SelectLabel>Legacy Models</SelectLabel>
                          <SelectItem value='gpt-4-vision-preview'>GPT-4 Vision - Stable older model</SelectItem>
                        </SelectGroup>
                        <SelectSeparator />
                        <SelectGroup>
                          <SelectLabel>GPT-5 Series (If Available)</SelectLabel>
                          <SelectItem value='gpt-5-nano'>GPT-5-nano - Fastest tier</SelectItem>
                          <SelectItem value='gpt-5-mini'>GPT-5-mini - Balanced tier</SelectItem>
                          <SelectItem value='gpt-5'>GPT-5 - Premium tier</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            {/* Caption Style Preset - Prominent Section */}
            <div className='group relative overflow-hidden rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-5 shadow-lg transition-all duration-300 hover:border-primary/50 hover:shadow-xl'>
              {/* Animated background gradient */}
              <div className='absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

              <FormField
                control={form.control}
                name='promptStyleId'
                render={({ field }) => {
                  const selectedStyle = promptStyles.find((s) => s.id === field.value);
                  return (
                    <FormItem className='relative'>
                      <div className='mb-3 flex items-center gap-2'>
                        <EyeIcon className='text-primary h-5 w-5' />
                        <FormLabel className='text-lg font-bold'>Caption Style Preset</FormLabel>
                        {selectedStyle && (
                          <Badge
                            variant={selectedStyle.format === 'tags' ? 'default' : 'secondary'}
                            className='animate-in fade-in zoom-in text-xs font-semibold shadow-md duration-300'
                          >
                            {selectedStyle.format === 'tags' ? (
                              <>
                                <TagIcon className='mr-1 h-3 w-3' />
                                Tags
                              </>
                            ) : (
                              <>
                                <TypeIcon className='mr-1 h-3 w-3' />
                                Semantic
                              </>
                            )}
                          </Badge>
                        )}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InfoIcon className='text-muted-foreground hover:text-primary h-4 w-4 cursor-help transition-colors' />
                            </TooltipTrigger>
                            <TooltipContent className='max-w-[320px] text-sm'>
                              <p>
                                <strong>Tags</strong> format: comma-separated keywords
                                <br />
                                <strong>Semantic</strong> format: natural language
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          const style = promptStyles.find((s) => s.id === value);
                          if (style) {
                            form.setValue('systemMessage', style.systemMessage);
                            form.setValue('userPrompt', style.userPrompt);
                            form.setValue('maxChars', style.defaultMaxChars);
                          }
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='h-12 text-base font-medium'>
                            <SelectValue placeholder='Select caption style' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {promptStyles.map((style) => (
                            <SelectItem key={style.id} value={style.id} className='cursor-pointer py-3'>
                              <div className='flex items-center gap-2'>
                                {style.format === 'tags' ? (
                                  <TagIcon className='h-4 w-4' />
                                ) : (
                                  <TypeIcon className='h-4 w-4' />
                                )}
                                <span className='font-medium'>{style.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedStyle && (
                        <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>{selectedStyle.description}</p>
                      )}
                    </FormItem>
                  );
                }}
              />
            </div>

            <div className='mb-4'>
              <FormField
                control={form.control}
                name='maxChars'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center gap-2'>
                      <FormLabel>Max Caption Length (characters)</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className='text-muted-foreground hover:text-primary h-4 w-4 cursor-help' />
                          </TooltipTrigger>
                          <TooltipContent className='max-w-[300px]'>
                            <p>
                              Maximum number of characters for generated captions. Leave empty for no limit. Captions
                              exceeding this will be truncated.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl>
                      <Input
                        type='number'
                        min='50'
                        step='50'
                        placeholder='e.g., 500'
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = e.target.value ? parseInt(e.target.value, 10) : undefined;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <p className='text-muted-foreground mt-1 text-xs'>
                      Recommended: 300-700 characters depending on caption style
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Image Upload Section */}
            <div className='rounded-lg border-2 border-dashed p-6'>
              <FormField
                control={form.control}
                name='images'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-2 text-base font-semibold'>
                      <ImageIcon className='h-5 w-5' />
                      Select Images
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='file'
                        accept='image/*'
                        className='file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 h-16 cursor-pointer p-2 text-base file:mr-4 file:h-full file:rounded-lg file:px-6 file:font-medium hover:file:cursor-pointer'
                        multiple
                        onChange={(e) => {
                          const files = e.target.files ? Array.from(e.target.files) : [];
                          field.onChange(files);
                        }}
                      />
                    </FormControl>
                    <p className='text-muted-foreground mt-2 text-sm'>Upload one or multiple images for captioning</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {!apiKey && (
              <Alert variant='destructive' className='mt-4'>
                <AlertTitle className='flex items-center gap-2'>API Key Required</AlertTitle>
                <AlertDescription>
                  Please add your OpenAI API key using the &quot;Set API Key&quot; button above before proceeding.
                </AlertDescription>
              </Alert>
            )}

            {/* Prefix/Suffix Section */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <h3 className='text-base font-semibold'>Custom Text (Optional)</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className='text-muted-foreground hover:text-primary h-4 w-4 cursor-help' />
                    </TooltipTrigger>
                    <TooltipContent className='max-w-[300px]'>
                      <p>Add consistent text to the beginning (prefix) or end (suffix) of all captions</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className='grid gap-4 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='prefix'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Caption Prefix</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='e.g., CYBRPNK style' className='h-11' />
                      </FormControl>
                      <p className='text-muted-foreground mt-1 text-xs'>Added to start of each caption</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='suffix'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Caption Suffix</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='e.g., high quality 8k' className='h-11' />
                      </FormControl>
                      <p className='text-muted-foreground mt-1 text-xs'>Added to end of each caption</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name='detail'
              render={({ field }) => (
                <FormItem className='mt-4'>
                  <div className='flex items-center gap-2'>
                    <FormLabel>Detail Level</FormLabel>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className='text-muted-foreground hover:text-primary h-4 w-4 cursor-help' />
                        </TooltipTrigger>
                        <TooltipContent className='max-w-[300px]'>
                          <p>
                            Controls how detailed the image analysis should be. Higher detail means more tokens used but
                            better analysis.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select detail level' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='auto'>Auto (Recommended)</SelectItem>
                      <SelectItem value='low'>Low (Faster)</SelectItem>
                      <SelectItem value='high'>High (More Detailed)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <Collapsible open={isOpen} onOpenChange={setIsOpen} className='mt-4'>
              <CollapsibleTrigger asChild>
                <Button
                  variant='outline'
                  className='group flex w-full items-center justify-between border-2 bg-gradient-to-r from-muted/50 to-muted/30 transition-all duration-300 hover:border-primary/50 hover:from-primary/10 hover:to-primary/5'
                >
                  <div className='flex items-center gap-2'>
                    <WrenchIcon className='h-5 w-5 transition-transform duration-300 group-hover:rotate-12' />
                    <span className='font-semibold'>Advanced Settings</span>
                    <Badge variant='secondary' className='text-xs'>
                      Editable
                    </Badge>
                  </div>
                  {isOpen ? (
                    <ChevronUpIcon className='h-5 w-5 transition-transform duration-300' />
                  ) : (
                    <ChevronDownIcon className='h-5 w-5 transition-transform duration-300' />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className='animate-in slide-in-from-top mt-4 space-y-6 duration-300'>
                <div className='rounded-xl border-2 border-blue-500/20 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-background p-4 shadow-md'>
                  <div className='flex items-start gap-3'>
                    <InfoIcon className='text-blue-500 mt-0.5 h-5 w-5 flex-shrink-0' />
                    <div>
                      <p className='text-sm font-semibold'>✏️ Fully Customizable</p>
                      <p className='text-muted-foreground mt-1 text-sm leading-relaxed'>
                        The prompts below are pre-filled by your selected style preset but can be edited before
                        generation. Fine-tune the system message and user prompt to match your exact needs.
                      </p>
                    </div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name='systemMessage'
                  render={({ field }) => (
                    <FormItem>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <FormLabel className='text-base font-semibold'>System Message</FormLabel>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <InfoIcon className='text-muted-foreground hover:text-primary h-4 w-4 cursor-help' />
                              </TooltipTrigger>
                              <TooltipContent className='max-w-[300px]'>
                                <p>Sets the overall behavior and format of the AI's caption generation.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          onClick={() => copyToClipboard(field.value || '', 'system')}
                          className='h-8 gap-2'
                        >
                          <CopyIcon className='h-3.5 w-3.5' />
                          {copiedField === 'system' ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder='Enter system message...'
                          className='min-h-[100px] resize-y rounded-lg border-2 font-mono text-sm transition-all duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20'
                        />
                      </FormControl>
                      <div className='flex items-center justify-between'>
                        <p className='text-muted-foreground text-xs'>
                          Defines how the AI should approach the caption generation task
                        </p>
                        <p className='text-muted-foreground text-xs'>{field.value?.length || 0} characters</p>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='userPrompt'
                  render={({ field }) => (
                    <FormItem>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <FormLabel className='text-base font-semibold'>User Prompt</FormLabel>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <InfoIcon className='text-muted-foreground hover:text-primary h-4 w-4 cursor-help' />
                              </TooltipTrigger>
                              <TooltipContent className='max-w-[300px]'>
                                <p>
                                  The user prompt is sent along with each image. It specifies what aspects of the image
                                  you want the AI to focus on.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          onClick={() => copyToClipboard(field.value || '', 'user')}
                          className='h-8 gap-2'
                        >
                          <CopyIcon className='h-3.5 w-3.5' />
                          {copiedField === 'user' ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder='Enter user prompt...'
                          className='min-h-[80px] resize-y rounded-lg border-2 font-mono text-sm transition-all duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20'
                        />
                      </FormControl>
                      <div className='flex items-center justify-between'>
                        <p className='text-muted-foreground text-xs'>
                          Specific instructions for analyzing each image
                        </p>
                        <p className='text-muted-foreground text-xs'>{field.value?.length || 0} characters</p>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
        <Button
          type='submit'
          className='h-14 w-full text-base font-semibold shadow-lg transition-all hover:shadow-xl'
          size='lg'
          disabled={loading || !apiKey}
        >
          {loading ? (
            <>
              <Loader2Icon className='mr-2 h-6 w-6 animate-spin' />
              Processing Images... {captionCount > 0 ? `(${captionCount} done)` : ''}
            </>
          ) : !apiKey ? (
            <>
              <KeyIcon className='mr-2 h-6 w-6' />
              API Key Required
            </>
          ) : (
            <>
              <SparklesIcon className='mr-2 h-6 w-6' />
              Generate Captions
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

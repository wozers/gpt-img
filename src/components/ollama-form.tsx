'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Loader2Icon,
  ImageIcon,
  FileTextIcon,
  InfoIcon,
  RefreshCwIcon,
  CheckCircleIcon,
  XCircleIcon,
  TagIcon,
  TypeIcon,
  ServerIcon,
  SparklesIcon,
} from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDownIcon, ChevronUpIcon, WrenchIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { promptStyles, getDefaultPromptStyle } from '@/lib/prompt-styles';

// Interface for server status
interface ServerStatus {
  status: 'running' | 'error' | 'checking';
  message?: string;
}

// Rest of the interfaces remain the same
const ollamaFormSchema = z.object({
  images: z.array(z.instanceof(File)).nonempty('At least one image is required.'),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  systemMessage: z.string().optional(),
  userPrompt: z.string().optional(),
  model: z.string(),
  ollamaUrl: z.string().optional(),
  promptStyleId: z.string(),
  maxChars: z.number().int().positive().optional(),
});

type OllamaFormValues = z.infer<typeof ollamaFormSchema>;

interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
}

interface OllamaFormProps {
  onSubmit: (captions: { filename: string; content: string }[]) => void;
  onProgress: (caption: { filename: string; content: string }) => void; // New prop for real-time updates
  onError: (error: string) => void;
}

export default function OllamaForm({ onSubmit, onProgress, onError }: OllamaFormProps) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [ollamaModels, setOllamaModels] = useState<OllamaModel[]>([]);
  const [ollamaLoading, setOllamaLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<ServerStatus>({ status: 'checking' });
  const [captionCount, setCaptionCount] = useState(0); // Track number of processed captions

  const defaultStyle = getDefaultPromptStyle();

  const form = useForm<OllamaFormValues>({
    resolver: zodResolver(ollamaFormSchema),
    defaultValues: {
      prefix: '',
      suffix: '',
      systemMessage: defaultStyle.systemMessage,
      userPrompt: defaultStyle.userPrompt,
      model: '',
      ollamaUrl: 'http://localhost:11434',
      promptStyleId: defaultStyle.id,
      maxChars: defaultStyle.defaultMaxChars,
    },
  });

  const ollamaUrl = form.watch('ollamaUrl');

  // Function to check server status
  const checkServerStatus = async () => {
    setServerStatus({ status: 'checking' });

    try {
      const response = await fetch(`/api/ollama/status?url=${encodeURIComponent(ollamaUrl || '')}`);

      if (!response.ok) {
        throw new Error(`Failed to check server status: ${response.statusText}`);
      }

      const data = await response.json();
      setServerStatus({
        status: data.status,
        message: data.message,
      });
    } catch (err) {
      setServerStatus({
        status: 'error',
        message: err instanceof Error ? err.message : 'Failed to check server status',
      });
      console.error('Error checking server status:', err);
    }
  };

  // Fetch Ollama models when URL changes or when refresh is clicked
  const fetchOllamaModels = async () => {
    setOllamaLoading(true);
    setOllamaModels([]);
    onError(''); // Clear any previous error

    // First check server status
    await checkServerStatus();

    try {
      const response = await fetch(`/api/ollama/models?url=${encodeURIComponent(ollamaUrl || '')}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setOllamaModels(data.models || []);

      // If models were fetched successfully and there's at least one model, select the first one
      if (data.models?.length > 0) {
        form.setValue('model', data.models[0].name);
      } else {
        throw new Error('No vision models found');
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to connect to Ollama server');
      console.error('Error fetching Ollama models:', err);
    } finally {
      setOllamaLoading(false);
    }
  };

  // Check server status when URL changes
  useEffect(() => {
    checkServerStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ollamaUrl]);

  // Initial fetch of Ollama models
  useEffect(() => {
    fetchOllamaModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (data: OllamaFormValues) => {
    if (data.images.length === 0) {
      onError('At least one image is required.');
      return;
    }

    if (!data.model) {
      onError('Please select an Ollama model');
      return;
    }

    setLoading(true);
    setCaptionCount(0); // Reset caption count

    const formData = new FormData();
    for (let i = 0; i < data.images.length; i++) {
      formData.append('images', data.images[i]);
    }
    formData.append('prefix', data.prefix || '');
    formData.append('suffix', data.suffix || '');
    formData.append('systemMessage', data.systemMessage || '');
    formData.append('userPrompt', data.userPrompt || '');
    formData.append('service', 'ollama');
    formData.append('model', data.model);
    formData.append('ollamaUrl', data.ollamaUrl || 'http://localhost:11434');
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
                // Send each caption to the parent as it's received
                const newCaption = { filename, content: caption };
                tempCaptions.push(newCaption);
                onProgress(newCaption); // Send real-time update to parent
                setCaptionCount((prev) => prev + 1);
              }
            }
          }
        }
      }

      // All captions are done, send the complete collection
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
        <Card className='border-2'>
          <CardContent className='space-y-6 pt-6'>
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

            {/* Caption Style Preset - Prominent Section */}
            <div className='bg-primary/5 rounded-lg border-2 border-primary/20 p-4'>
              <FormField
                control={form.control}
                name='promptStyleId'
                render={({ field }) => {
                  const selectedStyle = promptStyles.find((s) => s.id === field.value);
                  return (
                    <FormItem>
                      <div className='flex items-center gap-2 mb-2'>
                        <FormLabel className='text-base font-semibold'>Caption Style Preset</FormLabel>
                        {selectedStyle && (
                          <Badge
                            variant={selectedStyle.format === 'tags' ? 'default' : 'secondary'}
                            className='text-xs font-medium'
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
                              <InfoIcon className='text-muted-foreground hover:text-primary h-4 w-4 cursor-help' />
                            </TooltipTrigger>
                            <TooltipContent className='max-w-[300px]'>
                              <p>
                                Select a preset optimized for different models. <strong>Tags</strong> format uses
                                comma-separated keywords. <strong>Semantic</strong> format uses natural language.
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

            <div className='mt-4'>
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

            <div className='mt-4'>
              <FormField
                control={form.control}
                name='ollamaUrl'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <FormLabel>Ollama Server URL</FormLabel>
                        {/* Display server status */}
                        {serverStatus.status === 'checking' ? (
                          <Badge variant='outline' className='ml-2 animate-pulse'>
                            <Loader2Icon className='mr-1 h-3 w-3' />
                            Checking...
                          </Badge>
                        ) : serverStatus.status === 'running' ? (
                          <Badge variant='outline' className='border-green-500/20 bg-green-500/10 text-green-500'>
                            <CheckCircleIcon className='mr-1 h-3 w-3' />
                            Connected
                          </Badge>
                        ) : (
                          <Badge variant='outline' className='border-red-500/20 bg-red-500/10 text-red-500'>
                            <XCircleIcon className='mr-1 h-3 w-3' />
                            {serverStatus.message ? 'Error' : 'Not Connected'}
                          </Badge>
                        )}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InfoIcon className='text-muted-foreground hover:text-primary h-4 w-4 cursor-help' />
                            </TooltipTrigger>
                            <TooltipContent className='max-w-[300px]'>
                              <p>The URL of your Ollama server. Default is http://localhost:11434</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className='flex gap-2'>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={fetchOllamaModels}
                          disabled={ollamaLoading}
                        >
                          {ollamaLoading ? (
                            <Loader2Icon className='h-4 w-4 animate-spin' />
                          ) : (
                            <RefreshCwIcon className='h-4 w-4' />
                          )}
                        </Button>
                      </div>
                    </div>
                    <FormControl>
                      <Input {...field} placeholder='http://localhost:11434' />
                    </FormControl>
                    <p className='text-muted-foreground text-xs'>Enter the URL of your Ollama server</p>

                    {/* Show detailed server status message if there's an error */}
                    {serverStatus.status === 'error' && serverStatus.message && (
                      <p className='mt-1 text-xs text-red-500'>{serverStatus.message}</p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='model'
              render={({ field }) => (
                <FormItem className='mt-4'>
                  <FormLabel>Ollama Model</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={ollamaLoading ? 'Loading models...' : 'Select a model'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ollamaModels.length > 0 ? (
                        ollamaModels.map((model) => (
                          <SelectItem key={model.name} value={model.name}>
                            {model.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value='no-models-found' disabled>
                          {ollamaLoading
                            ? 'Loading models...'
                            : serverStatus.status === 'running'
                              ? 'No models found. Click refresh to try again.'
                              : 'Server not connected. Check server status first.'}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Alert className={`mt-4 ${serverStatus.status === 'error' ? 'border-red-500/20 bg-red-500/10' : ''}`}>
              <AlertTitle className='flex items-center gap-2'>
                <InfoIcon className='h-4 w-4' />
                Ollama Requirements
                {serverStatus.status === 'error' && (
                  <Badge variant='outline' className='ml-2 border-red-500/20 bg-red-500/10 text-red-500'>
                    <XCircleIcon className='mr-1 h-3 w-3' />
                    Server Not Connected
                  </Badge>
                )}
              </AlertTitle>
              <AlertDescription>
                Make sure your Ollama server is running and has vision/multimodal models installed. Recommended models:
                llava, moondream, bakllava, or other vision-capable models.
              </AlertDescription>
            </Alert>

            <Collapsible open={isOpen} onOpenChange={setIsOpen} className='mt-4'>
              <CollapsibleTrigger asChild>
                <Button variant='outline' className='flex w-full items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <WrenchIcon className='h-4 w-4' />
                    <span>Advanced Settings</span>
                  </div>
                  {isOpen ? <ChevronUpIcon className='h-4 w-4' /> : <ChevronDownIcon className='h-4 w-4' />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className='mt-4 space-y-4'>
                <div className='bg-muted/50 rounded-lg border p-4'>
                  <p className='text-muted-foreground text-sm'>
                    <strong>Edit before generating:</strong> The prompts below are pre-filled by the selected style
                    preset but can be customized. Modify the system message and user prompt to fine-tune caption
                    generation.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name='systemMessage'
                  render={({ field }) => (
                    <FormItem>
                      <div className='flex items-center gap-2'>
                        <FormLabel>System Message</FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InfoIcon className='text-muted-foreground hover:text-primary h-4 w-4 cursor-help' />
                            </TooltipTrigger>
                            <TooltipContent className='max-w-[300px]'>
                              <p>The system message sets the overall behavior and format of the AI.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder='Enter system message...'
                          className='min-h-[80px] resize-y font-mono text-sm'
                        />
                      </FormControl>
                      <p className='text-muted-foreground mt-1 text-xs'>
                        Defines how the AI should approach the caption generation task
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='userPrompt'
                  render={({ field }) => (
                    <FormItem>
                      <div className='flex items-center gap-2'>
                        <FormLabel>User Prompt</FormLabel>
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
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder='Enter user prompt...'
                          className='min-h-[80px] resize-y font-mono text-sm'
                        />
                      </FormControl>
                      <p className='text-muted-foreground mt-1 text-xs'>
                        Specific instructions for analyzing each image
                      </p>
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
          disabled={loading || !form.getValues('model') || serverStatus.status !== 'running'}
        >
          {loading ? (
            <>
              <Loader2Icon className='mr-2 h-6 w-6 animate-spin' />
              Processing Images... {captionCount > 0 ? `(${captionCount} done)` : ''}
            </>
          ) : serverStatus.status !== 'running' ? (
            <>
              <XCircleIcon className='mr-2 h-6 w-6' />
              Server Not Connected
            </>
          ) : !form.getValues('model') ? (
            <>
              <ServerIcon className='mr-2 h-6 w-6' />
              Select a Model First
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

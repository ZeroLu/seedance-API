export interface SeedanceClientOptions {
  baseUrl?: string;
  model?: string;
  timeout?: number;
}

export interface ModelsOptions {
  mediaType?: string;
}

export interface QuoteVideoOptions {
  prompt: string;
  scene: string;
  options?: Record<string, unknown>;
  model?: string;
}

export interface CreateVideoOptions {
  prompt: string;
  scene: string;
  options?: Record<string, unknown>;
  model?: string;
}

export interface TextToVideoOptions {
  duration?: string;
  aspectRatio?: string;
  resolution?: string;
  model?: string;
  extraOptions?: Record<string, unknown>;
}

export interface ImageToVideoOptions extends TextToVideoOptions {
  imageUrls: string[];
}

export interface VideoToVideoOptions {
  videoUrls: string[];
  duration?: string;
  model?: string;
  extraOptions?: Record<string, unknown>;
}

export interface WaitForTaskOptions {
  interval?: number;
  timeout?: number;
}

export declare const DEFAULT_MODEL: string;
export declare const SEEDANCE_MODELS: readonly string[];
export declare const FULL_ACCESS_MODELS: readonly string[];

export class SeedanceAPIError extends Error {
  statusCode?: number;
  payload?: unknown;

  constructor(message: string, options?: { statusCode?: number; payload?: unknown });
}

export class SeedanceClient {
  constructor(apiKey: string, options?: SeedanceClientOptions);

  apiKey: string;
  baseUrl: string;
  model: string;
  timeout: number;

  static supportedModels(): string[];
  static fullAccessModels(): string[];

  models(options?: ModelsOptions): Promise<unknown>;
  quoteVideo(options: QuoteVideoOptions): Promise<unknown>;
  createVideo(options: CreateVideoOptions): Promise<unknown>;
  textToVideo(prompt: string, options?: TextToVideoOptions): Promise<unknown>;
  imageToVideo(prompt: string, options: ImageToVideoOptions): Promise<unknown>;
  videoToVideo(prompt: string, options: VideoToVideoOptions): Promise<unknown>;
  uploadImages(filePaths: string[]): Promise<unknown>;
  uploadVideos(filePaths: string[]): Promise<unknown>;
  getTask(taskId: string): Promise<unknown>;
  waitForTask(taskId: string, options?: WaitForTaskOptions): Promise<unknown>;
}

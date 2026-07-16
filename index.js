"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");

const DEFAULT_BASE_URL = "https://cyberbara.com";
const DEFAULT_MODEL = "seedance-2-stable";
const DEFAULT_TIMEOUT = 120000;
const DEFAULT_POLL_INTERVAL = 5000;
const DEFAULT_POLL_TIMEOUT = 900000;
const DEFAULT_USER_AGENT = "seedance-api/0.1.0";

const SEEDANCE_MODELS = Object.freeze([
  "seedance-1-pro",
  "seedance-1-lite",
  "seedance-1-pro-fast",
  "seedance-2",
  "seedance-2-fast",
  "seedance-2-stable",
  "seedance-2-fast-stable",
  "seedance-2-mini",
  "seedance-2-mini-ark",
  "seedance-2-ark",
  "seedance-2-fast-ark",
  "seedance-2.5",
  "seedance-2-watermark-remover"
]);

const FULL_ACCESS_MODELS = Object.freeze([
  "seedance-2-stable",
  "seedance-2-fast-stable",
  "seedance-2.5"
]);

const MIME_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".bmp": "image/bmp",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
  ".avi": "video/x-msvideo",
  ".mkv": "video/x-matroska"
};

class SeedanceAPIError extends Error {
  constructor(message, { statusCode, payload } = {}) {
    super(message);
    this.name = "SeedanceAPIError";
    this.statusCode = statusCode;
    this.payload = payload;
  }
}

class SeedanceClient {
  constructor(apiKey, options = {}) {
    if (!apiKey) {
      throw new TypeError("apiKey is required");
    }

    this.apiKey = apiKey;
    this.baseUrl = (options.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.model = options.model || DEFAULT_MODEL;
    this.timeout = options.timeout || DEFAULT_TIMEOUT;
  }

  static supportedModels() {
    return SEEDANCE_MODELS.slice();
  }

  static fullAccessModels() {
    return FULL_ACCESS_MODELS.slice();
  }

  buildUrl(requestPath, query) {
    const normalizedPath = requestPath.startsWith("/") ? requestPath : `/${requestPath}`;
    const url = new URL(`${this.baseUrl}${normalizedPath}`);

    if (query && typeof query === "object") {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.set(key, String(value));
        }
      }
    }

    return url.toString();
  }

  async request({
    method,
    path: requestPath,
    query,
    jsonBody,
    body,
    headers = {},
    timeout
  }) {
    const requestHeaders = {
      Accept: "application/json",
      Authorization: `Bearer ${this.apiKey}`,
      "x-api-key": this.apiKey,
      "User-Agent": DEFAULT_USER_AGENT,
      ...headers
    };

    let requestBody = body;
    if (jsonBody !== undefined) {
      requestBody = JSON.stringify(jsonBody);
      requestHeaders["Content-Type"] = "application/json";
    }

    let response;
    try {
      response = await fetch(this.buildUrl(requestPath, query), {
        method: method.toUpperCase(),
        headers: requestHeaders,
        body: requestBody,
        signal: AbortSignal.timeout(timeout || this.timeout)
      });
    } catch (error) {
      if (error && error.name === "TimeoutError") {
        throw new SeedanceAPIError(`Request timed out after ${timeout || this.timeout}ms`);
      }
      throw new SeedanceAPIError(`Request failed: ${error && error.message ? error.message : String(error)}`);
    }

    const payload = await parseJsonResponse(response);
    if (!response.ok) {
      const message = extractErrorMessage(payload) || `HTTP ${response.status}`;
      throw new SeedanceAPIError(message, {
        statusCode: response.status,
        payload
      });
    }

    return payload;
  }

  unwrapData(payload) {
    if (payload && typeof payload === "object" && "data" in payload) {
      return payload.data;
    }
    return payload;
  }

  async models({ mediaType = "video" } = {}) {
    const payload = await this.request({
      method: "GET",
      path: "/api/v1/models",
      query: { media_type: mediaType }
    });
    return this.unwrapData(payload);
  }

  async quoteVideo({ prompt, scene, options = {}, model } = {}) {
    const payload = await this.request({
      method: "POST",
      path: "/api/v1/credits/quote",
      jsonBody: {
        model: model || this.model,
        media_type: "video",
        scene,
        prompt,
        options
      }
    });
    return this.unwrapData(payload);
  }

  async createVideo({ prompt, scene, options = {}, model } = {}) {
    const payload = await this.request({
      method: "POST",
      path: "/api/v1/videos/generations",
      jsonBody: {
        model: model || this.model,
        prompt,
        scene,
        options
      }
    });
    return this.unwrapData(payload);
  }

  async textToVideo(
    prompt,
    { duration = "10", aspectRatio = "16:9", resolution, model, extraOptions } = {}
  ) {
    const options = {
      duration,
      aspect_ratio: aspectRatio
    };
    if (resolution) {
      options.resolution = resolution;
    }
    if (extraOptions) {
      Object.assign(options, extraOptions);
    }
    return this.createVideo({
      prompt,
      scene: "text-to-video",
      options,
      model
    });
  }

  async imageToVideo(
    prompt,
    { imageUrls, duration = "10", aspectRatio = "16:9", resolution, model, extraOptions } = {}
  ) {
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      throw new TypeError("imageUrls must be a non-empty array");
    }

    const options = {
      duration,
      aspect_ratio: aspectRatio,
      image_input: imageUrls
    };
    if (resolution) {
      options.resolution = resolution;
    }
    if (extraOptions) {
      Object.assign(options, extraOptions);
    }
    return this.createVideo({
      prompt,
      scene: "image-to-video",
      options,
      model
    });
  }

  async videoToVideo(
    prompt,
    { videoUrls, duration, model, extraOptions } = {}
  ) {
    if (!Array.isArray(videoUrls) || videoUrls.length === 0) {
      throw new TypeError("videoUrls must be a non-empty array");
    }

    const options = {
      video_input: videoUrls
    };
    if (duration) {
      options.duration = duration;
    }
    if (extraOptions) {
      Object.assign(options, extraOptions);
    }
    return this.createVideo({
      prompt,
      scene: "video-to-video",
      options,
      model
    });
  }

  async uploadImages(filePaths) {
    return this.uploadFiles("/api/v1/uploads/images", filePaths);
  }

  async uploadVideos(filePaths) {
    return this.uploadFiles("/api/v1/uploads/videos", filePaths);
  }

  async uploadFiles(requestPath, filePaths) {
    if (!Array.isArray(filePaths) || filePaths.length === 0) {
      throw new TypeError("filePaths must be a non-empty array");
    }

    const form = new FormData();
    for (const filePath of filePaths) {
      const content = await fs.readFile(filePath);
      const fileName = path.basename(filePath);
      const type = MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
      form.append("files", new Blob([content], { type }), fileName);
    }

    const payload = await this.request({
      method: "POST",
      path: requestPath,
      body: form
    });
    return this.unwrapData(payload);
  }

  async getTask(taskId) {
    const payload = await this.request({
      method: "GET",
      path: `/api/v1/tasks/${taskId}`
    });
    const data = this.unwrapData(payload);
    if (data && typeof data === "object" && "task" in data) {
      return data.task;
    }
    return data;
  }

  async waitForTask(
    taskId,
    { interval = DEFAULT_POLL_INTERVAL, timeout = DEFAULT_POLL_TIMEOUT } = {}
  ) {
    const deadline = Date.now() + timeout;
    while (true) {
      const task = await this.getTask(taskId);
      const status = task && typeof task === "object" ? task.status : undefined;
      if (status === "success" || status === "failed" || status === "canceled") {
        return task;
      }
      if (Date.now() >= deadline) {
        throw new Error(`Task ${taskId} did not finish within ${timeout}ms.`);
      }
      await sleep(interval);
    }
  }
}

async function parseJsonResponse(response) {
  const text = await response.text();
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return { _raw: text };
  }
}

function extractErrorMessage(payload) {
  if (payload && typeof payload === "object") {
    const error = payload.error;
    if (error && typeof error === "object" && typeof error.message === "string" && error.message) {
      return error.message;
    }
  }
  return null;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

module.exports = {
  DEFAULT_MODEL,
  FULL_ACCESS_MODELS,
  SEEDANCE_MODELS,
  SeedanceAPIError,
  SeedanceClient
};

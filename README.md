# Seedance API

[中文 README](./README.zh-CN.md) | [CyberBara API Entry](https://cyberbara.com/api) | [CyberBara API Reference](https://cyberbara.com/docs/api-reference?__cyberbara_session=1) | [Ultimate AI Media Generator Skill](https://github.com/ZeroLu/Ultimate-AI-Media-Generator-Skill) | [Awesome Seedance](https://github.com/ZeroLu/awesome-seedance)

Practical API documentation for the full set of **Seedance models currently exposed through CyberBara public API**.

This repository is not about launch news, waitlists, or fragmented screenshots. It is a developer-facing guide for:

- which Seedance models are currently available
- which scenes each model supports
- what fields are actually accepted
- how `seedance-1`, `seedance-2`, preview, fast, and watermark-remover routes differ

Model coverage in this README is aligned to the CyberBara public API reference and related CyberBara ecosystem docs as checked on **July 16, 2026**.

[Model Coverage](#model-coverage) | [Quick Start](#quick-start) | [Video Generation Endpoint](#video-generation-endpoint) | [Per-Model Notes](#per-model-notes) | [Examples](#examples)

---

## Overview

CyberBara exposes Seedance through the public `/api/v1` API surface.

Base URL:

```text
https://cyberbara.com
```

Authentication:

```http
Authorization: Bearer <API_KEY>
```

or

```http
x-api-key: <API_KEY>
```

Core routes you will actually use:

- `GET /api/v1/models`
- `POST /api/v1/uploads/images`
- `POST /api/v1/uploads/videos`
- `POST /api/v1/videos/generations`
- `GET /api/v1/tasks/<TASK_ID>`
- `POST /api/v1/credits/quote`

---

## Model Coverage

These are the Seedance video models currently documented in CyberBara's public API material.

| Model | Supported scenes | Positioning |
| --- | --- | --- |
| `seedance-2` | `text-to-video`, `image-to-video`, `video-to-video` | Official Seedance 2 API route |
| `seedance-2-fast` | `text-to-video`, `image-to-video`, `video-to-video` | Faster official Seedance 2 route |
| `seedance-2-preview` | `text-to-video`, `image-to-video`, `video-to-video` | Legacy preview Seedance 2 route |
| `seedance-2-fast-preview` | `text-to-video`, `image-to-video`, `video-to-video` | Faster legacy preview Seedance 2 route |
| `seedance-2-watermark-remover` | `video-to-video` | Seedance video watermark removal route |
| `seedance-1-pro` | `text-to-video`, `image-to-video` | Higher-end Seedance 1 route |
| `seedance-1-lite` | `text-to-video`, `image-to-video` | Lighter Seedance 1 route |
| `seedance-1-pro-fast` | `image-to-video` | Fast Seedance 1 image-to-video route |

### Quick reading

- If you want the main current Seedance 2 route, start with `seedance-2`.
- If you want the same family with faster turnaround, check `seedance-2-fast`.
- If you are migrating older flows, you may still see `seedance-2-preview` and `seedance-2-fast-preview`.
- If your task is specifically removing a watermark from a video, use `seedance-2-watermark-remover`.
- If you are working with the older Seedance 1 family, use `seedance-1-pro`, `seedance-1-lite`, or `seedance-1-pro-fast`.

---

## Quick Start

### 1. List available video models

```bash
curl -X GET 'https://cyberbara.com/api/v1/models?media_type=video' \
  -H 'Authorization: Bearer <API_KEY>'
```

### 2. Upload reference image

```bash
curl -X POST 'https://cyberbara.com/api/v1/uploads/images' \
  -H 'Authorization: Bearer <API_KEY>' \
  -F 'files=@./reference.png'
```

### 3. Upload reference video

```bash
curl -X POST 'https://cyberbara.com/api/v1/uploads/videos' \
  -H 'Authorization: Bearer <API_KEY>' \
  -F 'files=@./reference.mp4'
```

### 4. Create a video task

```bash
curl -X POST 'https://cyberbara.com/api/v1/videos/generations' \
  -H 'Authorization: Bearer <API_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "seedance-2",
    "scene": "text-to-video",
    "prompt": "A cinematic drone shot over a futuristic city at sunrise.",
    "options": {
      "duration": "5",
      "aspect_ratio": "16:9"
    }
  }'
```

### 5. Poll task status

```bash
curl -X GET 'https://cyberbara.com/api/v1/tasks/<TASK_ID>' \
  -H 'Authorization: Bearer <API_KEY>'
```

### 6. Quote credits before submission

```bash
curl -X POST 'https://cyberbara.com/api/v1/credits/quote' \
  -H 'Authorization: Bearer <API_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "seedance-2",
    "media_type": "video",
    "scene": "text-to-video",
    "prompt": "A cinematic drone shot over a futuristic city at sunrise.",
    "options": {
      "duration": "5",
      "aspect_ratio": "16:9"
    }
  }'
```

---

## Video Generation Endpoint

All Seedance models in this repository use:

```text
POST /api/v1/videos/generations
```

Request shape:

```json
{
  "model": "seedance-2",
  "scene": "text-to-video",
  "prompt": "Your prompt here",
  "options": {}
}
```

Common scene values:

- `text-to-video`
- `image-to-video`
- `video-to-video`

Important:

- `image-to-video` uses `options.image_input`
- `video-to-video` uses `options.video_input`
- public API expects public `options.*` fields only
- provider-internal fields should not be sent directly

---

## Per-Model Notes

### `seedance-2`

Supported scenes:

- `text-to-video`
- `image-to-video`
- `video-to-video`

Key fields:

- `prompt` required
- `options.image_input` required for `image-to-video`
- `options.video_input` required for `video-to-video`
- `options.audio_input` optional for omni-reference flows
- `options.duration`: integer `4`-`15`, default `5`
- `options.aspect_ratio`: `21:9`, `16:9`, `4:3`, `1:1`, `3:4`, `9:16`
- `options.mode`: `text_to_video`, `first_last_frames`, `omni_reference`

Notes:

- official Seedance 2 route
- `video-to-video` billing uses input duration plus output duration

### `seedance-2-fast`

Supported scenes:

- `text-to-video`
- `image-to-video`
- `video-to-video`

Fields are the same as `seedance-2`.

### `seedance-2-preview`

Supported scenes:

- `text-to-video`
- `image-to-video`
- `video-to-video`

Key fields:

- `prompt` required
- `options.image_input` required for `image-to-video`, max `9`
- `options.video_input` required for `video-to-video`, exactly one URL
- `options.duration`: `5`, `10`, `15`, default `5`
- `options.aspect_ratio`: `16:9`, `9:16`, `4:3`, `3:4`
- `options.parent_task_id` optional

Notes:

- legacy preview route
- pricing and parameter behavior differ from `seedance-2` and `seedance-2-fast`

### `seedance-2-fast-preview`

Supported scenes:

- `text-to-video`
- `image-to-video`
- `video-to-video`

Fields are the same as `seedance-2-preview`.

### `seedance-2-watermark-remover`

Supported scenes:

- `video-to-video`

Key fields:

- `options.video_input` required, single URL
- `options.video_url` can be used as an alternative
- `options.duration` optional
- `prompt` optional and not used by the remover itself

### `seedance-1-pro`

Supported scenes:

- `text-to-video`
- `image-to-video`

Key fields:

- `prompt` required
- `options.image_input` required for `image-to-video`
- `options.resolution`: usually `480p`, `720p`, `1080p`
- `options.duration`: usually `5`, `10`
- `options.aspect_ratio`: default `16:9`
- `options.camera_fixed` optional
- `options.seed` or `options.seeds` optional
- `options.enable_safety_checker` optional

### `seedance-1-lite`

Supported scenes:

- `text-to-video`
- `image-to-video`

Key fields:

- `prompt` required
- `options.image_input` required for `image-to-video`
- second image may be auto-used as `end_image_url`
- `options.resolution`: usually `480p`, `720p`, `1080p`
- `options.duration`: usually `5`, `10`
- `options.aspect_ratio`: default `16:9`
- `options.camera_fixed` optional
- `options.seed` or `options.seeds` optional
- `options.enable_safety_checker` supported for `text-to-video`
- `options.end_image_url` supported for `image-to-video`

### `seedance-1-pro-fast`

Supported scenes:

- `image-to-video`

Key fields:

- `prompt` required
- `options.image_input` required
- `options.resolution`: usually `720p`, `1080p`
- `options.duration`: usually `5`, `10`

---

## Examples

### `seedance-2` text-to-video

```bash
curl -X POST 'https://cyberbara.com/api/v1/videos/generations' \
  -H 'Authorization: Bearer <API_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "seedance-2",
    "scene": "text-to-video",
    "prompt": "A cinematic drone shot over a futuristic city at sunrise.",
    "options": {
      "duration": "5",
      "aspect_ratio": "16:9"
    }
  }'
```

### `seedance-2` image-to-video

```bash
curl -X POST 'https://cyberbara.com/api/v1/videos/generations' \
  -H 'Authorization: Bearer <API_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "seedance-2",
    "scene": "image-to-video",
    "prompt": "The subject turns slowly toward camera with subtle natural motion.",
    "options": {
      "duration": "5",
      "aspect_ratio": "9:16",
      "image_input": [
        "https://your-uploaded-image-url"
      ]
    }
  }'
```

### `seedance-2` video-to-video

```bash
curl -X POST 'https://cyberbara.com/api/v1/videos/generations' \
  -H 'Authorization: Bearer <API_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "seedance-2",
    "scene": "video-to-video",
    "prompt": "Preserve the main motion, upgrade it into a cinematic commercial look.",
    "options": {
      "duration": "5",
      "video_input": [
        "https://your-uploaded-video-url"
      ]
    }
  }'
```

### `seedance-2-preview` image-to-video

```bash
curl -X POST 'https://cyberbara.com/api/v1/videos/generations' \
  -H 'Authorization: Bearer <API_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "seedance-2-preview",
    "scene": "image-to-video",
    "prompt": "Elegant portrait motion with realistic skin texture and soft eye movement.",
    "options": {
      "duration": "5",
      "aspect_ratio": "9:16",
      "image_input": [
        "https://your-uploaded-image-url"
      ]
    }
  }'
```

### `seedance-2-watermark-remover`

```bash
curl -X POST 'https://cyberbara.com/api/v1/videos/generations' \
  -H 'Authorization: Bearer <API_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "seedance-2-watermark-remover",
    "scene": "video-to-video",
    "options": {
      "video_url": "https://your-uploaded-video-url"
    }
  }'
```

### `seedance-1-pro` text-to-video

```bash
curl -X POST 'https://cyberbara.com/api/v1/videos/generations' \
  -H 'Authorization: Bearer <API_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "seedance-1-pro",
    "scene": "text-to-video",
    "prompt": "Luxury perfume commercial, glossy reflections, slow-motion liquid splash.",
    "options": {
      "duration": "10",
      "resolution": "720p",
      "aspect_ratio": "16:9"
    }
  }'
```

### `seedance-1-pro-fast` image-to-video

```bash
curl -X POST 'https://cyberbara.com/api/v1/videos/generations' \
  -H 'Authorization: Bearer <API_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "seedance-1-pro-fast",
    "scene": "image-to-video",
    "prompt": "Quick portrait motion test with soft head turn and natural blinking.",
    "options": {
      "duration": "5",
      "resolution": "720p",
      "image_input": [
        "https://your-uploaded-image-url"
      ]
    }
  }'
```

---

## Upload Limits

### Images

- route: `POST /api/v1/uploads/images`
- max files per request: `10`
- max file size: `10MB` each

### Videos

- route: `POST /api/v1/uploads/videos`
- max files per request: `1`
- max file size: `50MB`

---

## FAQ

### Does this repository cover all current Seedance models on CyberBara?

Yes. As of **July 16, 2026**, this README covers the Seedance models publicly documented in CyberBara reference material:

- `seedance-2`
- `seedance-2-fast`
- `seedance-2-preview`
- `seedance-2-fast-preview`
- `seedance-2-watermark-remover`
- `seedance-1-pro`
- `seedance-1-lite`
- `seedance-1-pro-fast`

### Is `seedance-2` the same as `seedance-2-preview`?

No.

`seedance-2` is documented as the official Seedance 2 API route. `seedance-2-preview` is a legacy preview route with different pricing and parameter behavior.

### Which models support `video-to-video`?

These Seedance models do:

- `seedance-2`
- `seedance-2-fast`
- `seedance-2-preview`
- `seedance-2-fast-preview`
- `seedance-2-watermark-remover`

### Which Seedance model is only for image-to-video?

`seedance-1-pro-fast`

### Where should I check for the latest model or parameter changes?

Use these sources first:

- [CyberBara API Reference](https://cyberbara.com/docs/api-reference?__cyberbara_session=1)
- [CyberBara API Entry](https://cyberbara.com/api)
- [Ultimate AI Media Generator Skill](https://github.com/ZeroLu/Ultimate-AI-Media-Generator-Skill)

---

## Related Resources

- [CyberBara API Entry](https://cyberbara.com/api)
- [CyberBara API Reference](https://cyberbara.com/docs/api-reference?__cyberbara_session=1)
- [Ultimate AI Media Generator Skill](https://github.com/ZeroLu/Ultimate-AI-Media-Generator-Skill)
- [Awesome Seedance](https://github.com/ZeroLu/awesome-seedance)

---

## License

MIT

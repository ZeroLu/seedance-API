Last updated on 55:36:08 27-08-2026










































# Seedance API

[中文 README](./README.zh-CN.md) | [CyberBara API Entry](https://cyberbara.com/api) | [CyberBara API Reference](https://cyberbara.com/docs/api-reference?__cyberbara_session=1) | [Ultimate AI Media Generator Skill](https://github.com/ZeroLu/Ultimate-AI-Media-Generator-Skill) | [Awesome Seedance](https://github.com/ZeroLu/awesome-seedance)

Access the **full-access Seedance API family** through CyberBara.

This is not the same access path most developers first see on BytePlus, Volcengine, Dreamina, or public preview surfaces. The important distinction is not just model names. It is whether you can actually run production workflows with:

- **real human face upload**
- **more permissive prompt review**
- **VIP priority queue**
- **stable API-first automation**

This repository is a developer-facing guide for:

- which Seedance models are currently available
- which scenes each model supports
- what fields are actually accepted
- how `seedance-1`, `seedance-2`, `stable`, `mini`, `2.5`, `ark`, and watermark-remover routes differ

Model coverage in this README is aligned to the CyberBara public API reference and related CyberBara ecosystem docs as checked on **July 16, 2026**.

Install from PyPI:

```bash
pip install seedance-api
```

Install from npm:

```bash
npm install seedance-api
```

Python quick example:

```python
from seedance_api import SeedanceClient

client = SeedanceClient("YOUR_API_KEY", model="seedance-2-stable")
created = client.text_to_video(
    "Creator-style portrait motion with realistic skin texture.",
    duration="10",
    aspect_ratio="9:16",
    resolution="1080p",
)
task = client.wait_for_task(created["task_id"])
print(task["output"]["videos"])
```

Node.js quick example:

```js
const { SeedanceClient } = require("seedance-api");

async function main() {
  const client = new SeedanceClient(process.env.CYBERBARA_API_KEY, {
    model: "seedance-2-stable"
  });

  const created = await client.textToVideo(
    "Creator-style portrait motion with realistic skin texture.",
    {
      duration: "10",
      aspectRatio: "9:16",
      resolution: "1080p"
    }
  );

  const task = await client.waitForTask(created.task_id);
  console.log(task.output?.videos || []);
}

main().catch(console.error);
```

[Model Coverage](#model-coverage) | [Comparison](#comparison) | [Who It's For](#who-its-for) | [Quick Start](#quick-start) | [Per-Model Notes](#per-model-notes)

---

## Overview

CyberBara exposes Seedance through the public `/api/v1` API surface, but the practical value here is not just "there is an endpoint." The value is that CyberBara surfaces the broader **full-access Seedance family**, including the lanes that teams usually care about when public or standard-access routes feel too restrictive.

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

## Comparison

The main confusion around Seedance is that people assume every entry point gives the same capability. It does not.

| Access path | Real human face upload | Prompt review | Queue priority | Notes |
| --- | --- | --- | --- | --- |
| **CyberBara full-access Seedance lanes** | **Supported for real production workflows** | **More permissive** | **VIP priority queue** | Best fit when you need stable API workflows with real-face support |
| BytePlus / Volcengine standard API | Usually more restricted | Usually stricter | Standard queue | Better for standard cloud procurement than full-access creator workflows |
| Public Dreamina / preview surfaces | Usually the most limited | Public-product moderation | Shared queue | Fine for trying ideas, weak for sustained production |
| Direct enterprise full-access lane | Contract-dependent | Contract-dependent | Highest contract priority | Typically associated with very large enterprise commitments |

In plain English:

- if you need **real human face upload**
- if you want **fewer prompt-review bottlenecks**
- if queue priority matters
- if you need one API surface for upload, generation, polling, and reuse

then CyberBara should be evaluated as a **full-access Seedance lane**, not as a consumer UI equivalent.

---

## Who It's For

This repo is a strong fit if you are:

- building **real-face video workflows** for ads, UGC, avatar content, short drama tests, or creator tools
- running an **AI video product, internal media pipeline, or automation workflow**
- an **agency or growth team** that needs more reliable real-person media generation
- comparing Seedance entry points and specifically trying to avoid overly restrictive public lanes

This repo is probably not your main need if you only want:

- casual browser testing
- one-off prompt experiments
- a consumer playground without API integration

---

## Model Coverage

These are the Seedance video models currently documented in CyberBara public API material or actively surfaced in CyberBara's own product codepaths.

| Model | Supported scenes | Positioning |
| --- | --- | --- |
| `seedance-2` | `text-to-video`, `image-to-video`, `video-to-video` | Official Seedance 2 API route |
| `seedance-2-fast` | `text-to-video`, `image-to-video`, `video-to-video` | Faster official Seedance 2 route |
| `seedance-2-stable` | `text-to-video`, `image-to-video`, `video-to-video` | Stable full-access Seedance 2 route |
| `seedance-2-fast-stable` | `text-to-video`, `image-to-video`, `video-to-video` | Faster stable full-access Seedance 2 route |
| `seedance-2-mini` | `text-to-video`, `image-to-video`, `video-to-video` | Public Seedance 2 Mini route |
| `seedance-2-mini-ark` | `text-to-video`, `image-to-video`, `video-to-video` | ARK-backed Seedance 2 Mini route |
| `seedance-2-ark` | `text-to-video`, `image-to-video`, `video-to-video` | ARK-backed Seedance 2 route |
| `seedance-2-fast-ark` | `text-to-video`, `image-to-video`, `video-to-video` | Faster ARK-backed Seedance 2 route |
| `seedance-2.5` | product-facing entry | Seedance 2.5 entry currently surfaced in CyberBara UI |
| `seedance-2-watermark-remover` | `video-to-video` | Seedance video watermark removal route |
| `seedance-1-pro` | `text-to-video`, `image-to-video` | Higher-end Seedance 1 route |
| `seedance-1-lite` | `text-to-video`, `image-to-video` | Lighter Seedance 1 route |
| `seedance-1-pro-fast` | `image-to-video` | Fast Seedance 1 image-to-video route |

### Quick reading

- If you want the main current Seedance 2 route, start with `seedance-2`.
- If you want the same family with faster turnaround, check `seedance-2-fast`.
- If you want CyberBara's stable full-access real-face-oriented lane, check `seedance-2-stable` and `seedance-2-fast-stable`.
- If you want the lower-cost or lighter lane, check `seedance-2-mini` or `seedance-2-mini-ark`.
- If you need the ARK-backed family, check `seedance-2-ark`, `seedance-2-fast-ark`, and `seedance-2-mini-ark`.
- If you are tracking the newest entry, include `seedance-2.5` in your evaluation.
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

### `seedance-2-stable`

Supported scenes:

- `text-to-video`
- `image-to-video`
- `video-to-video`

Key fields:

- `prompt` required
- `options.image_input` required for `image-to-video`
- `options.video_input` required for `video-to-video`
- `options.duration`: integer `4`-`15`
- `options.aspect_ratio`: `21:9`, `16:9`, `4:3`, `1:1`, `3:4`, `9:16`
- `options.resolution`: commonly `480p`, `720p`, `1080p`, and for `seedance-2-stable` also `4k`

Notes:

- stable full-access Seedance 2 lane
- local CyberBara code treats this as a distinct public model family
- `seedance-2-stable` is the one with explicit `4k` handling in local execution code
- this is one of the most important lanes if you care about real human face upload, more permissive prompt handling, and a more production-oriented path

### `seedance-2-fast-stable`

Supported scenes:

- `text-to-video`
- `image-to-video`
- `video-to-video`

Fields are largely the same as `seedance-2-stable`.

Notes:

- faster stable full-access lane
- local execution code still treats it separately from `seedance-2-stable`
- local product code also maps the current `seedance-2.5` entry into this execution lane

### `seedance-2-mini`

Supported scenes:

- `text-to-video`
- `image-to-video`
- `video-to-video`

Notes:

- public Seedance 2 Mini route used in CyberBara product code
- local pricing and execution rules treat this as a distinct public model family

### `seedance-2-mini-ark`

Supported scenes:

- `text-to-video`
- `image-to-video`
- `video-to-video`

Notes:

- ARK-backed Seedance 2 Mini route
- local pricing and execution rules treat this separately from `seedance-2-mini`

### `seedance-2-ark`

Supported scenes:

- `text-to-video`
- `image-to-video`
- `video-to-video`

Notes:

- ARK-backed Seedance 2 route
- same broad scene coverage as `seedance-2`

### `seedance-2-fast-ark`

Supported scenes:

- `text-to-video`
- `image-to-video`
- `video-to-video`

Notes:

- faster ARK-backed Seedance 2 route

### `seedance-2.5`

Notes:

- surfaced in CyberBara product UI as `seedance-2.5`
- local execution code currently maps this entry to the `seedance-2-fast-stable` execution lane
- treat this as a product-facing full-access entry that should be tracked, but do not assume it already has fully separate public parameter docs
- if you are evaluating the newest Seedance lane with real-face upload and a more production-oriented path, include this in the comparison

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

### `seedance-2-stable` text-to-video

```bash
curl -X POST 'https://cyberbara.com/api/v1/videos/generations' \
  -H 'Authorization: Bearer <API_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "seedance-2-stable",
    "scene": "text-to-video",
    "prompt": "Realistic creator-style portrait motion with natural skin texture and stable facial consistency.",
    "options": {
      "duration": "10",
      "resolution": "1080p",
      "aspect_ratio": "9:16"
    }
  }'
```

### `seedance-2-mini` image-to-video

```bash
curl -X POST 'https://cyberbara.com/api/v1/videos/generations' \
  -H 'Authorization: Bearer <API_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "seedance-2-mini",
    "scene": "image-to-video",
    "prompt": "Quick portrait motion with natural blinking and subtle head turn.",
    "options": {
      "duration": "5",
      "aspect_ratio": "9:16",
      "image_input": [
        "https://your-uploaded-image-url"
      ]
    }
  }'
```

### `seedance-2.5`

```bash
curl -X POST 'https://cyberbara.com/api/v1/videos/generations' \
  -H 'Authorization: Bearer <API_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "seedance-2.5",
    "scene": "text-to-video",
    "prompt": "High-end commercial motion with polished lighting and premium cinematic pacing.",
    "options": {
      "duration": "10",
      "aspect_ratio": "16:9"
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

Yes. As of **July 16, 2026**, this README covers the Seedance models publicly documented or actively surfaced in CyberBara product code:

- `seedance-2`
- `seedance-2-fast`
- `seedance-2-stable`
- `seedance-2-fast-stable`
- `seedance-2-mini`
- `seedance-2-mini-ark`
- `seedance-2-ark`
- `seedance-2-fast-ark`
- `seedance-2.5`
- `seedance-2-watermark-remover`
- `seedance-1-pro`
- `seedance-1-lite`
- `seedance-1-pro-fast`

### Is `seedance-2` the same as `seedance-2-stable`?

No.

`seedance-2` and `seedance-2-fast` are documented public official routes. `seedance-2-stable` and `seedance-2-fast-stable` are separate stable KIE-backed lanes surfaced in CyberBara product code.

### Which models support `video-to-video`?

These Seedance models do:

- `seedance-2`
- `seedance-2-fast`
- `seedance-2-stable`
- `seedance-2-fast-stable`
- `seedance-2-mini`
- `seedance-2-mini-ark`
- `seedance-2-ark`
- `seedance-2-fast-ark`
- `seedance-2-watermark-remover`

### Which Seedance model is only for image-to-video?

`seedance-1-pro-fast`

### Why is `seedance-2.5` listed with fewer parameter details?

Because local CyberBara product code already surfaces `seedance-2.5`, but the public parameter docs are not yet as explicit as the older Seedance families. Local execution code currently maps it to the `seedance-2-fast-stable` lane.

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

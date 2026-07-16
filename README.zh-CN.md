# Seedance API 中文说明

[English README](./README.md) | [CyberBara API 入口](https://cyberbara.com/api) | [CyberBara API 参考](https://cyberbara.com/docs/api-reference?__cyberbara_session=1) | [Ultimate AI Media Generator Skill](https://github.com/ZeroLu/Ultimate-AI-Media-Generator-Skill) | [Awesome Seedance](https://github.com/ZeroLu/awesome-seedance)

这是一份面向开发者的 **Seedance API 文档仓库**，整理的是 **CyberBara 公共 API 当前公开可用的全部 Seedance 模型**。

它关注的不是发布新闻、截图或者体验页，而是开发者真正需要的信息：

- 现在到底有哪些 Seedance 模型
- 每个模型支持哪些场景
- 哪些字段是真正能传的
- `seedance-1`、`seedance-2`、preview、fast、watermark remover 到底怎么区分

这份 README 的模型覆盖，按 **2026 年 7 月 16 日** 核对 CyberBara 公共 API 参考文档和相关生态文档整理。

[模型覆盖](#模型覆盖) | [快速开始](#快速开始) | [视频生成接口](#视频生成接口) | [模型说明](#模型说明) | [请求示例](#请求示例)

---

## 概览

CyberBara 通过公开的 `/api/v1` 路径暴露 Seedance 能力。

Base URL：

```text
https://cyberbara.com
```

鉴权方式：

```http
Authorization: Bearer <API_KEY>
```

或者：

```http
x-api-key: <API_KEY>
```

常用接口：

- `GET /api/v1/models`
- `POST /api/v1/uploads/images`
- `POST /api/v1/uploads/videos`
- `POST /api/v1/videos/generations`
- `GET /api/v1/tasks/<TASK_ID>`
- `POST /api/v1/credits/quote`

---

## 模型覆盖

下面这些就是 CyberBara 当前公开文档里能看到的 Seedance 视频模型。

| 模型 | 支持场景 | 定位 |
| --- | --- | --- |
| `seedance-2` | `text-to-video`, `image-to-video`, `video-to-video` | 官方 Seedance 2 主路由 |
| `seedance-2-fast` | `text-to-video`, `image-to-video`, `video-to-video` | 更快的官方 Seedance 2 路由 |
| `seedance-2-preview` | `text-to-video`, `image-to-video`, `video-to-video` | 历史 preview 路由 |
| `seedance-2-fast-preview` | `text-to-video`, `image-to-video`, `video-to-video` | 更快的历史 preview 路由 |
| `seedance-2-watermark-remover` | `video-to-video` | Seedance 去水印专用路由 |
| `seedance-1-pro` | `text-to-video`, `image-to-video` | Seedance 1 高配路由 |
| `seedance-1-lite` | `text-to-video`, `image-to-video` | Seedance 1 轻量路由 |
| `seedance-1-pro-fast` | `image-to-video` | Seedance 1 快速图生视频路由 |

快速理解：

- 想走当前主线路，先看 `seedance-2`
- 想要更快版本，先看 `seedance-2-fast`
- 迁移老工作流时，常会碰到 `seedance-2-preview` 和 `seedance-2-fast-preview`
- 只做去水印，用 `seedance-2-watermark-remover`
- 还在使用旧一代 Seedance 路线的，关注 `seedance-1-pro`、`seedance-1-lite`、`seedance-1-pro-fast`

---

## 快速开始

### 1. 获取视频模型列表

```bash
curl -X GET 'https://cyberbara.com/api/v1/models?media_type=video' \
  -H 'Authorization: Bearer <API_KEY>'
```

### 2. 上传参考图

```bash
curl -X POST 'https://cyberbara.com/api/v1/uploads/images' \
  -H 'Authorization: Bearer <API_KEY>' \
  -F 'files=@./reference.png'
```

### 3. 上传参考视频

```bash
curl -X POST 'https://cyberbara.com/api/v1/uploads/videos' \
  -H 'Authorization: Bearer <API_KEY>' \
  -F 'files=@./reference.mp4'
```

### 4. 创建视频任务

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

### 5. 查询任务状态

```bash
curl -X GET 'https://cyberbara.com/api/v1/tasks/<TASK_ID>' \
  -H 'Authorization: Bearer <API_KEY>'
```

### 6. 生成前先询价

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

## 视频生成接口

这份仓库里提到的全部 Seedance 模型都使用：

```text
POST /api/v1/videos/generations
```

请求体结构：

```json
{
  "model": "seedance-2",
  "scene": "text-to-video",
  "prompt": "Your prompt here",
  "options": {}
}
```

常见场景值：

- `text-to-video`
- `image-to-video`
- `video-to-video`

要点：

- `image-to-video` 使用 `options.image_input`
- `video-to-video` 使用 `options.video_input`
- 公共 API 只接受对外公开的 `options.*` 字段
- 不要直接传 provider 内部字段

---

## 模型说明

### `seedance-2`

支持场景：

- `text-to-video`
- `image-to-video`
- `video-to-video`

关键字段：

- `prompt` 必填
- `options.image_input` 在 `image-to-video` 下必填
- `options.video_input` 在 `video-to-video` 下必填
- `options.audio_input` 在 omni-reference 场景可选
- `options.duration`：整数 `4` 到 `15`，默认 `5`
- `options.aspect_ratio`：`21:9`、`16:9`、`4:3`、`1:1`、`3:4`、`9:16`
- `options.mode`：`text_to_video`、`first_last_frames`、`omni_reference`

说明：

- 这是官方 Seedance 2 主路由
- `video-to-video` 计费会包含输入视频时长和输出视频时长

### `seedance-2-fast`

支持场景：

- `text-to-video`
- `image-to-video`
- `video-to-video`

字段与 `seedance-2` 相同。

### `seedance-2-preview`

支持场景：

- `text-to-video`
- `image-to-video`
- `video-to-video`

关键字段：

- `prompt` 必填
- `options.image_input` 在 `image-to-video` 下必填，最多 `9`
- `options.video_input` 在 `video-to-video` 下必填，且只能一个 URL
- `options.duration`：`5`、`10`、`15`，默认 `5`
- `options.aspect_ratio`：`16:9`、`9:16`、`4:3`、`3:4`
- `options.parent_task_id` 可选

说明：

- 这是历史 preview 路由
- 它与 `seedance-2`、`seedance-2-fast` 在价格和参数行为上都不同

### `seedance-2-fast-preview`

支持场景：

- `text-to-video`
- `image-to-video`
- `video-to-video`

字段与 `seedance-2-preview` 相同。

### `seedance-2-watermark-remover`

支持场景：

- `video-to-video`

关键字段：

- `options.video_input` 必填，单个 URL
- `options.video_url` 可作为替代字段
- `options.duration` 可选
- `prompt` 可不传，而且去水印本身不会用到它

### `seedance-1-pro`

支持场景：

- `text-to-video`
- `image-to-video`

关键字段：

- `prompt` 必填
- `options.image_input` 在 `image-to-video` 下必填
- `options.resolution`：通常用 `480p`、`720p`、`1080p`
- `options.duration`：通常用 `5`、`10`
- `options.aspect_ratio`：默认 `16:9`
- `options.camera_fixed` 可选
- `options.seed` 或 `options.seeds` 可选
- `options.enable_safety_checker` 可选

### `seedance-1-lite`

支持场景：

- `text-to-video`
- `image-to-video`

关键字段：

- `prompt` 必填
- `options.image_input` 在 `image-to-video` 下必填
- 第二张图可能会自动作为 `end_image_url`
- `options.resolution`：通常用 `480p`、`720p`、`1080p`
- `options.duration`：通常用 `5`、`10`
- `options.aspect_ratio`：默认 `16:9`
- `options.camera_fixed` 可选
- `options.seed` 或 `options.seeds` 可选
- `options.enable_safety_checker` 在 `text-to-video` 支持
- `options.end_image_url` 在 `image-to-video` 支持

### `seedance-1-pro-fast`

支持场景：

- `image-to-video`

关键字段：

- `prompt` 必填
- `options.image_input` 必填
- `options.resolution`：通常用 `720p`、`1080p`
- `options.duration`：通常用 `5`、`10`

---

## 请求示例

### `seedance-2` 文生视频

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

### `seedance-2` 图生视频

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

### `seedance-2` 视频转视频

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

### `seedance-2-preview` 图生视频

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

### `seedance-1-pro` 文生视频

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

### `seedance-1-pro-fast` 图生视频

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

## 上传限制

### 图片

- 路径：`POST /api/v1/uploads/images`
- 单次最多 `10` 个文件
- 单文件最大 `10MB`

### 视频

- 路径：`POST /api/v1/uploads/videos`
- 单次最多 `1` 个文件
- 单文件最大 `50MB`

---

## FAQ

### 这个仓库覆盖了 CyberBara 当前全部 Seedance 模型吗？

是的。按 **2026 年 7 月 16 日** 核对，这份 README 覆盖了 CyberBara 公开参考资料里写到的全部 Seedance 模型：

- `seedance-2`
- `seedance-2-fast`
- `seedance-2-preview`
- `seedance-2-fast-preview`
- `seedance-2-watermark-remover`
- `seedance-1-pro`
- `seedance-1-lite`
- `seedance-1-pro-fast`

### `seedance-2` 和 `seedance-2-preview` 一样吗？

不一样。

`seedance-2` 在文档里被定义为官方 Seedance 2 主路由，`seedance-2-preview` 则是历史 preview 路由，价格和参数行为都不一样。

### 哪些 Seedance 模型支持 `video-to-video`？

支持的是：

- `seedance-2`
- `seedance-2-fast`
- `seedance-2-preview`
- `seedance-2-fast-preview`
- `seedance-2-watermark-remover`

### 哪个 Seedance 模型只支持图生视频？

`seedance-1-pro-fast`

### 去哪里看最新模型或参数变动？

优先看这些来源：

- [CyberBara API Reference](https://cyberbara.com/docs/api-reference?__cyberbara_session=1)
- [CyberBara API Entry](https://cyberbara.com/api)
- [Ultimate AI Media Generator Skill](https://github.com/ZeroLu/Ultimate-AI-Media-Generator-Skill)

---

## 相关资源

- [CyberBara API Entry](https://cyberbara.com/api)
- [CyberBara API Reference](https://cyberbara.com/docs/api-reference?__cyberbara_session=1)
- [Ultimate AI Media Generator Skill](https://github.com/ZeroLu/Ultimate-AI-Media-Generator-Skill)
- [Awesome Seedance](https://github.com/ZeroLu/awesome-seedance)

---

## License

MIT

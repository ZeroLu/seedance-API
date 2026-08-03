Last updated on 14:31:03 03-08-2026


















# Seedance API 中文说明

[English README](./README.md) | [CyberBara API 入口](https://cyberbara.com/api) | [CyberBara API 参考](https://cyberbara.com/docs/api-reference?__cyberbara_session=1) | [Ultimate AI Media Generator Skill](https://github.com/ZeroLu/Ultimate-AI-Media-Generator-Skill) | [Awesome Seedance](https://github.com/ZeroLu/awesome-seedance)

通过 CyberBara 接入 **满血版 Seedance API 全家桶**。

这里不是普通公开试玩入口，也不是大家第一次在 BytePlus、火山引擎、Dreamina 或某些 preview 页面里看到的那种能力层级。真正关键的区别，不只是模型名，而是你能不能稳定跑下面这些生产能力：

- **真实人脸上传**
- **更宽松的提示词审核**
- **VIP 优先队列**
- **稳定的 API 自动化工作流**

这份仓库整理的是开发者真正需要的信息：

- 现在到底有哪些 Seedance 模型
- 每个模型支持哪些场景
- 哪些字段是真正能传的
- `seedance-1`、`seedance-2`、`stable`、`mini`、`2.5`、`ark`、watermark remover 到底怎么区分

这份 README 的模型覆盖，按 **2026 年 7 月 16 日** 核对 CyberBara 公共 API 参考文档和相关生态文档整理。

PyPI 安装：

```bash
pip install seedance-api
```

npm 安装：

```bash
npm install seedance-api
```

Python 最短示例：

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

Node.js 最短示例：

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

[模型覆盖](#模型覆盖) | [能力对比](#能力对比) | [适合谁](#适合谁) | [快速开始](#快速开始) | [模型说明](#模型说明)

---

## 概览

CyberBara 通过公开的 `/api/v1` 路径暴露 Seedance 能力，但这里真正重要的不是“有一个接口”，而是 CyberBara 实际对外提供了更接近 **满血版 Seedance** 的能力路线，包括那些当公开入口太严格时，团队真正会在意的型号和通道。

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

## 能力对比

很多人对 Seedance 最大的误解是：以为所有入口能力都差不多。实际不是。

| 接入方式 | 真实人脸上传 | 提示词审核 | 队列优先级 | 说明 |
| --- | --- | --- | --- | --- |
| **CyberBara 满血版 Seedance 路线** | **支持真实生产工作流** | **更宽松** | **VIP 优先队列** | 最适合需要真人视频和稳定 API 工作流的团队 |
| BytePlus / 火山引擎标准 API | 一般更受限 | 一般更严格 | 普通队列 | 更适合标准云采购，不是这里强调的满血路线 |
| Dreamina / preview 公开入口 | 通常限制最多 | 公开产品审核规则 | 公共队列 | 适合试用灵感，不适合稳定生产 |
| 直签企业满血通道 | 按合同开放 | 按合同开放 | 按合同高优先级 | 通常对应非常高的企业级预算和采购门槛 |

一句话理解：

- 如果你在意 **真实人脸上传**
- 如果你想减少 **提示词审核拦截**
- 如果你需要更好的排队优先级
- 如果你要一套 API 完成上传、生成、轮询、复用

那你应该把 CyberBara 看成 **满血版 Seedance 路线**，而不是普通网页试玩入口。

---

## 适合谁

这份仓库尤其适合下面这些人：

- 做 **真人视频工作流** 的开发者和团队
- 做 **广告素材、UGC、达人视频、短剧测试、数字人参考视频** 的内容团队
- 正在做 **AI 视频产品、内部媒体生产链路、自动化工作流** 的产品和工程团队
- 正在比较不同 Seedance 入口，并且明确不想被过严的公开入口限制住的人

如果你只需要下面这些，这个仓库可能不是第一优先：

- 纯网页试玩
- 一次性 prompt 实验
- 不需要 API 接入的简单体验

---

## 模型覆盖

下面这些就是 CyberBara 当前公开文档里能看到，或者在 CyberBara 产品代码里明确露出的 Seedance 视频模型。

| 模型 | 支持场景 | 定位 |
| --- | --- | --- |
| `seedance-2` | `text-to-video`, `image-to-video`, `video-to-video` | 官方 Seedance 2 主路由 |
| `seedance-2-fast` | `text-to-video`, `image-to-video`, `video-to-video` | 更快的官方 Seedance 2 路由 |
| `seedance-2-stable` | `text-to-video`, `image-to-video`, `video-to-video` | 满血稳定版 Seedance 2 路由 |
| `seedance-2-fast-stable` | `text-to-video`, `image-to-video`, `video-to-video` | 更快的满血稳定版 Seedance 2 路由 |
| `seedance-2-mini` | `text-to-video`, `image-to-video`, `video-to-video` | 公共 Seedance 2 Mini 路由 |
| `seedance-2-mini-ark` | `text-to-video`, `image-to-video`, `video-to-video` | ARK 版 Seedance 2 Mini 路由 |
| `seedance-2-ark` | `text-to-video`, `image-to-video`, `video-to-video` | ARK 版 Seedance 2 路由 |
| `seedance-2-fast-ark` | `text-to-video`, `image-to-video`, `video-to-video` | 更快的 ARK 版 Seedance 2 路由 |
| `seedance-2.5` | 产品入口 | CyberBara 已露出的 Seedance 2.5 入口 |
| `seedance-2-watermark-remover` | `video-to-video` | Seedance 去水印专用路由 |
| `seedance-1-pro` | `text-to-video`, `image-to-video` | Seedance 1 高配路由 |
| `seedance-1-lite` | `text-to-video`, `image-to-video` | Seedance 1 轻量路由 |
| `seedance-1-pro-fast` | `image-to-video` | Seedance 1 快速图生视频路由 |

快速理解：

- 想走当前主线路，先看 `seedance-2`
- 想要更快版本，先看 `seedance-2-fast`
- 想走 CyberBara 满血版真人路线，先看 `seedance-2-stable` 和 `seedance-2-fast-stable`
- 想走更轻量或更低成本路线，先看 `seedance-2-mini` 或 `seedance-2-mini-ark`
- 想走 ARK 系列，关注 `seedance-2-ark`、`seedance-2-fast-ark`、`seedance-2-mini-ark`
- 想跟最新入口保持同步，也要把 `seedance-2.5` 算进去
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

### `seedance-2-stable`

支持场景：

- `text-to-video`
- `image-to-video`
- `video-to-video`

关键字段：

- `prompt` 必填
- `options.image_input` 在 `image-to-video` 下必填
- `options.video_input` 在 `video-to-video` 下必填
- `options.duration`：整数 `4` 到 `15`
- `options.aspect_ratio`：`21:9`、`16:9`、`4:3`、`1:1`、`3:4`、`9:16`
- `options.resolution`：常见 `480p`、`720p`、`1080p`，其中 `seedance-2-stable` 在本地执行代码里还有 `4k` 特判

说明：

- 这是满血稳定版 Seedance 2 路线
- CyberBara 本地代码把它当成独立公开模型族处理
- `seedance-2-stable` 是当前本地执行代码里明确支持 `4k` 的那条路
- 如果你在意真实人脸上传、更宽松审核、以及更偏生产向的工作流，这条线是重点

### `seedance-2-fast-stable`

支持场景：

- `text-to-video`
- `image-to-video`
- `video-to-video`

字段整体上接近 `seedance-2-stable`。

说明：

- 更快的满血稳定版路线
- 本地执行代码仍然把它和 `seedance-2-stable` 分开处理
- `seedance-2.5` 当前在本地执行代码里也会映射到这条链路

### `seedance-2-mini`

支持场景：

- `text-to-video`
- `image-to-video`
- `video-to-video`

说明：

- CyberBara 产品代码里实际在用的公共 Seedance 2 Mini 路由
- 本地定价和执行规则也把它当成独立模型族处理

### `seedance-2-mini-ark`

支持场景：

- `text-to-video`
- `image-to-video`
- `video-to-video`

说明：

- ARK 版 Seedance 2 Mini 路由
- 本地定价和执行规则把它和 `seedance-2-mini` 分开处理

### `seedance-2-ark`

支持场景：

- `text-to-video`
- `image-to-video`
- `video-to-video`

说明：

- ARK 版 Seedance 2 路由
- 与 `seedance-2` 一样覆盖三种主要视频场景

### `seedance-2-fast-ark`

支持场景：

- `text-to-video`
- `image-to-video`
- `video-to-video`

说明：

- 更快的 ARK 版 Seedance 2 路由

### `seedance-2.5`

说明：

- CyberBara 产品 UI 里已经露出了 `seedance-2.5`
- 但本地执行代码当前仍把它映射到 `seedance-2-fast-stable` 这条执行链路
- 所以应该把它视为需要重点追踪的满血版产品入口，但不要假设它已经有完全独立公开的参数文档
- 如果你正在评估最新的 Seedance 入口，同时关心真人上传和更偏生产向的能力，就应该把它算进去

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

### `seedance-2-stable` 文生视频

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

### `seedance-2-mini` 图生视频

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

是的。按 **2026 年 7 月 16 日** 核对，这份 README 覆盖了 CyberBara 公开参考资料里写到，或者在 CyberBara 产品代码里实际露出的 Seedance 模型：

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

### `seedance-2` 和 `seedance-2-stable` 一样吗？

不一样。

`seedance-2` 和 `seedance-2-fast` 是公开文档里写明的官方主路由，`seedance-2-stable` 和 `seedance-2-fast-stable` 则是 CyberBara 产品代码里单独露出的稳定版 KIE 路线。

### 哪些 Seedance 模型支持 `video-to-video`？

支持的是：

- `seedance-2`
- `seedance-2-fast`
- `seedance-2-stable`
- `seedance-2-fast-stable`
- `seedance-2-mini`
- `seedance-2-mini-ark`
- `seedance-2-ark`
- `seedance-2-fast-ark`
- `seedance-2-watermark-remover`

### 哪个 Seedance 模型只支持图生视频？

`seedance-1-pro-fast`

### 为什么 `seedance-2.5` 的参数说明更少？

因为 CyberBara 产品代码里已经露出了 `seedance-2.5`，但公开参数文档还没有像旧 Seedance 系列那样写得那么细。本地执行代码当前会把它映射到 `seedance-2-fast-stable` 这条执行链路。

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

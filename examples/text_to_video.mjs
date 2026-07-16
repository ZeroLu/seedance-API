import { SeedanceClient } from "../index.js";

const client = new SeedanceClient(process.env.CYBERBARA_API_KEY, {
  model: "seedance-2-stable"
});

const quote = await client.quoteVideo({
  prompt: "Creator-style portrait motion with realistic skin texture.",
  scene: "text-to-video",
  options: {
    duration: "10",
    aspect_ratio: "9:16",
    resolution: "1080p"
  }
});

console.log({ quote });

const created = await client.textToVideo(
  "Creator-style portrait motion with realistic skin texture.",
  {
    duration: "10",
    aspectRatio: "9:16",
    resolution: "1080p"
  }
);

console.log({ created });

const task = await client.waitForTask(created.task_id);
console.log({ task, videos: task.output?.videos || [] });

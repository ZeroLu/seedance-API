import { SeedanceClient } from "../index.js";

const client = new SeedanceClient(process.env.CYBERBARA_API_KEY, {
  model: "seedance-2-mini"
});

const upload = await client.uploadImages(["./reference.png"]);

const created = await client.imageToVideo(
  "Quick portrait motion with natural blinking and subtle head turn.",
  {
    imageUrls: upload.urls,
    duration: "5",
    aspectRatio: "9:16"
  }
);

console.log({ created });

const task = await client.waitForTask(created.task_id);
console.log({ task, videos: task.output?.videos || [] });

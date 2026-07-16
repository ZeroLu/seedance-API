import { SeedanceClient } from "../index.js";

const client = new SeedanceClient(process.env.CYBERBARA_API_KEY, {
  model: "seedance-2-fast-stable"
});

const upload = await client.uploadVideos(["./reference.mp4"]);

const created = await client.videoToVideo(
  "Preserve the motion and upgrade it into a polished cinematic commercial look.",
  {
    videoUrls: upload.urls,
    duration: "10"
  }
);

console.log({ created });

const task = await client.waitForTask(created.task_id);
console.log({ task, videos: task.output?.videos || [] });

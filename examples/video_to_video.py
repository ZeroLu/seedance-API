from __future__ import annotations

import os
from pprint import pprint

from seedance_api import SeedanceClient


def main() -> None:
    api_key = os.environ["CYBERBARA_API_KEY"]
    client = SeedanceClient(api_key, model="seedance-2-fast-stable")

    upload = client.upload_videos(["./reference.mp4"])
    video_urls = upload["urls"]

    created = client.video_to_video(
        "Preserve the motion and upgrade it into a polished cinematic commercial look.",
        video_urls=video_urls,
        duration="10",
    )
    pprint({"created": created})

    task = client.wait_for_task(created["task_id"])
    pprint({"task": task, "videos": task.get("output", {}).get("videos", [])})


if __name__ == "__main__":
    main()

from __future__ import annotations

import os
from pprint import pprint

from seedance_api import SeedanceClient


def main() -> None:
    api_key = os.environ["CYBERBARA_API_KEY"]
    client = SeedanceClient(api_key, model="seedance-2-mini")

    upload = client.upload_images(["./reference.png"])
    image_urls = upload["urls"]

    created = client.image_to_video(
        "Quick portrait motion with natural blinking and subtle head turn.",
        image_urls=image_urls,
        duration="5",
        aspect_ratio="9:16",
    )
    pprint({"created": created})

    task = client.wait_for_task(created["task_id"])
    pprint({"task": task, "videos": task.get("output", {}).get("videos", [])})


if __name__ == "__main__":
    main()

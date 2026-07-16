from __future__ import annotations

import os
from pprint import pprint

from seedance_api import SeedanceClient


def main() -> None:
    api_key = os.environ["CYBERBARA_API_KEY"]
    client = SeedanceClient(api_key, model="seedance-2-stable")

    quote = client.quote_video(
        prompt="Creator-style portrait motion with realistic skin texture.",
        scene="text-to-video",
        options={"duration": "10", "aspect_ratio": "9:16", "resolution": "1080p"},
    )
    pprint({"quote": quote})

    created = client.text_to_video(
        "Creator-style portrait motion with realistic skin texture.",
        duration="10",
        aspect_ratio="9:16",
        resolution="1080p",
    )
    pprint({"created": created})

    task = client.wait_for_task(created["task_id"])
    pprint({"task": task, "videos": task.get("output", {}).get("videos", [])})


if __name__ == "__main__":
    main()

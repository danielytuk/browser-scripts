import os
import requests
import re

def fetch_domains(api_url, fallback_url):
    try:
        return {instance["api_url"] for instance in requests.get(api_url).json()}
    except requests.RequestException:
        return {instance["api_url"] for instance in requests.get(fallback_url).json()}

primary_url = "https://piped-instances.kavin.rocks/"
fallback_url = "https://worker-snowy-cake-fcf5.cueisdi.workers.dev/"
domains = fetch_domains(primary_url, fallback_url)

script_path = os.path.join(os.getenv("GITHUB_WORKSPACE"), "piped-video-enhancer", "index.js")
with open(script_path, "r") as file:
    script_content = file.read()

updated_match_line = re.sub(
    r"(\/\/ @match\s+.+\n)",
    lambda match: f"{match.group(0)} {' *://'.join(domains)}/watch?v=*\n",
    script_content,
)

with open(script_path, "w") as file:
    file.write(updated_match_line)

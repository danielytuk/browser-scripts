import os
import requests
import re

script_dir = os.path.dirname(os.path.realpath(__file__))
index_js_path = os.path.join(script_dir, "index.js")

response = requests.get("https://piped-instances.kavin.rocks/")
domains = {instance["api_url"] for instance in response.json()}

with open(index_js_path, "r") as file:
    script_content = file.read()

updated_match_line = re.sub(
    r"(\/\/ @match\s+.+\n)",
    lambda match: f"{match.group(0)} {' *://'.join(domains)}/watch?v=*\n",
    script_content,
)

with open(index_js_path, "w") as file:
    file.write(updated_match_line)

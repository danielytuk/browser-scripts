import requests
import re

response = requests.get("https://piped-instances.kavin.rocks/")
domains = {instance["api_url"] for instance in response.json()}

with open("index.js", "r") as file:
    script_content = file.read()

updated_match_line = re.sub(
    r"(\/\/ @match\s+.+\n)",
    lambda match: f"{match.group(0)} {' *://'.join(domains)}/watch?v=*\n",
    script_content,
)

with open("index.js", "w") as file:
    file.write(updated_match_line)

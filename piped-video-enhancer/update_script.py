import requests
import re

response = requests.get("https://piped-instances.kavin.rocks/")
domains = {instance["api_url"] for instance in response.json()}

with open("index.js", "r") as file:
    script_content = file.read()

updated_match_line = re.sub(
    r"(\/\/ @match\s+.+)",
    lambda match: f"{match.group(1)} *://{', *://'.join(domains)}/watch?v=*",
    script_content,
    count=1,
)

with open("index.js", "w") as file:
    file.write(updated_match_line)

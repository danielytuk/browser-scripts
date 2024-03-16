# ChatGPT helped fix this (hopefully)

import requests
import re

# Fetch the domains from the API
response = requests.get("https://piped-instances.kavin.rocks/")
domains = {instance["api_url"] for instance in response.json()}

# Define the URL of the index.js file in your GitHub repository
index_js_url = "https://raw.githubusercontent.com/danielytuk/browser-scripts/main/piped-video-enhancer/index.js"

# Fetch the content of the index.js file
response = requests.get(index_js_url)
script_content = response.text

# Perform the necessary modifications to the script content
updated_match_line = re.sub(
    r"(\/\/ @match\s+.+\n)",
    lambda match: f"{match.group(0)} {' *://'.join(domains)}/watch?v=*\n",
    script_content,
)

# Update the index.js file with the modified content
with open("index.js", "w") as file:
    file.write(updated_match_line)

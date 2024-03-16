import os
import requests
import re

# Use direct link to get index contents
index_js_url = "https://raw.githubusercontent.com/danielytuk/browser-scripts/main/piped-video-enhancer/index.js"

response = requests.get(index_js_url)
script_content = response.text

updated_match_line = re.sub(
    r"(\/\/ @match\s+.+\n)",
    lambda match: f"{match.group(0)} {' *://'.join(domains)}/watch?v=*\n",
    script_content,
)

# Update the index.js file with the modified content
with open("index.js", "w") as file:
    file.write(updated_match_line)

import os
import requests
import re

# Fetch the domains from the API
response = requests.get("https://piped-instances.kavin.rocks/")
domains = {instance["api_url"] for instance in response.json()}

# Define the path to the index.js file
script_path = os.path.join(os.getenv("GITHUB_WORKSPACE"), "piped-video-enhancer", "index.js")

# Read the content of the index.js file
with open(script_path, "r") as file:
    script_content = file.read()

# Perform the necessary modifications to the script content
updated_match_line = re.sub(
    r"(\/\/ @match\s+.+\n)",
    lambda match: f"{match.group(0)} {' *://'.join(domains)}/watch?v=*\n",
    script_content,
)

# Update the index.js file with the modified content
with open(script_path, "w") as file:
    file.write(updated_match_line)

print("Script content before modification:")
print(script_content)
print("\nScript content after modification:")
print(updated_match_line)

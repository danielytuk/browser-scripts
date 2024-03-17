import os
import requests
import re

def fetch_domains(api_urls):
    for url in api_urls:
        try:
            response = requests.get(url)
            response.raise_for_status()
            return [instance["api_url"] for instance in response.json()]
        except requests.RequestException as e:
            print(f"Failed to fetch data from {url}: {e}")
    return []

def update_script_match_lines(script_path, new_domains):
    try:
        updated_lines = []
        essential_lines = {
            "// @name",
            "// @description",
            "// @author",
            "// @version",
            "// @grant",
            "// @run-at",
            "// @icon"
        }
        found_user_script_end = False
        inserted_match_lines = False
        
        with open(script_path, "r") as source_file:
            for line in source_file:
                line_stripped = line.strip()
                if line_stripped.startswith("// ==/UserScript=="):
                    updated_lines.extend([f"// @match        {domain.rstrip('/')}/watch?v=*\n" for domain in new_domains])
                    updated_lines.append(line)
                    inserted_match_lines = True
                elif line_stripped.startswith("// @match"):
                    continue
                elif not found_user_script_end and line_stripped != "// ==/UserScript==":
                    if any(line_stripped.startswith(essential) for essential in essential_lines):
                        updated_lines.append(line)
                else:
                    found_user_script_end = True
                    updated_lines.append(line)
                    
        if not inserted_match_lines:
            updated_lines.extend([f"// @match        {domain.rstrip('/')}/watch?v=*\n" for domain in new_domains])
            updated_lines.append("// ==/UserScript==\n")
        
        with open(script_path, "w") as file:
            file.writelines(updated_lines)
    except Exception as e:
        print(f"An error occurred while updating match lines: {e}")

def increment_version(script_path):
    try:
        with open(script_path, "r") as file:
            script_content = file.read()

        version_match = re.search(r"\/\/ @version\s+(\d+\.\d+)", script_content)
        if version_match:
            current_version = version_match.group(1)
            major, minor = current_version.split(".")
            new_version = f"{major}.{int(minor) + 1}"

            updated_script_content = re.sub(r"\/\/ @version\s+\d+\.\d+", f"// @version      {new_version}", script_content)
            with open(script_path, "w") as file:
                file.write(updated_script_content)
    except Exception as e:
        print(f"An error occurred while updating version: {e}")

def main():
    primary_url = "https://piped-instances.kavin.rocks/"
    fallback_url = "https://worker-snowy-cake-fcf5.cueisdi.workers.dev/"
    domains = fetch_domains([primary_url, fallback_url])

    script_path = os.path.join(os.getenv("GITHUB_WORKSPACE"), "piped-video-enhancer", "index.js")
    update_script_match_lines(script_path, domains)
    increment_version(script_path)

if __name__ == "__main__":
    main()

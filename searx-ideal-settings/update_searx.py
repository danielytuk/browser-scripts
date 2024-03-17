import os
import requests
import re

def fetch_clearnet_domains():
    try:
        response = requests.get("https://github.com/libredirect/instances/raw/main/data.json")
        response.raise_for_status()
        data = response.json()
        clearnet_instances = data.get("searxng", {}).get("clearnet", [])
        return clearnet_instances
    except requests.RequestException as e:
        print(f"Failed to fetch data from GitHub: {e}")
        return []

def update_script_match_lines(script_path, domains):
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
        
        with open(script_path, "r") as source_file:
            for line in source_file:
                line_stripped = line.strip()
                if line_stripped.startswith("// ==UserScript=="):
                    updated_lines.append(line)
                    break
                
            for line in source_file:
                line_stripped = line.strip()
                if line_stripped.startswith("// ==/UserScript=="):
                    updated_lines.extend([f"// @match        {domain.rstrip('/')}/*&category_general=1&language=auto&time_range=&safesearch=0&theme=simple\n" for domain in domains])
                    updated_lines.append(line)
                    found_user_script_end = True
                    break
                elif not found_user_script_end:
                    if any(line_stripped.startswith(essential) for essential in essential_lines):
                        updated_lines.append(line)
                    
            for line in source_file:
                updated_lines.append(line)

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
    clearnet_domains = fetch_clearnet_domains()

    script_path = os.path.join(os.getenv("GITHUB_WORKSPACE"), "searx-ideal-settings", "index.js")
    update_script_match_lines(script_path, clearnet_domains)
    increment_version(script_path)

if __name__ == "__main__":
    main()

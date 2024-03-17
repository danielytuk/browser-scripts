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
        existing_match_lines_removed = False
        temp_file_path = os.path.join(os.getenv("GITHUB_WORKSPACE"), "temp_script.js")
        
        with open(script_path, "r") as source_file, open(temp_file_path, "w") as temp_file:
            for line in source_file:
                line_stripped = line.strip()
                if line_stripped.startswith("// @match"):
                    existing_match_lines_removed = True
                    continue
                if existing_match_lines_removed and not line_stripped:
                    updated_lines.extend([f"// @match        {domain.rstrip('/')}/watch?v=*\n" for domain in new_domains])
                    existing_match_lines_removed = False
                elif not existing_match_lines_removed:
                    updated_lines.append(line)
                    
            temp_file.writelines(updated_lines)

        os.replace(temp_file_path, script_path)
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

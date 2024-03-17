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

def follow_and_get_watch_urls(domains):
    watch_urls = []
    for domain in domains:
        try:
            response = requests.head(domain, allow_redirects=True)
            response.raise_for_status()
            final_url = response.url
            if not final_url.endswith('/watch?v=*'):
                final_url += '/watch?v=*'
            watch_urls.append(final_url)
        except requests.RequestException as e:
            print(f"Failed to follow redirect for {domain}: {e}")
    return watch_urls

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
        
        with open(script_path, "r") as source_file:
            for line in source_file:
                line_stripped = line.strip()
                if line_stripped.startswith("// ==UserScript=="):
                    updated_lines.append(line)
                    break
                
            for line in source_file:
                line_stripped = line.strip()
                if line_stripped.startswith("// ==/UserScript=="):
                    watch_urls = follow_and_get_watch_urls(new_domains)
                    updated_lines.extend([f"// @match        {watch_url}\n" for watch_url in watch_urls])
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
    primary_url = "https://worker-snowy-cake-fcf5.cueisdi.workers.dev/"
    fallback_url = "https://piped-instances.kavin.rocks/"
    domains = fetch_domains([primary_url, fallback_url])

    script_path = os.path.join(os.getenv("GITHUB_WORKSPACE"), "piped-video-enhancer", "index.js")
    update_script_match_lines(script_path, domains)
    increment_version(script_path)

if __name__ == "__main__":
    main()

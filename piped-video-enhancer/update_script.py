import os
import urllib.request
from urllib.parse import urlparse
from urllib.error import URLError, HTTPError
import json

MANUAL_DOMAINS = [
    "https://piped.privacydev.net/",
    # Add more manual domains here if needed
]

def fetch_domains(api_urls):
    domains = []
    for url in api_urls:
        try:
            with urllib.request.urlopen(url) as response:
                data = json.loads(response.read().decode("utf-8"))
                domains.extend(instance["api_url"] for instance in data)
                # If the primary URL is successfully accessed, exit the loop
                break
        except (URLError, HTTPError) as e:
            print(f"Failed to fetch data from {url}: {e}")
            if url == api_urls[-1]:  # If it's the last URL (fallback), raise an error
                raise RuntimeError("All URLs are unreachable")
    domains.extend(MANUAL_DOMAINS)
    return domains

def follow_and_get_watch_urls(domains):
    watch_urls = []
    for domain in domains:
        try:
            with urllib.request.urlopen(domain) as response:
                final_url = f"{response.url}/watch?v=*" if not response.url.endswith('/watch?v=*') else response.url
                watch_urls.append(final_url)
        except (URLError, HTTPError) as e:
            raise RuntimeError(f"Failed to follow redirect for {domain}: {e}")
    return watch_urls

def extract_base_domain(url):
    base_domain = f"{urlparse(url).scheme}://{urlparse(url).netloc}"
    if base_domain.startswith(("https://", "http://")):
        return base_domain.rstrip("/")
    raise ValueError("Invalid URL format. Must start with 'http://' or 'https://'")

def update_script_match_lines(script_path, new_domains):
    essential_lines = [
        "// @name",
        "// @description",
        "// @author",
        "// @version",
        "// @grant",
        "// @run-at",
        "// @icon"
    ]
    updated_lines = []
    user_script_started = user_script_ended = False
    watch_urls = follow_and_get_watch_urls(new_domains)  # Move this line here
    with open(script_path, "r+") as file:
        lines = file.readlines()
        for line in lines:
            if line.startswith("// ==UserScript=="):
                user_script_started = True
            elif line.startswith("// ==/UserScript=="):
                user_script_ended = True
                updated_lines.extend([f"// @match        {watch_url}\n" for watch_url in watch_urls])
                updated_lines.append(line)  # Add the closing UserScript line
            elif user_script_started and not user_script_ended:
                # Add back essential lines
                if any(line.startswith(essential) for essential in essential_lines):
                    updated_lines.append(line)
                # Add the updated match lines before the original UserScript closing line
                if line.startswith("// @icon"):
                    updated_lines.extend([f"// @match        {watch_url}\n" for watch_url in watch_urls])
        
        file.seek(0)
        file.writelines(lines[:2] + updated_lines + lines[len(updated_lines) + 2:])

def remove_duplicate_lines(script_path):
    unique_lines = set()
    with open(script_path, "r+") as file:
        lines = file.readlines()
        file.seek(0)
        file.truncate()
        for line in lines:
            if line not in unique_lines:
                file.write(line)
                unique_lines.add(line)

def increment_version(script_path):
    try:
        with open(script_path, "r+") as file:
            lines = file.readlines()
            for index, line in enumerate(lines):
                if line.startswith("// @version"):
                    major, minor = map(int, line.split()[-1].split("."))
                    new_version = f"{major}.{minor + 1}"
                    lines[index] = f"// @version      {new_version}\n"
            file.seek(0)
            file.writelines(lines)
            file.truncate()
    except Exception as e:
        raise RuntimeError(f"An error occurred while updating version: {e}")

def main():
    primary_url = "https://worker-snowy-cake-fcf5.cueisdi.workers.dev/"
    fallback_url = "https://piped-instances.kavin.rocks/"
    api_urls = [primary_url, fallback_url]
    try:
        script_path = os.path.join(os.getenv("GITHUB_WORKSPACE"), "piped-video-enhancer", "index.js")
        update_script_match_lines(script_path, fetch_domains(api_urls))
        increment_version(script_path)
        remove_duplicate_lines(script_path)
    except RuntimeError as e:
        print(e)

if __name__ == "__main__":
    main()

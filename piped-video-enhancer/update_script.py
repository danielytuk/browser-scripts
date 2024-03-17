import os
import requests

MANUAL_DOMAINS = [
    "https://piped.privacydev.net/",
    # Add more manual domains here if needed
]

def fetch_domains(api_urls):
    domains = []
    for url in api_urls:
        try:
            response = requests.get(url)
            response.raise_for_status()
            domains.extend(instance["api_url"] for instance in response.json())
        except requests.RequestException as e:
            raise RuntimeError(f"Failed to fetch data from {url}: {e}")
    domains.extend(MANUAL_DOMAINS)
    return domains

def follow_and_get_watch_urls(domains):
    watch_urls = []
    for domain in domains:
        try:
            response = requests.head(domain, allow_redirects=True)
            response.raise_for_status()
            final_url = f"{response.url}/watch?v=*" if not response.url.endswith('/watch?v=*') else response.url
            watch_urls.append(final_url)
        except requests.RequestException as e:
            raise RuntimeError(f"Failed to follow redirect for {domain}: {e}")
    return watch_urls

def update_script_match_lines(script_path, new_domains):
    essential_lines = {
        "// @name",
        "// @description",
        "// @author",
        "// @version",
        "// @grant",
        "// @run-at",
        "// @icon"
    }

    updated_lines = []
    user_script_started = False
    user_script_ended = False

    with open(script_path, "r+") as file:
        lines = file.readlines()
        for line in lines:
            if line.startswith("// ==UserScript=="):
                user_script_started = True
            elif line.startswith("// ==/UserScript=="):
                user_script_ended = True
                watch_urls = follow_and_get_watch_urls(new_domains)
                updated_lines.extend([f"// @match        {watch_url}\n" for watch_url in watch_urls])
            elif user_script_started and not user_script_ended:
                if any(line.startswith(essential) for essential in essential_lines):
                    updated_lines.append(line)
        
        file.seek(0)
        file.writelines(lines[:2] + updated_lines + lines[len(updated_lines) + 2:])

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
    except RuntimeError as e:
        print(e)

if __name__ == "__main__":
    main()

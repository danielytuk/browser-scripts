import os
from urllib.request import urlopen
from urllib.error import HTTPError
from urllib.parse import urlparse

MANUAL_DOMAINS = [
    "https://piped.privacydev.net/",
    # Add more manual domains here, in the exact format as above (http/s://domain.tld/)
]

def extract_base_domain(url):
    base_domain = f"{urlparse(url).scheme}://{urlparse(url).netloc}"
    if base_domain.startswith(("https://", "http://")):
        return base_domain.rstrip("/")
    raise ValueError("Invalid URL format. Must start with 'http://' or 'https://'")

def fetch_final_url(url):
    try:
        with urlopen(extract_base_domain(url)) as response:
            return response.url.rstrip("/")
    except (HTTPError, ValueError):
        return None

def fetch_domains(api_urls):
    final_urls = []
    for url in api_urls:
        final_url = fetch_final_url(url)
        if final_url:
            final_urls.append(final_url)
    return final_urls + MANUAL_DOMAINS

def follow_and_get_watch_urls(domains):
    return [f"{domain.rstrip('/')}/watch?v=*" for domain in domains]

def update_script_match_lines(script_path, new_domains):
    essential_lines = {"// @name", "// @description", "// @author", "// @version", "// @grant", "// @run-at", "// @icon"}
    updated_lines = set()
    user_script_started = user_script_ended = False

    with open(script_path, "r+") as file:
        lines = file.readlines()
        for line in lines:
            if line.startswith("// ==UserScript=="):
                user_script_started = True
            elif line.startswith("// ==/UserScript=="):
                user_script_ended = True
                updated_lines.update(f"// @match        {url}\n" for url in follow_and_get_watch_urls(new_domains))
            elif user_script_started and not user_script_ended and any(line.startswith(essential) for essential in essential_lines):
                updated_lines.add(line)
        
        file.seek(0)
        file.writelines(lines[:2] + list(updated_lines) + lines[len(updated_lines) + 2:])
        file.truncate()

def increment_version(script_path):
    try:
        with open(script_path, "r+") as file:
            lines = file.readlines()
            for index, line in enumerate(lines):
                if line.startswith("// @version"):
                    major, minor = map(int, line.split()[-1].split("."))
                    lines[index] = f"// @version      {major}.{minor + 1}\n"
            file.seek(0)
            file.writelines(lines)
            file.truncate()
    except Exception as e:
        print(f"An error occurred while updating version: {e}")

def main():
    api_urls = ["https://piped.privacydev.net", "https://piped-instances.kavin.rocks"]
    try:
        script_path = os.path.join(os.getenv("GITHUB_WORKSPACE"), "piped-video-enhancer", "index.js")
        domains = fetch_domains(api_urls)
        if domains:
            update_script_match_lines(script_path, domains)
            increment_version(script_path)
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()

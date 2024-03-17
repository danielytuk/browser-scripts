import os
import http.client
from urllib.parse import urlparse

MANUAL_DOMAINS = [
    "https://piped.privacydev.net/",
    # Add more manual domains here if needed
]

def extract_base_domain(url):
    parsed_url = urlparse(url)
    return f"{parsed_url.scheme}://{parsed_url.netloc}".rstrip("/")

def fetch_final_url(url):
    base_domain = extract_base_domain(url)
    try:
        with http.client.HTTPSConnection(base_domain) as connection:
            connection.request("HEAD", "/")
            response = connection.getresponse()
            final_url = response.getheader("Location") or url
            return final_url.rstrip("/")
    except Exception as e:
        raise RuntimeError(f"Failed to fetch data from {url}: {e}")

def fetch_domains(api_urls):
    return [fetch_final_url(url) for url in api_urls]

def follow_and_get_watch_urls(domains):
    return [f"{domain.rstrip('/')}/watch?v=*" for domain in domains]

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
                updated_lines.extend([f"// @match        {watch_url}\n" for watch_url in follow_and_get_watch_urls(new_domains)])
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
    primary_url = "https://piped.privacydev.net"
    fallback_url = "https://piped-instances.kavin.rocks"
    api_urls = [primary_url, fallback_url]
    try:
        script_path = os.path.join(os.getenv("GITHUB_WORKSPACE"), "piped-video-enhancer", "index.js")
        update_script_match_lines(script_path, fetch_domains(api_urls))
        increment_version(script_path)
    except RuntimeError as e:
        print(e)

if __name__ == "__main__":
    main()

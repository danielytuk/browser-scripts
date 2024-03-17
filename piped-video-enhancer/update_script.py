import os
import requests

def fetch_domains(api_url, fallback_url):
    try:
        response = requests.get(api_url)
        response.raise_for_status()
        return [instance["api_url"] for instance in response.json()]
    except requests.RequestException as e:
        print(f"Failed to fetch data from {api_url}: {e}")
        print(f"Trying fallback URL: {fallback_url}")

    try:
        response = requests.get(fallback_url)
        response.raise_for_status()
        return [instance["api_url"] for instance in response.json()]
    except requests.RequestException as e:
        print(f"Failed to fetch data from fallback URL {fallback_url}: {e}")
        return []

def update_script_match_lines(script_path, new_domains):
    try:
        updated_lines = []
        found_match_line = False
        with open(script_path, "r") as file:
            for line in file:
                line_stripped = line.strip()
                if line_stripped.startswith("// @match"):
                    found_match_line = True
                    updated_lines.append(line)
                elif found_match_line and not line_stripped:
                    updated_lines.extend([f"// @match        {domain.rstrip('/')}/watch?v=*\n" for domain in new_domains])
                    found_match_line = False
                else:
                    updated_lines.append(line)

        with open(script_path, "w") as file:
            file.writelines(updated_lines)
    except Exception as e:
        print(f"An error occurred while updating match lines: {e}")

def main():
    primary_url = "https://piped-instances.kavin.rocks/"
    fallback_url = "https://worker-snowy-cake-fcf5.cueisdi.workers.dev/"
    domains = fetch_domains(primary_url, fallback_url)

    script_path = os.path.join(os.getenv("GITHUB_WORKSPACE"), "piped-video-enhancer", "index.js")
    update_script_match_lines(script_path, domains)

if __name__ == "__main__":
    main()

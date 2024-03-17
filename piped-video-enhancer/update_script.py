import os
import requests

def fetch_domains(api_url, fallback_url):
    try:
        response = requests.get(api_url)
        response.raise_for_status()
        return [instance["api_url"] for instance in response.json()]
    except requests.RequestException as e:
        print(f"Failed to fetch data from {api_url}: {e}")
        print(f"Using fallback URL: {fallback_url}")
        try:
            response = requests.get(fallback_url)
            response.raise_for_status()
            return [instance["api_url"] for instance in response.json()]
        except requests.RequestException as e:
            print(f"Failed to fetch data from fallback URL {fallback_url}: {e}")
            return []

def update_script_match_lines(script_path, new_match_lines):
    try:
        existing_match_lines = set()
        with open(script_path, "r") as file:
            script_content = file.readlines()
            for line in script_content:
                if line.startswith("// @match"):
                    existing_match_lines.add(line.strip())

        with open(script_path, "w") as file:
            for line in script_content:
                if not any(match_line in line for match_line in new_match_lines):
                    file.write(line)
            for match_line in new_match_lines:
                if match_line.strip() not in existing_match_lines:
                    file.write(match_line)
    except Exception as e:
        print(f"An error occurred while updating match lines: {e}")

def main():
    primary_url = "https://piped-instances.kavin.rocks/"
    fallback_url = "https://worker-snowy-cake-fcf5.cueisdi.workers.dev/"
    domains = fetch_domains(primary_url, fallback_url)

    script_path = os.path.join(os.getenv("GITHUB_WORKSPACE"), "piped-video-enhancer", "index.js")
    new_match_lines = [f"// @match {domain.rstrip('/')}/watch?v=*\n" for domain in domains]
    update_script_match_lines(script_path, new_match_lines)

if __name__ == "__main__":
    main()

import os
import json
import time
import random
import string
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

MANUAL_DOMAINS = [
    "https://piped.privacydev.net/",
    # Add more manual domains here if needed
]

def fetch_domains(api_urls, max_retries=3):
    domains = []
    for url in api_urls:
        retries = 0
        while retries < max_retries:
            try:
                headers = {"User-Agent": "Mozilla/5.0"}
                req = Request(url, headers=headers)
                with urlopen(req) as response:
                    data = json.loads(response.read().decode("utf-8"))
                    domains.extend(entry["api_url"] for entry in data)
                    break
            except (URLError, HTTPError) as e:
                print(f"Failed to fetch data from {url}: {e}")
                retries += 1
                if retries == max_retries:
                    print(f"Reached max retries for {url}.")
                    break
                time.sleep(random.uniform(1, 3))
        else:
            raise RuntimeError(f"All retries failed for {url}")

    domains.extend(MANUAL_DOMAINS)
    return domains

def follow_and_get_watch_urls(domains):
    watch_urls = []
    for domain in domains:
        try:
            with urlopen(domain) as response:
                final_url = f"{response.url}/watch?v=*" if not response.url.endswith('/watch?v=*') else response.url
                watch_urls.append(final_url)
        except (URLError, HTTPError) as e:
            raise RuntimeError(f"Failed to fetch watch URLs for {domain}: {e}")
    return watch_urls

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
    watch_urls = follow_and_get_watch_urls(new_domains)
    with open(script_path, "r+") as file:
        lines = file.readlines()
        for line in lines:
            if line.startswith("// ==UserScript=="):
                user_script_started = True
            elif line.startswith("// ==/UserScript=="):
                user_script_ended = True
                updated_lines.extend([f"// @match        {watch_url}\n" for watch_url in watch_urls])
                updated_lines.append(line)
            elif user_script_started and not user_script_ended:
                if any(line.startswith(essential) for essential in essential_lines):
                    updated_lines.append(line)
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

def generate_random_string(length):
    letters_and_digits = string.ascii_letters + string.digits
    return ''.join(random.choice(letters_and_digits) for i in range(length))

def pretend_to_be_real_person():
    first_names = ["John", "Emma", "Michael", "Sophia", "David", "Olivia", "James", "Ava"]
    last_names = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson"]
    email_providers = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"]
    first_name = random.choice(first_names)
    last_name = random.choice(last_names)
    email_provider = random.choice(email_providers)
    email = f"{first_name.lower()}.{last_name.lower()}@{email_provider}"
    password = generate_random_string(10)
    return first_name, last_name, email, password

def main():
    primary_url = "https://worker-snowy-cake-fcf5.cueisdi.workers.dev/"
    secondary_url = "https://piped-instances.kavin.rocks/"
    api_urls = [primary_url, secondary_url]

    try:
        script_path = os.path.join(os.getenv("GITHUB_WORKSPACE"), "piped-video-enhancer", "index.js")
        update_script_match_lines(script_path, fetch_domains(api_urls))
        increment_version(script_path)
        remove_duplicate_lines(script_path)
        first_name, last_name, email, password = pretend_to_be_real_person()
        print(f"Hello, I'm {first_name} {last_name}. My email is {email} and my password is {password}.")
    except RuntimeError as e:
        print(e)

if __name__ == "__main__":
    main()

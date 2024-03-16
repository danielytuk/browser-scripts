import os
import re

def extract_metadata(index_file):
    metadata = {}
    try:
        with open(index_file, 'r', encoding='utf-8') as f:
            content = f.read()
            matches = re.findall(r'\/\/ @(\w+)\s+(.+)', content)
            for match in matches:
                metadata[match[0]] = match[1]
    except Exception as e:
        print(f"Error extracting metadata from {index_file}: {e}")
    return metadata

def generate_root_readme(root_directory, username):
    script_list = []
    try:
        for entry in os.listdir(root_directory):
            entry_path = os.path.join(root_directory, entry)
            if os.path.isdir(entry_path):
                script_url = f'https://github.com/{username}/browser-scripts/{entry}'
                script_list.append((entry, script_url))

        with open(os.path.join(root_directory, 'README.md'), 'w', encoding='utf-8') as readme:
            readme.write('# Browser Scripts\n\n')
            readme.write('This repository contains various browser scripts.\n\n')
            readme.write('## Scripts\n\n')
            for script_name, script_url in script_list:
                readme.write(f'- [{script_name}]({script_url})\n')
    except Exception as e:
        print(f"Error generating root readme: {e}")

def generate_script_readme(script_directory, username):
    try:
        index_file = os.path.join(script_directory, 'index.js')
        if not os.path.exists(index_file):
            return

        metadata = extract_metadata(index_file)
        script_name = metadata.get('name', os.path.basename(script_directory))
        description = metadata.get('description', 'Description of the script...')
        script_url = f'https://github.com/{username}/browser-scripts/raw/main/{script_directory}/index.js'

        with open(os.path.join(script_directory, 'README.md'), 'w', encoding='utf-8') as readme:
            readme.write(f'# {script_name}\n\n')
            readme.write(f'{description}\n\n')
            readme.write('## Install\n\n')
            readme.write('To use this script, you need to install one of the following browser extensions:\n\n')
            readme.write('- [Greasemonkey](https://www.greasespot.net/) **(firefox only)*\n')
            readme.write('- [Tampermonkey](https://www.tampermonkey.net/)\n')
            readme.write('- [Violentmonkey](https://violentmonkey.github.io/)\n\n')
            readme.write(f'After installing the extension, you can install the script by clicking the following link:\n\n')
            readme.write(f'- [Install {script_name}]({script_url})\n')
    except Exception as e:
        print(f"Error generating script readme for {script_directory}: {e}")

def main():
    try:
        root_directory = '.'
        username = 'danielytuk'
        for entry in os.listdir(root_directory):
            entry_path = os.path.join(root_directory, entry)
            if os.path.isdir(entry_path):
                if entry == '.github':
                    continue
                generate_script_readme(entry_path, username)
        generate_root_readme(root_directory, username)
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    main()

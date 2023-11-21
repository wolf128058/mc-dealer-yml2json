#!/bin/bash

#!/bin/bash

# GitHub Repository URL
repo_url="https://api.github.com/repos/Joshcraft2002/joshs-more-foods/contents/media"

# API call to get the list of files
files=$(curl -s $repo_url | grep -Eo '"download_url": "[^"]+"' | awk -F'"' '{print $4}')

# Downloading the files
for file_url in $files; do
    echo "Downloading: $file_url"
    curl -LOk $file_url
done

echo "Download completed!"

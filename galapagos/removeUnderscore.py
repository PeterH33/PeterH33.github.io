"""
Simple script for removing the underscores at the begining of photo names.
Underscores cause a 404 issue on github pages, and there is no way to remove the default naming convention

Author: Peter Hartnett
"""
import os

path = '/Users/peterhartnett/Code/Website/PeterH33.github.io/galapagos/photos'

for filename in os.listdir(path):
    if filename.startswith('_'):
        newName = filename[1:]
        oldFile = os.path.join(path, filename)
        newFile = os.path.join(path, newName)

        os.rename(oldFile, newFile)
        print(f'Renamed: {filename} -> {newName}')
# Winget-export-to-bat
 Generate a bat file to reinstall all programs with winget list
## Usage

```bash
node run.js
```
or
```bash
python run.py
```
Run install.bat as administrator

## Generates

- install.bat - Install all programs
- unknown.txt - All unavailable packages


### Dev

To Package the python script use pyinstaller

```bash
pyinstaller -F yourprogram.py
```

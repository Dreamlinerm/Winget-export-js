import os
import subprocess
import json

file_name = "List.json"
output_file = os.path.join(os.path.dirname(__file__), file_name)

# Execute the winget export command
result = subprocess.run(
    ["winget", "export", output_file], capture_output=True, text=True
)

if result.returncode != 0:
    print(result.stderr)
else:
    # Write to unknown.txt
    with open(
        os.path.join(os.path.dirname(__file__), "unknown.txt"), "w"
    ) as unknown_file:
        unknown_file.write(
            "\n".join(
                [
                    line.split(": ")[1]
                    for line in result.stdout.split("\n")
                    if ": " in line
                ]
            )
        )

    # Read List.json
    with open(output_file, "r", encoding="utf-8") as list_file:
        data = json.load(list_file)
        packages = [
            f"winget install -s winget -e --id --force {package['PackageIdentifier']}"
            for package in data["Sources"][0]["Packages"]
        ]

    # Write packages to install.bat
    with open(
        os.path.join(os.path.dirname(__file__), "install.bat"), "w"
    ) as install_file:
        install_file.write("@echo off\n\n" + "\n".join(packages))

    # Delete List.json
    os.remove(output_file)

    print("\n\nPackages unavailable through winget")
    print(
        "\n".join(
            [line.split(": ")[1] for line in result.stdout.split("\n") if ": " in line]
        )
    )

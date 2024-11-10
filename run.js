// read file List.txt

const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
// execute command winget list > List.txt
exec("winget list > List.txt", (err, stdout, stderr) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("List.txt created");
  // read file List.txt
  fs.readFile(path.join(__dirname, "List.txt"), "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("List.txt read");
    // split data by newline
    let lines = data.split("\n");
    // remove all lines until ---------
    while (!lines[0].includes("----")) {
      lines.shift();
    }
    lines.shift();
    // remove empty lines
    lines = lines.filter((line) => line.trim() !== "");
    let packages = [];
    let UnknownPackages = [];
    console.log("Unknown Packages:");
    for (let line of lines) {
      if (line.includes("Unknown")) {
        UnknownPackages.push(line);
        continue;
      }
      if (line.includes("Microsoft")) continue;
      line = line.replace(/.*( \D+\.\D+).*/g, "$1").replace(/  .*/g, "");
      if (line.substring(0, 1) == " ") line = line.substring(1, line.length);
      packages.push(line);
    }
    // write UnknownPackages to UnknownPackages.txt
    fs.writeFile(
      path.join(__dirname, "Unkown.txt"),
      UnknownPackages.join("\n"),
      (err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Unkown.txt created");
      }
    );

    // create install.bat
    // const install = packages;
    const install = packages.map(
      (package) => "winget install " + package.substring(0, package.length - 1)
    );
    fs.writeFile(
      path.join(__dirname, "install.bat"),
      "@echo off\n\n" + install.join("\n"),
      (err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("install.bat created");
      }
    );
  });
});

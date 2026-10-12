const path = require("path");
const fs = require("fs").promises;

async function add(filePath) {
  const repoPath = path.resolve(process.cwd(), ".myGit");
  const stagingPath = path.join(repoPath, "staging");

  try {
    // Make sure the file actually exists before staging it
    await fs.access(filePath);

    await fs.mkdir(stagingPath, { recursive: true });

    const fileName = path.basename(filePath);
    await fs.copyFile(filePath, path.join(stagingPath, fileName));

    console.log(`File ${fileName} added to staging area!`);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error(`Cannot add "${filePath}": file not found.`);
    } else {
      console.error("Error adding file:", err);
    }
  }
}

module.exports = { add };
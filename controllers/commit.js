const path = require("path");
const fs = require("fs").promises;
const { v4: uuidv4 } = require("uuid");

async function commit(message) {
  const repoPath = path.resolve(process.cwd(), ".myGit");
  const stagedPath = path.join(repoPath, "staging");
  const commitPath = path.join(repoPath, "commits");

  try {
    // Nothing to commit if staging is missing or empty
    let files = [];
    try {
      files = await fs.readdir(stagedPath);
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
    }

    if (files.length === 0) {
      console.log("Nothing to commit. Use `add <file>` first.");
      return;
    }

    const commitID = uuidv4();
    const commitDir = path.join(commitPath, commitID);
    await fs.mkdir(commitDir, { recursive: true });

    for (const file of files) {
      await fs.copyFile(
        path.join(stagedPath, file),
        path.join(commitDir, file)
      );
    }

    await fs.writeFile(
      path.join(commitDir, "commit.json"),
      JSON.stringify({ message, date: new Date().toISOString() }, null, 2)
    );

    console.log(`Commit ${commitID} created with message: ${message}`);
  } catch (err) {
    console.error("Error creating commit:", err);
  }
}

module.exports = { commit };
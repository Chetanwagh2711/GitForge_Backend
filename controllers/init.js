const fs = require("fs").promises;
const path = require("path");

async function init() {
  const repoPath = path.resolve(process.cwd(), ".myGit");
  const commitsPath = path.join(repoPath, "commits");
  const stagingPath = path.join(repoPath, "staging");
  const configPath = path.join(repoPath, "config.json");

  try {
    await fs.mkdir(repoPath, { recursive: true });
    await fs.mkdir(commitsPath, { recursive: true });
    await fs.mkdir(stagingPath, { recursive: true });

    await fs.writeFile(
      configPath,
      JSON.stringify({ bucket: process.env.AWS_BUCKET_NAME }, null, 2)
    );

    console.log("Repository initialised successfully");
  } catch (err) {
    console.error("Error initialising repository:", err);
  }
}

module.exports = { init };
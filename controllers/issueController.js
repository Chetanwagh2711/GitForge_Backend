const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const Issue = require("../models/issueModel");

// POST /issue/create   body: { title, description, repository }
async function createIssue(req, res) {
  const { title, description, repository } = req.body;

  try {
    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required!" });
    }

    if (!mongoose.Types.ObjectId.isValid(repository)) {
      return res.status(400).json({ error: "Invalid repository ID!" });
    }

    const repo = await Repository.findById(repository);
    if (!repo) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    const issue = new Issue({ title, description, repository });
    await issue.save();

    // Link the issue back to its repository
    repo.issues.push(issue._id);
    await repo.save();

    res.status(201).json(issue);
  } catch (err) {
    console.error("Error during issue creation : ", err.message);
    res.status(500).send("Server error");
  }
}

// PUT /issue/update/:id   body: { title?, description?, status? }
async function updateIssueById(req, res) {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid issue ID!" });
    }

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    // Only change the fields that were actually sent
    if (title !== undefined) issue.title = title;
    if (description !== undefined) issue.description = description;
    if (status !== undefined) issue.status = status;

    await issue.save();

    res.json({ message: "Issue updated", issue });
  } catch (err) {
    console.error("Error during issue update : ", err.message);
    res.status(500).send("Server error");
  }
}

// DELETE /issue/delete/:id
async function deleteIssueById(req, res) {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid issue ID!" });
    }

    const issue = await Issue.findByIdAndDelete(id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    // Remove the reference from the repository
    await Repository.findByIdAndUpdate(issue.repository, {
      $pull: { issues: issue._id },
    });

    res.json({ message: "Issue deleted" });
  } catch (err) {
    console.error("Error during issue deletion : ", err.message);
    res.status(500).send("Server error");
  }
}

// GET /issue/all   -> every issue
async function getAllIssues(req, res) {
  try {
    const issues = await Issue.find({});
    res.status(200).json(issues);
  } catch (err) {
    console.error("Error during issue fetching : ", err.message);
    res.status(500).send("Server error");
  }
}

// GET /issue/repo/:id   -> issues of one repository
async function getIssuesByRepo(req, res) {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid repository ID!" });
    }

    const issues = await Issue.find({ repository: id });
    res.status(200).json(issues);
  } catch (err) {
    console.error("Error during issue fetching : ", err.message);
    res.status(500).send("Server error");
  }
}

// GET /issue/:id
async function getIssueById(req, res) {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid issue ID!" });
    }

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    res.json(issue);
  } catch (err) {
    console.error("Error during issue fetching : ", err.message);
    res.status(500).send("Server error");
  }
}

module.exports = {
  createIssue,
  updateIssueById,
  deleteIssueById,
  getAllIssues,
  getIssuesByRepo,
  getIssueById,
};
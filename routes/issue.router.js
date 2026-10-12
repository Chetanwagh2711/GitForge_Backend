const express = require("express");
const issueController = require("../controllers/issueController");
const authMiddleware = require("../middleware/authMiddleware");

const issueRouter = express.Router();

issueRouter.post("/issue/create", authMiddleware, issueController.createIssue);
issueRouter.put("/issue/update/:id", authMiddleware, issueController.updateIssueById);
issueRouter.delete("/issue/delete/:id", authMiddleware, issueController.deleteIssueById);
issueRouter.get("/issue/all", authMiddleware, issueController.getAllIssues);
issueRouter.get("/issue/repo/:id", authMiddleware, issueController.getIssuesByRepo);
issueRouter.get("/issue/:id", authMiddleware, issueController.getIssueById); // keep last

module.exports = issueRouter;
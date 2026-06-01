const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
require("dotenv").config();
const authMiddleware = require("./authenticationMiddleware");

const app = express();
const port = process.env.PORT || 3000;

const Board = require("./models/Board");
const Organization = require("./models/Organization");
const User = require("./models/User");
const Issue = require("./models/Issue");
const { 
  validateRequest, 
  signupSchema, 
  loginSchema, 
  createorgSchema, 
  addMemberSchema, 
  addBoardSchema, 
  addIssueSchema 
} = require("./validators");

app.use(express.json());

const mongoUri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/trello-clone";
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is required in environment variables");
}

app.post("/signup", validateRequest(signupSchema), async (req, res) => {
  try {
    const { username, password } = req.body;
    const normalizedUsername = username.toLowerCase();
    const existingUser = await User.findOne({ username: normalizedUsername });
    if (existingUser) {
      return res.status(409).json({ err: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: normalizedUsername,
      password: hashedPassword,
    });
    await newUser.save();

    return res.status(201).json({ message: "account created successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ err: "Failed to create account", details: err.message });
  }
});

app.post("/login", validateRequest(loginSchema), async (req, res) => {
  try {
    const { username, password } = req.body;
    const normalizedUsername = username.toLowerCase().trim();
    const user = await User.findOne({ username: normalizedUsername });
    if (!user) {
      return res.status(401).json({ err: "username or password is wrong" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ err: "username or password is wrong" });
    }

    const token = jwt.sign(
      { UserId: user._id.toString() },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ err: "Login failed", details: err.message });
  }
});

app.post("/organization",authMiddleware, validateRequest(createorgSchema),  async (req, res) => {
  const { title, description } = req.body;
  const UserId = req.UserId;

  const NewOrg = new Organization({
    title,
    description,
    admin: UserId,
    members: [],
  });

  await NewOrg.save();
  res.json({
    mssg: "New Org is created",
    organizationId: NewOrg._id,
  });
});

app.post("/add-member",authMiddleware, validateRequest(addMemberSchema), async (req, res) => {
  try {
    const { organizationId, memberUserName } = req.body;
    const UserId = req.UserId;
    const organization = await Organization.findOne({
      _id: organizationId,
      admin: UserId,
    });
    if (!organization) {
      return res
        .status(404)
        .json({ mssg: "no org found or you are not admin" });
    }

    const member = await User.findOne({
      username: memberUserName.toLowerCase().trim(),
    });
    if (!member) {
      return res.status(404).json({ mssg: "no member found" });
    }

    organization.members.addToSet(member._id);
    await organization.save();

    return res.json({ mssg: "the member is added" });
  } catch (err) {
    return res
      .status(500)
      .json({ err: "Failed to add member", details: err.message });
  }
});

app.get("/organization", authMiddleware, async (req, res) => {
  try {
    const organizationId = req.query.organizationId;
    const UserId = req.UserId;

    if (!organizationId) {
      return res.status(400).json({ mssg: "organizationId query is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(organizationId)) {
      return res.status(400).json({ mssg: "invalid organizationId" });
    }

    const org = await Organization.findOne({
      _id: organizationId,
      admin: UserId,
    })
      .populate("members", "username")
      .lean();

    if (!org) {
      return res.status(404).json({
        mssg: "there is no org present or logged in user is not admin",
      });
    }

    return res.json({ organization: org });
  } catch (err) {
    return res
      .status(500)
      .json({ err: "Failed to fetch organization", details: err.message });
  }
});

app.post("/board",authMiddleware, validateRequest(addBoardSchema),  async (req, res) => {
  try {
    const { title, organizationId } = req.body;
    const UserId = req.UserId;

    const organization = await Organization.findOne({
      _id: organizationId,
      admin: UserId,
    });
    if (!organization) {
      return res
        .status(404)
        .json({ mssg: "no organization is present or you are not admin" });
    }

    const board = new Board({
      title,
      organization: organizationId,
    });
    await board.save();

    return res.status(201).json({
      mssg: "board is created",
      boardId: board._id,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ err: "Failed to create board", details: err.message });
  }
});

app.post("/issue",authMiddleware, validateRequest(addIssueSchema), async (req, res) => {
  try {
    const { title, description, boardId } = req.body;
    const UserId = req.UserId;

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ mssg: "no board exist" });
    }

    const issue = new Issue({
      title,
      description,
      board: boardId,
    });

    await issue.save();
    return res.status(201).json({ mssg: "issue created", issueId: issue._id });
  } catch (error) {
    return res
      .status(500)
      .json({ err: "Failed to create issue", details: error.message });
  }
});

app.get('/issues', authMiddleware, async(req,res)=>{
  try{
    const boardId = req.query.boardId;
    const UserId = req.UserId;
    if (!boardId) {
      return res.status(400).json({ mssg: "boardId query is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({ mssg: "invalid boardId" });
    }
    const issue = await Issue.find({board: boardId});
    return res.json({issue});
  }
  catch(error){
    res.json({mssg: "failed to get issues"});
  }
})

async function startServer() {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    app.listen(port, () => {
      console.log(`server is running on port ${port}`);
    });
  } catch (err) {
    console.error("Could not connect to MongoDB", err);
    process.exit(1);
  }
}

startServer();

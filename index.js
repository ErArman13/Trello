const express = require('express');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./authenticationMiddleware');
const app = express();
const port =  3000;
app.use(express.json());

//databases
let USERS_ID = 1;
let ORGANIZATION_ID = 1;
let BOARD_ID = 1;
let ISSUES_ID = 1;

const USERS = [];
const ORGANIZATIONS = [];
const BOARDS = [];
const ISSUES = [];

app.post('/signup', (req, res)=>{
    const {username, password} = req.body;
    if(!username || !password){
        return res.json({message: "username and pass required"});
    }
    const userExist = USERS.find(u=> u.username===username);
    if(userExist){
        return res.json({err: "Username exist"});
    }
    USERS.push({
        id: USERS_ID++,
        username,
        password
    })
    res.json({message: "account created succesfully"});
})
app.post('/login', (req, res)=>{
    const{username , password} = req.body;
    const User = USERS.find(u => u.username===username && u.password ===password);
    if(!User){
        return res.json({err: "username or pass is wrong"});
    }
    const token = jwt.sign({UserId: User.id}, "this is a safe key");
    res.json({token});
})
app.post('/organization',authMiddleware, (req, res)=>{
    const {title, description} = req.body;
    const UserId = req.UserId;
    const NewOrg = {
        id: ORGANIZATION_ID++,
        title,
        description,
        admin: UserId,
        member: []
    };
    ORGANIZATIONS.push(NewOrg);
    res.json({
        mssg: "New Org is created",
        organizationId: NewOrg.id
    });
})

app.post('/add-member', authMiddleware, (req,res)=>{
    const {organizationId, memberUserName} = req.body;
    const organization = ORGANIZATIONS.find(u => u.id===organizationId);
    if(!organization){
        return res.status(400).json({mssg: "no org found"});
    }
    const member = USERS.find(user => user.username===username);
    if(!member){
        return res.status(400).json({mssg: "no member found"});
    }
    organization.member.push(member.id);
})

app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
});

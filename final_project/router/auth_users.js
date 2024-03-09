const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  let checkUser = users.filter((user)=>{
    return user.username === username
  });
  if(checkUser.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ 
  let verifUser = users.filter((user)=>{
    console.log("Checking authentication for:",username,password)
    return (user.username === username && user.password === password)
  });
  if(verifUser.length > 0){
    return true;
  } else {
    return false;
  }
}
// Registration route
regd_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Invalid registration data" });
    }
  
    // Check if the username is already taken
    if (isValid(username)) {
      return res.status(400).json({ message: "Username already taken" });
    }
  
    // Add the new user to the array
    users.push({ username, password });
  
    return res.status(201).json({ message: "User successfully registered" });
  });
//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 100 * 100 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(400).json({message: "Invalid Login. Check username and password"});
  }
});

//add Book reviews
regd_users.post("/auth/review/:title/", (req, res) => {
    const title = decodeURIComponent(req.params.title);
    const review = req.body.review;
    let user = users.find(user => user.password === req.user.data);
  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  
    // Initialize reviews property if it doesn't exist
    if (!books[title].reviews) {
      books[title].reviews = {};
    }
  
    books[title].reviews[user.username] = review;
    return res.status(200).json({ message: `The review for the title ${title} has been added/updated` });
  });
  
  //delete book
  regd_users.delete("/auth/deletereview/isbn/", (req, res) => {
    const title = req.params.title;
    let user = users.find(user => user.password === req.user.data);
  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  
    delete books[title].reviews[user.username];
    return res.status(200).json({ message: `The review for the title ${title} has been deleted` });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

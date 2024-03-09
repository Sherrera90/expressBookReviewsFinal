const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const bookList = books;
  return res.status(200).json(bookList);
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const booked = books[isbn]; 
  return res.status(200).json({booked});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorname = req.params.author;
  let booked;
  for (const key in books) {
    if(books[key].author == authorname){
      booked = books[key];
    };
  }
  return res.status(300).json({booked});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let booked;
  for (const key in books) {
    if(books[key].title == title){
      booked = books[key];
    };
  }
  return res.status(200).json({booked});
});

//  Get book review
public_users.get('/review/:title',function (req, res) {
  const title = decodeURIComponent(req.params.title);
  const review = books[title].reviews || {}; 
  return res.status(200).json({review});
});


/****GET ALL BOOKS USING ASYNC CALLBACK***/
/*public_users.get('/', async function (req, res) {
  try {
    const bookList = await getBookList();
    return res.status(200).json(bookList);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function getBookList() {
  return new Promise((resolve, reject) => {
    
    const bookList = books;
   
    setTimeout(() => {
      resolve(bookList);
    }, 2000); 
  });
}*/


/* Get Book by isbn using promise */
/*public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  getBookDetails(isbn)
    .then((bookDetails) => {
      return res.status(200).json({ booked: bookDetails });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    });
});

function getBookDetails(isbn) {
  return new Promise((resolve, reject) => {
    // Assuming 'books' is an object where ISBN is the key and book details is the value
    const booked = books[isbn];
    if (booked) {
      resolve(booked);
    } else {
      reject(new Error('Book details not found'));
    }
  });
}*/




module.exports.general = public_users;

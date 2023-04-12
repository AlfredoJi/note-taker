//importing the needed packages
const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
//Importing a built in node package called "path"
const path = require('path');
//importing a helper file that will help append our new notes
const { readAndAppend, writeToFile, readFromFile } = require('./helpers/fsUtils');

//Grabbing an instance of express.js
const app = express();

//Specify the port that will run the express.js server
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Middleware pointing to the public folder
app.use(express.static('public'));

//Creating a route for the notes.html file
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);


app.get('/api/notes', (req, res) => {
  const dbJson = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  res.json(dbJson);
});

//Creating a route for the index.html file
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

//This post route grabs the user input and puts them into the note title and text
app.post('/api/notes', (req, res) => {

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      note_id: uuidv4(),
    };

    //Using the function in the helper file to read and append the new note
    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully`);
  } else {
    res.error('Error in adding note');
  }
});

//listen method that is listening for the connections on the port
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
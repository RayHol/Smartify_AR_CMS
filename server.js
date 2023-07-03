const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const app = express();

// Set up database connection
mongoose.connect('mongodb://localhost/cms', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to the database');
});

// Set up multer for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Define a schema for the uploaded content
const contentSchema = new mongoose.Schema({
  name: String,
  file: String,
});
const Content = mongoose.model('Content', contentSchema);

// Define an endpoint for handling file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  const { name } = req.body;
  const { filename } = req.file;

  // Save the uploaded content to the database
  const content = new Content({
    name,
    file: filename,
  });
  content.save((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Failed to save content');
    } else {
      res.status(200).send('Content uploaded successfully');
    }
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


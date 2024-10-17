const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

app.use(express.static('public'));  // Serves frontend files

const API_BASE = "https://www.1secmail.com/api/v1/";

// Route to generate a random email
app.get('/generate-email', async (req, res) => {
  const response = await fetch(`${API_BASE}?action=genRandomMailbox&count=1`);
  const email = await response.json();
  res.json(email[0]);
});

// Route to check inbox for the generated email
app.get('/check-inbox', async (req, res) => {
  const { login, domain } = req.query;
  const inboxResponse = await fetch(`${API_BASE}?action=getMessages&login=${login}&domain=${domain}`);
  const inbox = await inboxResponse.json();
  res.json(inbox);
});

// Route to read a specific message by its ID
app.get('/read-message', async (req, res) => {
  const { login, domain, id } = req.query;
  const messageResponse = await fetch(`${API_BASE}?action=readMessage&login=${login}&domain=${domain}&id=${id}`);
  const message = await messageResponse.json();
  res.json(message);
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

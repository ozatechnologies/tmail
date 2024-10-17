document.getElementById('generateEmail').addEventListener('click', async () => {
  const emailDisplay = document.getElementById('emailDisplay');
  const inboxDiv = document.getElementById('inbox');
  
  // Generate a random email address
  const response = await fetch('/generate-email');
  const email = await response.json();
  emailDisplay.innerText = `Your temp email: ${email}`;
  
  const [login, domain] = email.split('@');

  // Check inbox every 5 seconds for new messages
  setInterval(async () => {
    const inboxResponse = await fetch(`/check-inbox?login=${login}&domain=${domain}`);
    const messages = await inboxResponse.json();
    
    inboxDiv.innerHTML = '';
    
    if (messages.length === 0) {
      inboxDiv.innerText = 'No new emails yet.';
    } else {
      messages.forEach((message) => {
        const messageDiv = document.createElement('div');
        messageDiv.innerHTML = `
          <strong>From:</strong> ${message.from} <br>
          <strong>Subject:</strong> ${message.subject} <br>
          <button onclick="readMessage(${message.id})">Read</button>`;
        inboxDiv.appendChild(messageDiv);
      });
    }
  }, 5000);
});

// Function to read an email message
async function readMessage(id) {
  const emailDisplay = document.getElementById('emailDisplay').innerText;
  const [login, domain] = emailDisplay.replace('Your temp email: ', '').split('@');

  const messageResponse = await fetch(`/read-message?login=${login}&domain=${domain}&id=${id}`);
  const message = await messageResponse.json();

  alert(`From: ${message.from}\nSubject: ${message.subject}\n\n${message.textBody}`);
}

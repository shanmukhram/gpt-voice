const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const apiKey = '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';

const openai = new OpenAIApi(
  new Configuration({
    apiKey: apiKey
  })
);

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint works' });
});

app.post('/get-bot-response', async (req, res) => {
  const userInput = req.body.prompt;
  const resAI = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: userInput }]
  });

  res.json({ botResponse: resAI.data.choices[0].message.content });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});









// require('dotenv').config();
// console.log(process.env.API_KEY);



// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const { Configuration, OpenAIApi } = require('openai');

// dotenv.config();

// const openai = new OpenAIApi(
//   new Configuration({
//     apiKey: process.env.API_KEY
//   })
// );

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// app.get('/test', (req, res) => {
//   res.json({ message: 'Test endpoint works' });
// });

// app.post('/get-bot-response', async (req, res) => {
//   const userInput = req.body.prompt;
//   const resAI = await openai.createChatCompletion({
//     model: "gpt-3.5-turbo",
//     messages: [{ role: "user", content: userInput }]
//   });

//   res.json({ botResponse: resAI.data.choices[0].message.content });
// });

// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });



// require('dotenv').config();
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const { Configuration, OpenAIApi } = require('openai');
// const WebSocket = require('ws'); // Import the WebSocket package

// dotenv.config();

// const openai = new OpenAIApi(
//   new Configuration({
//     apiKey: process.env.API_KEY
//   })
// );

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// app.get('/test', (req, res) => {
//   res.json({ message: 'Test endpoint works' });
// });

// app.post('/get-bot-response', async (req, res) => {
//   const userInput = req.body.prompt;
//   const resAI = await openai.createChatCompletion({
//     model: "gpt-3.5-turbo",
//     messages: [{ role: "user", content: userInput }]
//   });

//   const botResponse = resAI.data.choices[0].message.content;
  
//   // Send the response to all connected WebSocket clients
//   wss.clients.forEach(client => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(botResponse);
//     }
//   });

//   res.json({ botResponse: botResponse });
// });

// // Setup WebSocket server
// const wss = new WebSocket.Server({ port: 8080 });

// wss.on('connection', ws => {
//   ws.on('message', message => {
//     console.log('Received:', message);
//   });

//   ws.send('WebSocket connection established');
// });

// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });

let typingController = new AbortController();
let chatLogs = { 'chat-session-0': [] };
let activeSession = 'chat-session-0';
let recognition;

const XI_API_KEY = '6773c0ce680b00f47eea6c0d26cb9013'; // 
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // 

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

window.onload = function () {
  document.getElementById('new-chat').addEventListener('click', function () {
    createNewChatSession();
  });

  document.getElementById('submit-btn').addEventListener('click', function () {
    handleUserMessage();
  });

  document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      handleUserMessage();
      document.getElementById('user-input').value = '';
    }
  });

  document.getElementById('delete-chat').addEventListener('click', function () {
    deleteChatSession();
  });

  recognition = new SpeechRecognition();
  recognition.interimResults = true;

  recognition.addEventListener('result', (e) => {
    if (document.getElementById('mic-btn').classList.contains('active')) {
      const transcript = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');

      document.getElementById('user-input').value = transcript;
    }
  });

  document.getElementById('mic-btn').addEventListener('click', function () {
    if (document.getElementById('mic-btn').classList.contains('active')) {
      document.getElementById('mic-btn').classList.remove('active');
      recognition.stop();
      handleUserMessage();
    } else {
      document.getElementById('mic-btn').classList.add('active');
      document.getElementById('user-input').value = '';
      recognition.start();
    }
  });
};


async function handleUserMessage() {
    var userInput = document.getElementById('user-input').value;

    if (userInput.trim() !== '') {
        addMessageToChatLog(userInput, 'user');
        document.getElementById('user-input').value = '';

        chatLogs[activeSession].push({ text: userInput, sender: 'user' });

        typingController.abort();
        typingController = new AbortController();
        let botResponse = await getBotResponse(userInput);
        await playSpeechFromElevenLabsAPI(botResponse);  // Plays the synthesized speech
        await typeWriter(botResponse, 0, typingController.signal);

        if (!typingController.signal.aborted) {
            chatLogs[activeSession].push({ text: botResponse, sender: 'bot' });
        }
    }
}



function createNewChatSession() {
    let sessionId = 'chat-session-' + (Object.keys(chatLogs).length);
    chatLogs[sessionId] = [];

    var newSessionTab = document.createElement('div');
    newSessionTab.innerHTML = "Chat " + (Object.keys(chatLogs).length);
    newSessionTab.classList.add('chat-session-tab');
    newSessionTab.id = sessionId;
    document.getElementById('chat-tabs').appendChild(newSessionTab);
    newSessionTab.addEventListener('click', function() {
        switchChatSession(newSessionTab.id);
    });
    switchChatSession(sessionId);
}

function deleteChatSession() {
    if (Object.keys(chatLogs).length === 1) {
        alert("You cannot delete all chat sessions.");
        return;
    }
    let currentTab = document.getElementById(activeSession);
    currentTab.parentNode.removeChild(currentTab);
    delete chatLogs[activeSession];
    switchChatSession(Object.keys(chatLogs)[0]);
}

function switchChatSession(sessionId) {
    document.getElementById('chat-log').innerHTML = '';
    for (let message of chatLogs[sessionId]) {
        addMessageToChatLog(message.text, message.sender);
    }
    activeSession = sessionId;
    handleActiveClass(sessionId);
}

function handleActiveClass(sessionId) {
    let tabs = document.getElementsByClassName('chat-session-tab');
    for (let tab of tabs) {
        if (tab.id === sessionId) {
            tab.classList.add('active-tab');
        } else {
            tab.classList.remove('active-tab');
        }
    }
}


async function getBotResponse(prompt) {
    try {
        const response = await fetch('http://localhost:3000/get-bot-response', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });
        
        if (!response.ok) {
            throw new Error(`An error has occurred: ${response.status}`);
        }
        
        const data = await response.json();
        return data.botResponse;

    } catch (error) {
        console.error(`Fetch Error: ${error}`);
        return `An error has occurred: ${error.message}`;
    }
}

async function handleUserMessage() {
    var userInput = document.getElementById('user-input').value;

    if (userInput.trim() !== '') {
        addMessageToChatLog(userInput, 'user');
        document.getElementById('user-input').value = '';

        chatLogs[activeSession].push({ text: userInput, sender: 'user' });

        typingController.abort();
        typingController = new AbortController();
        let botResponse = await getBotResponse(userInput);
        await playSpeechFromElevenLabsAPI(botResponse); // Plays the synthesized speech
        await typeWriter(botResponse, 0, typingController.signal);

        if (!typingController.signal.aborted) {
            chatLogs[activeSession].push({ text: botResponse, sender: 'bot' });
        }
    }
}




async function playSpeechFromElevenLabsAPI(text) {
    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`, {
            method: 'POST',
            headers: {
                'xi-api-key': XI_API_KEY,
                'Content-Type': 'application/json',
                'accept': 'audio/mpeg'
            },
            body: JSON.stringify({
                "text": text,
                "model_id": "eleven_monolingual_v1",
                "voice_settings": {
                    "stability": 0.05, // Adjust the stability parameter (lower value for faster response)
                    "similarity_boost": 0.05 // Adjust the similarity_boost parameter (lower value for faster response)
                }
            })
        });

        if (!response.ok) {
            throw new Error(`An error has occurred: ${response.status}`);
        }

        const data = await response.arrayBuffer();
        const blob = new Blob([data], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audio.play();
    } catch (error) {
        console.error(`Fetch Error: ${error}`);
    }
}



function addMessageToChatLog(message, sender) {
    const chatLog = document.querySelector('#chat-log');

    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('chat-message-wrapper');

    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    messageElement.classList.add(sender);
    messageElement.textContent = message;

    messageWrapper.appendChild(messageElement);
    chatLog.appendChild(messageWrapper);

    chatLog.scrollTop = chatLog.scrollHeight;
}

function removeLastBotMessage() {
    const chatLog = document.querySelector('#chat-log');
    if (chatLog.lastChild) {
        chatLog.removeChild(chatLog.lastChild);
    }
}

function randomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

async function typeWriter(text, i, signal) {
    if (i < text.length) {
        addMessageToChatLog(text.substring(0, i+1), 'bot');
        await new Promise(r => setTimeout(r, randomDelay(5, 20)));

        if (signal.aborted) {
            removeLastBotMessage();
            return;
        }
        
        removeLastBotMessage();
        await typeWriter(text, i + 1, signal);
    } else if (!signal.aborted) {
        addMessageToChatLog(text, 'bot');
    }
}

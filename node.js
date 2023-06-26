const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', function open() {
  console.log('connected');
  ws.send('Hello Server!');
});

ws.on('message', function incoming(data) {
  console.log(`Roundtrip time: ${Date.now() - data} ms`);

  // Here is where you would add the code to handle incoming messages from the server.
  // For example, you might update the text displayed by your MetaHuman avatar.
  console.log('received: %s', data);
});

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, 'public')));

let clients = {};

wss.on('connection', (ws) => {
    const clientId = `client-${Math.random().toString(36).substr(2, 9)}`;
    clients[clientId] = ws;

    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);
        const targetClient = clients[parsedMessage.clientId];

        if (targetClient) {
            targetClient.send(JSON.stringify({
                from: clientId,
                signal: parsedMessage.signal
            }));
        }
    });

    ws.on('close', () => {
        delete clients[clientId];
    });

    ws.send(JSON.stringify({ clientId }));
});

server.listen(3000, () => {
    console.log('Server läuft auf Port 3000');
});


async function startLocalStream() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia(constraints);
        const localVideo = document.createElement('video');
        localVideo.srcObject = localStream;
        localVideo.autoplay = true;
        localVideo.muted = true;
        videosContainer.appendChild(localVideo);
    } catch (error) {
        console.error('Fehler beim Abrufen des Medienstreams:', error);
    }
}

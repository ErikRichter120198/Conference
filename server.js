const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let clients = {};

wss.on('connection', (ws) => {
    // Neue Client-ID erstellen und Client in die Clients-Liste aufnehmen
    const clientId = generateClientId();
    clients[clientId] = ws;
    console.log(`Client connected: ${clientId}`);

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        if (data.join) {
            ws.room = data.join;
            broadcastExceptSender(clientId, JSON.stringify({ newClient: clientId }));
        } else if (data.sdp || data.ice) {
            // Nachricht an den Zielclient weiterleiten
            const targetClient = clients[data.to];
            if (targetClient) {
                targetClient.send(JSON.stringify({ ...data, from: clientId }));
            }
        }
    });

    ws.on('close', () => {
        console.log(`Client disconnected: ${clientId}`);
        delete clients[clientId];
    });
});

function generateClientId() {
    return 'client-' + Math.random().toString(36).substr(2, 9);
}

function broadcastExceptSender(senderId, message) {
    Object.keys(clients).forEach(clientId => {
        if (clientId !== senderId) {
            clients[clientId].send(message);
        }
    });
}

console.log('Signalisierungsserver läuft auf ws://localhost:8080');



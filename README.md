# 💻 PortLife Client

This is the **local agent** of the PortLife system. It connects to a relay server via WebSocket, listens for incoming requests, and executes them locally (e.g., `http://localhost:3081/...`), then sends the result back to the server.

## 📦 What It Does

- Connects to `ws://relay-server.com/{clientId}`
- Waits for messages (HTTP requests) from the relay server
- Forwards those requests to your **local server**
- Sends back the full response (including content-type and body)

## 🛠 How to Use

1. Make sure your local service is running (e.g., on `http://localhost:3081`)
2. Clone and run this project:

```bash
git clone https://github.com/wajih-awad/portlife-client
cd portlife-client
npm install
node client.js
```

3. Ensure the `relayUrl` inside `client.js` matches the relay server address.

## 🔐 Notes

- Supports both JSON and binary data (images, etc.)
- Automatically base64-encodes binary data for safe transport

## 🔗 Related Project

You must pair this with the relay server:
👉 [PortLife Server](https://github.com/wajih-awad/portLife-server)

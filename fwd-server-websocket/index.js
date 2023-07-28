const WebSocket = require('ws');
const http = require("http");
const defaultIpList  = ['::ffff:127.0.0.1','::ffff:192.168.0.1','127.0.0.1', '192.168.0.1'];

module.exports.runServer = function(_port= 3000, magicWord="", pollingTimeMs=10, contentTypeReturned='application/json', ipWhitelistRequesters = defaultIpList, ipWhitelistSocketClients = defaultIpList){
    // Create a HTTP server
    const server = http.createServer((req, res) => {

      const clientIp = req.connection.remoteAddress;

      const { method, url } = req;

      if (ipWhitelistRequesters.length==0 || ipWhitelistRequesters.includes(clientIp)) {

          if (method === 'GET' && url.startsWith('/') && url.includes(magicWord)) {
            // Extract SYMBOL from the URL
            const SYMBOL = url.slice(1);

            // Send JSON data {data: SYMBOL} to connected clients
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ data: SYMBOL }));
              }
            });

            // wait for reply before sending res
            waitForReply(SYMBOL, function(reply){
                reply = reply.toString(); //convert from buffer to string
                console.log("got",reply);
                // Send a response back to the requester
                res.setHeader('Content-Type', contentTypeReturned);
                res.end(reply);
            })

          } else {
            res.statusCode = 404;
            res.end();
          }
      }else{
            // IP is not in the whitelist, send 403 Forbidden response
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end('Forbidden');
      }
    });

    // Create a WebSocket server
    const wss = new WebSocket.Server({ server });

    var lastReplyTime = Date.now();
    var lastReply = "";
    // Handle incoming WebSocket connections
    // wss.on('connection', (ws) => {
    //   // Handle incoming messages from clients
    //   ws.on('message', (message) => {
    //     lastReplyTime=Date.now();
    //     lastReply=message;
    //     // Send the received JSON message back to the original requester
    //     if (ws.requester) {
    //       ws.requester.send(message);
    //       ws.requester = null;
    //     }
    //   });
    // });

    wss.on('connection', (ws, req) => {
      const clientIp = req.connection.remoteAddress;

      if (ipWhitelistSocketClients.length==0 || ipWhitelistSocketClients.includes(clientIp)) {
            // IP is in the whitelist, proceed with the WebSocket connection
            ws.on('message', message => {
                lastReplyTime=Date.now();
                lastReply=message;
                // Send the received JSON message back to the original requester
                if (ws.requester) {
                  ws.requester.send(message);
                  ws.requester = null;
                }
            });

            ws.on('close', () => {
              console.log('WebSocket connection closed');
            });
          } else {
            // IP is not in the whitelist, close the WebSocket connection
            ws.close();
            console.log(`Rejected WebSocket connection from client IP: ${clientIp}`);
          }
    });

    function getLastReply(){
        return {
            lastReplyTime, lastReply
        }
    }

    function waitForReply(symbol, callback, timeMsPing=pollingTimeMs){
        var replyAskTime = Date.now();
        var ping = setInterval(function(){
            var last = getLastReply();
            if(last.lastReplyTime > replyAskTime){
                clearInterval(ping);
                callback(last.lastReply);
            }
        }, timeMsPing);
    }

    // Start the server
    const port = _port; // Specify the port you want to use
    server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
}

var defaultMsgRunner = function(message, ws){
    // Process the received message
      console.log('Received message:', message);
      const message2 = { messageOrig: JSON.parse(message)};
      ws.send(JSON.stringify(message2));
}

module.exports.runClient = function(serverUrl = 'ws://localhost:3000', messageRunner = defaultMsgRunner){
    // WebSocket server URL
    const url = serverUrl; // Replace with the actual WebSocket server URL

    // Create a WebSocket client
    const ws = new WebSocket(url);

    // Handle the WebSocket connection event
    ws.on('open', () => { //console.log('ok');
      // Send a JSON message to the WebSocket server
      const message = { data: 'client connected' };
      ws.send(JSON.stringify(message));
    });

    // Handle incoming messages from the WebSocket server
    ws.on('message', (message) => {
      var message = message.toString();
      messageRunner(message, ws);
    });

    // Handle the WebSocket close event
    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
}
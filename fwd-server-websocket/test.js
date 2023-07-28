var fsw = require('./index.js');

//defaults shown [except for magicWord]
var port = 3000;
var pollingTimeMs = 10;
var magicWord = "hereWeGo"; //default is blank ""
var contentTypeReturned = "application/json";
//IPs that are allowed to make requests from the server
var ipWhitelistRequesters =  ['::ffff:127.0.0.1','::ffff:192.168.0.1','127.0.0.1', '192.168.0.1']; //set to [] to allow ALL ips [not recommended!]
//IPs that are allowed to generate responses for the server
var ipWhitelistSocketClients =  ['::ffff:127.0.0.1','::ffff:192.168.0.1','127.0.0.1', '192.168.0.1']; //set to [] to allow ALL ips [not recommended!]
fsw.runServer(port, magicWord, pollingTimeMs, contentTypeReturned, ipWhitelistRequesters, ipWhitelistSocketClients); //run http server on port 3000

//now we can do this in a different file/ on a different machine etc. or within the same file for this example.

// run websocket client that connects to the server,
// processes incoming msgs from requests, then serves
// the results to be return to the original requester

var defaultMsgRunner = function(message, ws){  //default function echos data wrapped in an object
    // Process the received message
      console.log('Received message:', message);
      const message2 = { messageOrig: JSON.parse(message)};
      ws.send(JSON.stringify(message2));
}

var defaultUrl = "ws://localhost:3000";
fsw.runClient(defaultUrl, defaultMsgRunner);

var axios = require('axios');

//now anytime a GET request to the server is made, the function above is called to process the response
axios.get('http://localhost:3000/hereWeGo_hereIsMyMsg')
  .then(response => {
    console.log(`Status Code: ${response.status}`); //200
    console.log(`Response Body:`,response.data); //{ messageOrig: { data: 'hereWeGo_hereIsMyMsg' } }
  })
  .catch(error => {
    console.error(`An error occurred: ${error}`);
  });

//this request gets rejected with a 404 because it is missing the magicWord
axios.get('http://localhost:3000/hereWeDontGo_hereIsMyMsg')
  .then(response => {})
  .catch(error => {
    console.error(`An error occurred: ${error}`); //An error occurred: AxiosError: Request failed with status code 404
  });

throw 'done';
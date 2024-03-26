const http = require('http');
const url = require('url');
const { Client } = require('./Client');
const { AuthServer } = require('./AuthServer');

const OUR_PORT = 3002;
const client = new Client({
  authServerPort: 3003,
  clientId: 'sram',
  clientSecret: 'ooD4butoomaiGhoo3EiH'
});
const server = new AuthServer();

http.createServer((req, res) => {  
  res.writeHead(200, {'Content-Type': 'text/html'});
  console.log(req.url.toString());
  if (req.url.startsWith('/callback')) {
    const code = client.getCodeFromCallback(req.url);
    const state = client.getStateFromCallback(req.url);
    const scopeInfo = client.fetchScopeInfo(code);
    server.handleCallback(req, res, scopeInfo, state);
  } else if (req.url?.startsWith('/authorize')) {
    server.handleAuthorize(req, res);
  } else  if (req.url?.startsWith('/token')) {
    server.handleToken(req, res);
  } else  if (req.url?.startsWith('/scope')) {
    server.handleScopeInfo(req, res);
  }
}).listen(OUR_PORT);
console.log(`Primary is running on port ${OUR_PORT}`);

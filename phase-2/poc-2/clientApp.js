const http = require('http');
const { Client } = require('./Client');

const OUR_PORT = 3001;
const client = new Client({
  authServerPort: 3002,
  clientId: 'surf-research-cloud',
  clientSecret: 'oodeiB2deikeer4doopa'
});

http.createServer(async (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  console.log(req.url.toString());
  if (req.url.startsWith('/callback')) {
    res.end(await client.makeCallbackScreen(req.url));
  } else {
    res.end(client.makeStartScreen('surf-research-cloud-'));
  }
}).listen(OUR_PORT);
console.log(`Client is running on port ${OUR_PORT}`);

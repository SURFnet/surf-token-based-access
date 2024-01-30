const http = require('http');
http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('SURF Research Cloud');
}).listen(3001);
console.log("SURF Research Cloud is running on port 3001");
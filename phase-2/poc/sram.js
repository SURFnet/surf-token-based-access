const http = require('http');
http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('SRAM');
}).listen(3002);
console.log("SRAM is running on port 3002");
const http = require('http');
http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Research Drive');
}).listen(3003);
console.log("Research Drive is running on port 3003");
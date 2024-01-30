const http = require('http');
const screen1 = `
<body style="background-color:#faf9e3">
<h2>Auth server (SRAM)</h2>
Here are some services you may want to share resources from, connected to your account:
<ul>
  <li><a href="http://localhost:3003/scope?redirect_uri=http://localhost:3002/callback&ticket=eing7uNg">Research Drive</a></li>  
  <li><a href="">iRods</a></li>
  <li><a href="">Microsoft Outlook Calendar</a></li>
</ul>
`;
const screen2part1 = `
<body style="background-color:#faf9e3">
<h2>Are you sure?</h2>
Are you sure you want to share "`;
const screen2part2 = `" with client "SRC VM 1234"?
<a href="http://localhost:3001/callback?ticket=peesox4I&caps=/rd-eing7uNg.json">yes</a> / <a href="no.html">no</a>
`;

http.createServer((req, res) => {
    console.log(req.url.toString());
    res.writeHead(200, {'Content-Type': 'text/html'});
    if (req.url?.startsWith('/callback')) {
        http.request({
            host: 'localhost',
            port: 3003,
            path: '/api/eing7uNg.json'
        }, (res2) => {
            res2.on('data', (d) => {
                try {
                    const obj = JSON.parse(d);
                    console.log('fetched scope details for ticket eing7uNg from Research Drive', obj);
                    res.end(screen2part1 + obj.humanReadable + screen2part2);
                } catch (e) {
                    console.log('error parsing JSON', e);
                    res.end('error parsing JSON');
                }
            });
        }).end();
    } else {
        res.end(screen1);
    }
}).listen(3002);
console.log("SRAM is running on port 3002");
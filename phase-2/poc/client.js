const http = require('http');
const url = require('url');
const { makeid } = require('./shared');

const screen1part1 = `
<body style="background-color:#e3f2fa">
<h2>SURF Research Cloud</h2>
<ul>
    <li>Click <a href="http://localhost:3002/authorize?` +
    `response_type=code&` +
    `client_id=ahxoh2ohTu&` +
    `redirect_uri=http://localhost:3001/callback&` +
    `scope=tbd&state=`;
    
const screen1part2 = `">here</a> to discover SRAM-based services to connect with your VM.</li>
    <li>Click <a href="">here</a> to discover Danish services to connect with your VM.</li>
    <li>etc&hellip;</li>
</ul>
`;
const screen2part1 = `
<body style="background-color:#e3f2fa">
<h2>SURF Research Cloud</h2>
The remote WebDAV folder <tt id="webdavURL">`;
const screen2part2 = `</tt> was successfully mounted under <tt>/mnt/fed/photos/2022/January</tt>!
`;
http.createServer((req, res) => {
    const url_parts = url.parse(req.url, true);
    const query = url_parts.query;

    res.writeHead(200, {'Content-Type': 'text/html'});
    console.log(req.url.toString());
    if (req.url.startsWith('/callback')) {
        http.request({
            host: 'localhost',
            port: 3003,
            path: `/api/${query.scope}.json`
        }, (res2) => {
            res2.on('data', (d) => {
                try {
                    const obj = JSON.parse(d);
                    console.log(`fetched details for scope ${query.scope} from Research Drive`, obj);
                    const webdavUrl = obj.protocols.webdav.url;
                    res.end(
                        screen2part1 + webdavUrl +
                        screen2part2
                    );
                } catch (e) {
                    console.log('error parsing JSON', e);
                    res.end('error parsing JSON');
                }
            });
        }).end();
    } else {
        res.end(screen1part1 + makeid(8) + screen1part2);
    }
}).listen(3001);
console.log("Client is running on port 3001");
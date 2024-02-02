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
    `redirect_uri=` + encodeURIComponent(`http://localhost:3001/callback1`) + `&` +
    `pick=webdav-folder&state=`;
    
const screen1part2 = `">here</a> to discover SRAM-based services to connect with your VM.</li>
    <li>Click <a href="">here</a> to discover Danish services to connect with your VM.</li>
    <li>Or go directly to <a href="http://localhost:3003/scope?redirect_uri=` + encodeURIComponent(`http://localhost:3001/callback2`) + `&pick=webdav-folder&state=`;
const screen1part3 = `">Research Drive</a></li>
    <li>etc&hellip;</li>
</ul>
`;
const screen2part1 = `
<body style="background-color:#e3f2fa">
<h2>SURF Research Cloud</h2>
The remote WebDAV folder <tt id="webdavURL">`;
const screen2part2 = `</tt> was successfully mounted under <tt>/mnt/fed/photos/2022/January</tt>!
`;

const screen3part1 = `
<body style="background-color:#e3f2fa">
<h2>SURF Research Cloud</h2>
Click <a href="http://localhost:3002/authorize?` +
`response_type=code&` +
`client_id=ahxoh2ohTu&` +
`redirect_uri=` + encodeURIComponent(`http://localhost:3001/callback1`) + `&` +
`scope=`;
const screen3part2 = `&scope_secret=`;
const screen3part3 = `&state=`;
const screen3part4 = `">here</a> to request access to remote WebDAV folder you picked, namely: <tt id="webdavURL">`;
const screen3part5 = `</tt>.`;

http.createServer((req, res) => {
    const url_parts = url.parse(req.url, true);
    const query = url_parts.query;

    res.writeHead(200, {'Content-Type': 'text/html'});
    console.log(req.url.toString());
    if (req.url.startsWith('/callback1')) {
        http.request(query.scope, {
            headers: {
                Authorization: 'Bearer ' + query.scope_secret
            }
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
    } else if (req.url.startsWith('/callback2')) {
        http.request(query.scope, {
            headers: {
                Authorization: 'Bearer ' + query.scope_secret
            }
        }, (res2) => {
            res2.on('data', (d) => {
                try {
                    const obj = JSON.parse(d);
                    console.log(`fetched details for scope ${query.scope} from Research Drive`, obj);
                    const webdavUrl = obj.protocols.webdav.url;
                    res.end(
                        screen3part1 + encodeURIComponent(query.scope) +
                        screen3part2 + query.scope_secret +
                        screen3part3 + makeid(8) +
                        screen3part4 + webdavUrl +
                        screen3part5
                    );
                } catch (e) {
                    console.log('error parsing JSON', e);
                    res.end('error parsing JSON');
                }
            });
        }).end();
    } else {
        res.end(screen1part1 + makeid(8) + screen1part2 + makeid(8) + screen1part3);
    }
}).listen(3001);
console.log("Client is running on port 3001");
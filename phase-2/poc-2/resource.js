const http = require('http');
const url = require('url');
const { makeid } = require('./shared');

const dialogpart1 = `
<body style="background-color:#e3fae7">
<h2>Research Drive</h2>
Select which RD-specific resource you want to share
<ul>
  <li>photos</li>
  <li><ul>
    <li>2021</li>
    <li>2022</li>
    <li><ul>
      <li><a href="`;
const dialogpart2 = `?scope=`;
const dialogpart3 = `&code=`;
const dialogpart4 = `&state=`;
const dialogpart5 = `">January</a></li>
      <li>...</li>
    </ul></li>    
    <li>2023</li>
  </ul></li>
</ul>
`;
const data = {
    "type": "scope and capability",
    "id": null, //"eing7uNg",
    "machineReadableInternal": "RD://pietjepuk/files/photos/2023/January",
    "protocols": {
        "webdav": {
            "url": "https://dav.rd123.surf.nl:4523/pietjepuk/files/photos/2023/January",
            "protocol-version": "8.6n"
        }
    }
};
const authorizationCodes = {

};


const clients = {
    'sram': {
        redirect_uri: 'http://localhost:3002/callback'
    }
};

http.createServer((req, res) => {
    const url_parts = url.parse(req.url, true);
    const query = url_parts.query;

    console.log(req.url.toString());
    if (req.url?.startsWith('/scope')) {
        const scopeId = makeid(8);
        const authorizationCode = makeid(16);
        const scopeDocUrlRelative = `/api/${scopeId}.json`;
        const scopeDocUrlAbsolute = `http://localhost:3003${scopeDocUrlRelative}`;
        authorizationCodes[scopeDocUrlRelative] = authorizationCode;
        console.log('preparing for redirect to client', query.client_id, clients[query.client_id].redirect_uri);
        console.log(`new transaction; minting scope ${scopeId} at ${scopeDocUrlAbsolute} with secret ${authorizationCode}`, query);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(
            dialogpart1 + clients[query.client_id].redirect_uri +
            dialogpart2 + encodeURIComponent(scopeDocUrlAbsolute) +
            dialogpart3 + authorizationCode +
            dialogpart4 + query.state +
            dialogpart5);
    } else {
        // console.log('scope request', url_parts);
        if (url_parts.pathname in authorizationCodes) {
            console.log('scope request with secret', url_parts.pathname);
            const authHeader = req.headers['authorization'];
            console.log('auth header check', authHeader, `Bearer ${authorizationCodes[url_parts.pathname]}`);
            if (authHeader == `Bearer ${authorizationCodes[url_parts.pathname]}`) {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(data, null, 2));
            } else {
                res.writeHead(403, {'Content-Type': 'text/plain'});
                res.end('Forbidden');
            }
        } else {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Not found');
        }
    }
}).listen(3003);
console.log("Resource is running on port 3003");
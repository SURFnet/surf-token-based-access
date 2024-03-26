const http = require('http');
const url = require('url');
const { AuthServer } = require('./AuthServer');
const { makeid } = require('./util');

const OUR_PORT = 3003
const server = new AuthServer({
  clients: {
    'sram': {
      clientSecret: 'ooD4butoomaiGhoo3EiH',
      redirectUri: 'http://localhost:3002/callback'
    }
  }
});

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
const dialogpart3 = `&scope_secret=`;
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
    "humanReadable": {
        "en-US": "the RD folder photos -> 2023 -> January"
    },
    "machineReadableInternal": "RD://pietjepuk/files/photos/2023/January",
    "protocols": {
        "webdav": {
            "url": "https://dav.rd123.surf.nl:4523/pietjepuk/files/photos/2023/January",
            "protocol-version": "8.6n"
        }
    }
};

http.createServer((req, res) => { 
  console.log(req.url.toString());
  if (req.url?.startsWith('/authorize')) {
    const scopeId = makeid(8);
    const code = makeid(16);
    server.storeGrant(code, scopeId);
    const url_parts = url.parse(req.url, true);
    const query = url_parts.query;
    const clientId = query.client_id;
    const state = query.state;
    console.log(`new transaction; minting scope ${scopeId} with code ${code}`, query);
    // FIXME: store this _after_ the user consents, not before!
    server.storeScopeInfo(scopeId, {
      type: "ticket",
      humanReadable: {
        "en-US": "photos -> 2023 -> January"
      },
      machineReadableInternal: "RD://pietjepuk/files/photos/2023/January",
      protocols: {
        webdav: {
          url: "https://dav.rd123.surf.nl:4523/pietjepuk/files/photos/2023/January",
          "protocol-version": "8.6n"
        }
      }
    });
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(`
      <body style="background-color:#e3fae7">
      <h2>Research Drive</h2>
      Select which RD-specific resource you want to share
      <ul>
        <li>photos</li>
        <li><ul>
          <li>2021</li>
          <li>2022</li>
          <li><ul>
            <li><a href="${server.createCallbackUrl({ clientId, code, scope: scopeId, state })}">January</a></li>
            <li>...</li>
          </ul></li>    
          <li>2023</li>
        </ul></li>
      </ul>
      <h2>Data:</h2>
      <pre>${JSON.stringify(server.getData(), null, 2)}</pre>
    
    `);
  } else  if (req.url?.startsWith('/token')) {
    server.handleToken(req, res);
  } else  if (req.url?.startsWith('/scope')) {
    server.handleScopeInfo(req, res);
  }
}).listen(OUR_PORT);
console.log(`Secondary is running on port ${OUR_PORT}`);

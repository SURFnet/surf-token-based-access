const http = require('http');
const url = require('url');
const { AuthServer } = require('./AuthServer');

const OUR_PORT = 3003
const server = new AuthServer({
  clients: {
    'sram': {
      redirect_uri: 'http://localhost:3002/callback'
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
  res.writeHead(200, {'Content-Type': 'text/html'});
  console.log(req.url.toString());
  if (req.url?.startsWith('/authorize')) {
    server.handleSecondaryAuthorize(req, res);
  } else  if (req.url?.startsWith('/token')) {
    server.handleToken(req, res);
  } else  if (req.url?.startsWith('/scope')) {
    server.handleScopeInfo(req, res);
  }
}).listen(OUR_PORT);
console.log(`Primary is running on port ${OUR_PORT}`);

const http = require('http');
const url = require('url');

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
      <li><a href="http://localhost:3002/callback?scope=http://localhost:3003/api/`;
const dialogpart2 = `.json&state=`;
const dialogpart3 = `">January</a></li>
      <li>...</li>
    </ul></li>    
    <li>2023</li>
  </ul></li>
</ul>
`;
const data = {
    "type": "scope and capability",
    "id": "eing7uNg",
    "humanReadable": "the RD folder photos -> 2023 -> January",
    "machineReadableInternal": "RD://pietjepuk/files/photos/2023/January",
    "protocols": {
        "webdav": {
            "url": "https://dav.rd123.surf.nl:4523/pietjepuk/files/photos/2023/January",
            "protocol-version": "8.6n"
        }
    }
};
http.createServer((req, res) => {
    const url_parts = url.parse(req.url, true);
    const query = url_parts.query;

    console.log(req.url.toString());
    if (req.url?.startsWith('/scope')) {
        console.log('new transaction', query);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(dialogpart1 + query.state + dialogpart2 + query.state + dialogpart3);
    } else {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data, null, 2));
    }
}).listen(3003);
console.log("Resource is running on port 3003");
const http = require('http');
const dialog = `
<body style="background-color:#e3fae7">
<h2>Research Drive</h2>
Select which RD-specific resource you want to share
<ul>
  <li>photos</li>
  <li><ul>
    <li>2021</li>
    <li>2022</li>
    <li><ul>
      <li><a href="http://localhost:3002/callback?scope=structured&ticket=eing7uNg">January</a></li>
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
            "protocol-version": "8.6n",
            "token": "rtgrvsfgdrtewg3qd4g"
        }
    }
};
http.createServer((req, res) => {
    console.log(req.url.toString());
    if (req.url?.startsWith('/scope')) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(dialog);
    } else {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));
    }
}).listen(3003);
console.log("Research Drive is running on port 3003");
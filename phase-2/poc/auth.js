const http = require('http');
const screen1 = `
<body style="background-color:#faf9e3">
<h2>Auth server (SRAM)</h2>
Here are some services you may want to share resources from, connected to your account:
<ul>
  <li><a href="http://localhost:3003/scope?redirect_uri=https://sram.surf.nl/scopeSelect&ticket=eing7uNg">Research Drive</a></li>  
  <li><a href="">iRods</a></li>
  <li><a href="">Microsoft Outlook Calendar</a></li>
</ul>
`;
const screen2 = `
<body style="background-color:#faf9e3">
<h2>Are you sure?</h2>
Are you sure you want to share "
<span id="scopeDescr">(loading scope description&hellip;)></span>
" with client "SRC VM 1234"?
<a href="http://localhost:3001/callback?ticket=peesox4I&caps=/rd-eing7uNg.json">yes</a> / <a href="no.html">no</a>
<script>
    fetch("./rd-eing7uNg.json").then(res => {
        return res.json();
    }).then(json => {
        console.log('fetched scope details for ticket eing7uNg from Research Drive', json);
        document.getElementById("scopeDescr").innerText = json.humanReadable;
    })
</script>
`;

http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(screen1);
}).listen(3002);
console.log("SRAM is running on port 3002");
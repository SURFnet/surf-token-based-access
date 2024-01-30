const http = require('http');
const screen1 = `
<body style="background-color:#e3f2fa">
<h2>SURF Research Cloud</h2>
<ul>

    <li>Click <a href="sram1.html#redirect_uri=https://src.surf.nl/connect&ticket=peesox4I">here</a> to discover SRAM-based services to connect with your VM.</li>
    <li>Click <a href="dtu.html#redirect_uri=https://src.surf.nl/connect&ticket=peesox4I">here</a> to discover Danish services to connect with your VM.</li>
    <li>etc&hellip;</li>
</ul>
`;
const screen2 = `
<body style="background-color:#e3f2fa">
<h2>SURF Research Cloud</h2>
The remote WebDAV folder <tt id="webdavURL">(loading WebDAV URL&hellip;)</tt> was successfully mounted under <tt>/mnt/fed/photos/2022/January</tt>!
<script>
    const fragment = window.location.hash;
    const caps = fragment.substr("#ticket=peesox4I&caps=".length);
    fetch(caps).then(res => {
        return res.json();
    }).then(json => {
        console.log("fetched caps " + caps + " for our ticket peesox4I", json);
        document.getElementById("webdavURL").innerText = json?.protocols?.webdav?.url;
    })
</script>
`;
http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(screen1);
}).listen(3001);
console.log("SURF Research Cloud is running on port 3001");
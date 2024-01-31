const http = require('http');
const url = require('url');
const { makeid } = require('./shared');

const screen1part1 = `
<body style="background-color:#faf9e3">
<h2>Auth server (SRAM)</h2>
Here are some services you may want to share resources from, connected to your account:
<ul>
  <li><a href="http://localhost:3003/scope?redirect_uri=http://localhost:3002/callback&state=`;  
const screen1part2 = `">Research Drive</a></li>  
  <li><a href="">iRods</a></li>
  <li><a href="">Microsoft Outlook Calendar</a></li>
</ul>
`;
const screen2part1 = `
<body style="background-color:#faf9e3">
<h2>Are you sure?</h2>
Are you sure you want to share "`;
const screen2part2 = `" with client "SRC VM 1234"?<br><a href="http://localhost:3001/callback1?` +
    `code=eeKahdahkeedohw4ohza&` +
    `state=`;
const screen2part3 = `&scope=`;
const screen2part4 = `">yes</a> / <a href="no.html">no</a>`;

const tickets = {};

http.createServer((req, res) => {
    const url_parts = url.parse(req.url, true);
    const query = url_parts.query;
    console.log("auth server sees request", req.url.toString());
    res.writeHead(200, {'Content-Type': 'text/html'});
    if (req.url?.startsWith('/callback')) {
        console.log('callback on transaction', query);
        const resourceTicket = query.state;
        if (typeof tickets[resourceTicket] == 'undefined') {
            res.end('Session not found, please <a href="http://localhost:3001">try again</a>.');
            return;
        }
        const clientTicket = tickets[resourceTicket].clientTicket;
        console.log(`Linking back resource ticket ${resourceTicket} with scope picking result ${query.scope} to client ticket ${clientTicket}`);
        http.request(query.scope, (res2) => {
            res2.on('data', (d) => {
                try {
                    const obj = JSON.parse(d);
                    console.log('fetched scope details for ticket eing7uNg from Research Drive', obj);
                    res.end(
                        screen2part1 + obj.humanReadable +
                        screen2part2 + clientTicket +
                        screen2part3 + query.scope +
                        screen2part4
                    );
                } catch (e) {
                    console.log('error parsing JSON', e);
                    res.end('error parsing JSON');
                }
            });
        }).end();
    } else if (req.url?.startsWith('/authorize')) {
        const url_parts = url.parse(req.url, true);
        const query = url_parts.query;
        console.log('new transaction', query);
        if (query.scope == 'a-webdav-folder') {
            console.log(`need to pick ${query.scope}!`);
            if (query.state && query.redirect_uri) {
                const clientTicket = query.state;
                const resourceTicket = makeid(8);
                tickets[resourceTicket] = {
                    redirectUri: query.redirect_uri,
                    clientTicket
                };
                console.log(tickets);
                res.end(screen1part1 + resourceTicket + screen1part2);
            }
        } else {
            console.log(`need to dereference ${query.scope}`);
            http.request(query.scope, (res2) => {
                res2.on('data', (d) => {
                    try {
                        const obj = JSON.parse(d);
                        console.log(`fetched scope details for ticket ${query.scope}`, obj);
                        res.end(
                            screen2part1 + obj.humanReadable +
                            screen2part2 + query.state +
                            screen2part3 + query.scope +
                            screen2part4
                        );
                    } catch (e) {
                        console.log('error parsing JSON', e);
                        res.end('error parsing JSON');
                    }
                });
            }).end();
        }
    }
}).listen(3002);
console.log("Auth is running on port 3002");
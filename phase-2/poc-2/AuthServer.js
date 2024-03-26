const http = require('http');
const url = require('url');
const { makeid } = require('./util');
const basicAuth = require('basic-auth');

class AuthServer {
  constructor(clients) {
    this.clients = clients;
    this.grants = {};
  }
  handleAuthorize(req, res) {
    const url_parts = url.parse(req.url, true);
    const query = url_parts.query;
    console.log('new transaction', query);
    if (query.scope == 'webdav-folder') {
      console.log(`need to pick ${query.scope}!`);
      if (query.state && query.client_id) {
        const clientTicket = query.state;
        const resourceTicket = makeid(8);
        this.grants[resourceTicket] = {
          redirectUri: query.redirect_uri,
          clientTicket
        };
        console.log(tickets);
        res.end(screen1part1 + resourceTicket + screen1part2 + query.pick + screen1part3);
      }
    }
  }
  handleScopePicker(req, res) {
    const scopeId = makeid(8);
    const code = makeid(16);
    this.grants[scopeId] = code;
    const url_parts = url.parse(req.url, true);
    const query = url_parts.query;
    console.log(`new transaction; minting scope ${scopeId} with code ${code}`, query);
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
            <li><a href="${query.redirect_uri}?scope=${encodeURIComponent(scopeId)}&code=${code}&state=${query.state}">January</a></li>
            <li>...</li>
          </ul></li>    
          <li>2023</li>
        </ul></li>
      </ul>
    `);
  }
  handlePrimaryScopeInfo(req, res) {
    const user = basicAuth(req);
    console.log(user);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
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
    }, null, 2));
  }
  handleSecondaryScopeInfo(req, res) {
    const user = basicAuth(req);
    console.log(user);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
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
    }, null, 2));
  }
}

module.exports = { AuthServer };
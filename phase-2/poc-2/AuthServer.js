const http = require('http');
const url = require('url');
const { makeid } = require('./util');
const basicAuth = require('basic-auth');

class AuthServer {
  constructor(options) {
    console.log('AuthServer created with options', options);
    this.clients = options.clients;
    this.scopePickerPort = options.scopePickerPort;
    this.grants = {};
    this.tickets = {};
  }
  storeTicket(secondaryState, valuesObj) {
    console.log('storing ticket', secondaryState, valuesObj)
    this.tickets[secondaryState] = valuesObj;
  }
  getTicket(secondaryState) {
    console.log('getting ticket', secondaryState, this.tickets[secondaryState]);
    return this.tickets[secondaryState];
  }
  storeGrant(code, scopeId) {
    this.grants[code] = scopeId;
  }
  handlePrimaryScopeInfo(req, res) {
    const user = basicAuth(req);
    console.log(user);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
      "type": "grant",
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
      "type": "ticket",
      "humanReadable": {
          "en-US": "photos -> 2023 -> January"
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
  createCallbackUrl({ clientId, code, scope, state }) {
    console.log('creating callback url', clientId, code, scope, state);
    const codeStr = encodeURIComponent(code);
    const scopeStr = encodeURIComponent(scope);
    const stateStr = encodeURIComponent(state);
    return `${this.clients[clientId].redirectUri}?` +
      `code=${codeStr}&` +
      `scope=${scopeStr}&` +
      `state=${stateStr}`;
  }
}

module.exports = { AuthServer };
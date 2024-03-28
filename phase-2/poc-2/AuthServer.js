const http = require('http');
const url = require('url');
const querystring = require('node:querystring');
const basicAuth = require('basic-auth');

class AuthServer {
  constructor(options) {
    console.log('AuthServer created with options', options);
    this.clients = options.clients;
    this.scopePickerPort = options.scopePickerPort;
    this.grants = {};
    this.tickets = {};
    this.scopes = {};
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
  getData() {
    return {
      grants: this.grants,
      tickets: this.tickets,
      scopes: this.scopes
    };
  }
  storeScopeInfo(scopeId, details) {
    this.scopes[scopeId] = details;
  }
  handleScopeInfo(req, res) {
    const user = basicAuth(req);
    console.log(user);
    let body = [];
    req.on('data', (chunk) => {
      body.push(chunk)
    });
    req.on('end', () => {
      body = Buffer.concat(body).toString();
      console.log('parsed body from scope info request', body);
      const query = querystring.parse(body);
      const scopeId = this.grants[query.code];
      console.log('giving scope info for grant/scopeId', scopeId);
      const details = this.scopes[scopeId];
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(details, null, 2));
    });
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
  createAllowUrl({ clientId, code, scope, state }) {
    console.log('creating callback url', clientId, code, scope, state);
    const clientIdStr = encodeURIComponent(clientId);
    const scopeStr = encodeURIComponent(scope);
    const stateStr = encodeURIComponent(state);
    return `/allow?` +
      `scope=${scopeStr}&` +
      `client_id=${clientIdStr}&` +
      `state=${stateStr}`;
  }
}

module.exports = { AuthServer };
const http = require('http');
const url = require('url');
const { makeid } = require('./util');

function httpRequest(url, auth, contentType, body) {
  return new Promise((resolve, reject) => {
    console.log(`POSTing to ${url} with body ${body}`);
    const req = http.request(url, {
      method: 'POST',
      headers: {
        Authorization: auth,
        'Content-Type': contentType
      }
    }, (res2) => {
      res2.on('data', (d) => {
        try {
          const obj = JSON.parse(d);
          console.log('fetched JSON', obj)
          resolve(obj);
        } catch (e) {
          console.log('error parsing JSON', e);
          reject(e);
        }
      });
    });
    req.write(body);
    req.end();
  });
}


class Client {
  constructor(options) {
    this.ourPort = options.ourPort;
    this.authServerUrls = {
      authorize: `http://localhost:${options.authServerPort}/authorize`,
      token: `http://localhost:${options.authServerPort}/token`,
      scopeInfo: `http://localhost:${options.authServerPort}/scope-info`,
    };
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.tokens = {};
  }

  makeAuthorizeUrl(scope, state, responseType) {
    return `${this.authServerUrls.authorize}?` +
      `response_type=${encodeURIComponent(responseType)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `client_id=${encodeURIComponent(this.clientId)}&` +
      `state=${encodeURIComponent(state)}`;
  }
  makeStartScreen(prefix) {
    return `
      <body style="background-color:#e3f2fa">
      <h2>Client</h2>
      <p>Logged in as <tt>alice@eosc.org</tt></p>
      <p>SURF Research Cloud can mount WebDAV folders from any European Research Infrastructure! You can:</p>
      <ul>
      <li>Add <a href="${this.makeAuthorizeUrl('webdav-folder', makeid(prefix, 8), 'code')}">SURF</a> services from Dutch Research Infrastructure.</li>
      <li>Add <a href="">SUNET</a> services from Swedish Research Infrastructure.</li>
      <li>Add <a href="">SWITCH</a> services from Swiss Research Infrastructure.</li>
      <li>Add <a href="">CESNET</a> services from Czech Research Infrastructure.</li>
      </ul>
      <h2>Tokens:</h2>
      <pre>${JSON.stringify(this.tokens, null, 2)}</pre>
    `;
  }
  getCodeFromCallback(urlStr) {
    const url_parts = url.parse(urlStr, true);
    const query = url_parts.query;
    return query.code;
  }
  getScopeFromCallback(urlStr) {
    const url_parts = url.parse(urlStr, true);
    const query = url_parts.query;
    return query.scope;
  }
  getStateFromCallback(urlStr) {
    const url_parts = url.parse(urlStr, true);
    const query = url_parts.query;
    return query.state;
  }
  async makeCallbackScreen(urlStr) {
    const code = this.getCodeFromCallback(urlStr);
    const scope = this.getScopeFromCallback(urlStr);
    const state = this.getStateFromCallback(urlStr);
    const scopeInfo = await this.fetchScopeInfo(code);
    // console.log('scope info', scopeInfo);
    this.tokens[code] = {
      scopeInfo,
      scope,
      state
    };
    return `
      <body style="background-color:#e3f2fa">
      <h2>Client</h2>
      The remote WebDAV folder from SURF Research Infrastructure: <p><tt>${scopeInfo.humanReadable['en-US']}</tt></p> was successfully mounted!
      This client will be able to access it at:<br> ${scopeInfo.protocols.webdav.url}
      <h2>Tokens:</h2>
      <pre>${JSON.stringify(this.tokens, null, 2)}</pre>
    `;
  }
  authServerRequest(url, code) {
    const username = this.clientId;
    const password = this.clientSecret;
    const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
    const body = `grant_type=authorization_code&code=${encodeURIComponent(code)}`;
    return httpRequest(url, auth, 'application/x-www-form-urlencoded', body);
  }
  fetchToken(code) {
    // See https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.3
    return this.authServerRequest(this.authServerUrls.token, code);
  }
  fetchScopeInfo(code) {
    // See ../spec/draft.md
    return this.authServerRequest(this.authServerUrls.scopeInfo, code);
  }
}

async function registerResource(resourceRegistryClient, data) {
  const username = resourceRegistryClient.clientId;
  const password = resourceRegistryClient.clientSecret;
  const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
  const ret = await httpRequest(resourceRegistryClient.baseUrl, auth, 'application/json', JSON.stringify(data));
  return ret._id;
}

module.exports = { Client, registerResource };
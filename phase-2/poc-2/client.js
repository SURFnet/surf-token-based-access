const http = require('http');
const url = require('url');
const { makeid } = require('./util');

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

  makeAuthorizeUrl(scope, state) {
    return `${this.authServerUrls.authorize}?` +
      `response_type=code&` +
      `client_id=${this.clientId}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `state=${encodeURI(state)}`;
  }
  makeStartScreen(prefix) {
    return `
      <body style="background-color:#e3f2fa">
      <h2>SURF Research Cloud</h2>
      <ul>
      <li>Click <a href="${this.makeAuthorizeUrl('webdav-folder', makeid(prefix, 8))}">here</a> to discover AS-based services to connect with your VM.</li>
      <li>Click <a href="">here</a> to discover Danish services to connect with your VM.</li>
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
    console.log('scope info', scopeInfo);
    this.tokens[code] = {
      scopeInfo,
      scope,
      state
    };
    return `
      <body style="background-color:#e3f2fa">
      <h2>SURF Research Cloud</h2>
      The remote WebDAV folder you shared as: <p><tt>${scopeInfo.humanReadable['en-US']}</tt></p> was successfully mounted!
      This client will be able to access it at:<br> ${scopeInfo.protocols.webdav.url}
      <h2>Tokens:</h2>
      <pre>${JSON.stringify(this.tokens, null, 2)}</pre>
    `;
  }
  authServerRequest(url, code) {
    const username = this.clientId;
    const password = this.clientSecret;
    const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
    return new Promise((resolve, reject) => {
      const body = `grant_type=authorization_code&code=${encodeURIComponent(code)}`;
      console.log(`Fetching ${url} with code ${code} and body ${body}`);
      const req = http.request(url, {
        method: 'POST',
        headers: {
          Authorization: auth,
          'Content-Type': 'application/x-www-form-urlencoded'
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
  fetchToken(code) {
    // See https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.3
    return this.authServerRequest(this.authServerUrls.token, code);
  }
  fetchScopeInfo(code) {
    // See ../spec/draft.md
    return this.authServerRequest(this.authServerUrls.scopeInfo, code);
  }
}

module.exports = { Client };
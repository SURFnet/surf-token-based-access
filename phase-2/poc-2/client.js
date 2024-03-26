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
  }

  makeStartScreen() {
    const screen1part1 = `
      <body style="background-color:#e3f2fa">
      <h2>SURF Research Cloud</h2>
      <ul>
      <li>Click <a href="${this.authServerUrls.authorize}?` +
      `response_type=code&` +
      `client_id=${this.clientId}&` +
      `scope=webdav-folder&state=`;
    
    const screen1part2 = `">here</a> to discover SRAM-based services to connect with your VM.</li>
      <li>Click <a href="">here</a> to discover Danish services to connect with your VM.</li>
      </ul>
    `;
    return screen1part1 + makeid(8) + screen1part2;
  }
  getCodeFromCallback(urlStr) {
    const url_parts = url.parse(urlStr, true);
    const query = url_parts.query;
    return query.code;
  }
  async makeCallbackScreen(scopeInfo) {
    console.log('scope info', scopeInfo);
    return `
      <body style="background-color:#e3f2fa">
      <h2>SURF Research Cloud</h2>
      The remote WebDAV folder you shared as ${scopeInfo.humanReadable['en-US']} was successfully mounted!
      This client will be able to access it at ${scopeInfo.protocols.webdav.url}
    `;
  }
  authServerRequest(url, code) {
    const username = this.clientId;
    const password = this.clientSecret;
    const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
    return new Promise((resolve, reject) => {
      http.request(url, {
        headers: {
          Authorization: auth,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=authorization_code&code=${encodeURIComponent(code)}`
      }, (res2) => {
        res2.on('data', (d) => {
            try {
              const obj = JSON.parse(d);
              resolve(obj);
            } catch (e) {
              console.log('error parsing JSON', e);
              reject(e);
            }
        });
      }).end();
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
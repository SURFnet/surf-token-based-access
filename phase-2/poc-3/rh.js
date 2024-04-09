const http = require('http');
const url = require('url');
const { AuthServer } = require('./AuthServer');
const { registerResource } = require('./Client');

const OUR_PORT = 3003
const server = new AuthServer({
  clients: {
    'AS': {
      clientSecret: 'ooD4butoomaiGhoo3EiH',
      redirectUri: 'http://localhost:3002/callback'
    }
  }
});
const resourceRegistryClient = {
  clientId: 'RH',
  clientSecret: 'ooh9pi7adeewaevohth9KeeQu9zaG1koor1phaqu',
  baseUrl: 'http://localhost:3002/resource-registry/'
};

const dialogpart1 = `
<body style="background-color:#e3fae7">
<h2>Resource Helper</h2>
Select which RD-specific resource you want to share
<ul>
  <li>photos</li>
  <li><ul>
    <li>2021</li>
    <li>2022</li>
    <li><ul>
      <li><a href="`;
const dialogpart2 = `?scope=`;
const dialogpart3 = `&scope_secret=`;
const dialogpart4 = `&state=`;
const dialogpart5 = `">January</a></li>
      <li>...</li>
    </ul></li>    
    <li>2023</li>
  </ul></li>
</ul>
`;

function handleOverview(req, res, serverData) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(`
    <body style="background-color:#faf9e3">
    <h2>Resource Helper</h2>
    Here are grants to scope information:
    <ul>`);
  Object.keys(serverData.grants).forEach(grant => {
      res.write(`<li>${grant}</li>`);
  });
  res.end(`</ul></body>`);
}

http.createServer(async (req, res) => { 
  // console.log(req.url.toString());
  if (req.url?.startsWith('/authorize')) {
    const url_parts = url.parse(req.url, true);
    const query = url_parts.query;
    const clientId = query.client_id;
    const state = query.state;
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(`
      <body style="background-color:#e3fae7">
      <h2>Resource Helper</h2>
      Select which RD-specific resource you want to share
      <ul>
        <li>photos</li>
        <li><ul>
          <li>2021</li>
          <li>2022</li>
          <li><ul>
            <li>
              January
              <a href="${server.createAllowUrl({ clientId, resource: 'photos/2022/January', resourceScopes: 'read', state })}">read-only</a>
              <a href="${server.createAllowUrl({ clientId, resource: 'photos/2022/January', resourceScopes: 'read-write', state })}">read-write</a>
            </li>
            <li>...</li>
          </ul></li>    
          <li>2023</li>
        </ul></li>
      </ul>
      <h2>Data:</h2>
      <pre>${JSON.stringify(server.getData(), null, 2)}</pre>
    `);
  } else  if (req.url?.startsWith('/allow')) {
      const url_parts = url.parse(req.url, true);
      const query = url_parts.query;
      const clientId = query.client_id;
      const state = query.state;
      const resource = query.resource;
      const resourceScopes = query.resource_scopes;
      const scope = await registerResource(resourceRegistryClient, {
        "resource_scopes": resourceScopes.split('-'),
        "description": `${resourceScopes.split('-').join(' and ')} access to the RD folder ${resource.split('/').join(' -> ')}`,
        "type": "webdav-folder"
      });
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(`
        <body style="background-color:#e3fae7">
        <h2>Resource Helper</h2>
        <p><tt>${resource}</tt> <tt>${resourceScopes}</p>
        <p>
          <a href="${server.createResourceHelperCallbackUrl({ clientId, scope, state })}">Continue</a>
        </p>
        <h2>Data:</h2>
        <pre>${JSON.stringify(server.getData(), null, 2)}</pre>
      
      `);
    } else  if (req.url?.startsWith('/token')) {
    server.handleToken(req, res);
  } else {
    handleOverview(req, res, server.getData());
  }
}).listen(OUR_PORT);
console.log(`Resource helper is running on port ${OUR_PORT}`);

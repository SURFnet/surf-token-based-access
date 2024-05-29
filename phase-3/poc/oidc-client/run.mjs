import { createServer } from 'http';
import { Issuer } from 'openid-client';
import { generators } from 'openid-client';
const code_verifier = generators.codeVerifier();
// store the code_verifier in your framework's session mechanism, if it is a cookie based solution
// it should be httpOnly (not readable by javascript) and encrypted.

const googleIssuer = await Issuer.discover('https://accounts.google.com');
console.log('Discovered issuer %s %O', googleIssuer.issuer, googleIssuer.metadata);

const client = new googleIssuer.Client({
    client_id: '994014261189-c2us07d24s52v1dhrsl8fkja36rhbgif.apps.googleusercontent.com',
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uris: ['https://sram-auth-poc.pondersource.net/login-callback.html'],
    response_types: ['code'],
    // id_token_signed_response_alg (default "RS256")
    // token_endpoint_auth_method (default "client_secret_basic")
  }); // => Client

const code_challenge = generators.codeChallenge(code_verifier);

const authUrl = client.authorizationUrl({
  scope: 'openid email profile',
  resource: 'https://sram-auth-poc.pondersource.net',
  code_challenge,
  code_challenge_method: 'S256',
});

console.log('Generated authorization URL: %s', authUrl);

createServer((req, res) => {
    if (req.url && req.url.startsWith('/login')) {
        res.writeHead(302, {
            Location: authUrl,
        });
    } else {
        res.writeHead(200, {
            'Content-Type': 'text/html',
        });
        res.end('Hello World. Log in with: <a id="google">Google</a> or <span id="surf">SRAM</a>.<script>document.getElementById("google").addEventListener("click", () => { window.location.href = "/login"; });</script>');
    }
    res.end();
}).listen(80, () => {
    console.log('Server is running on port 80');
});
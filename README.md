# surf-token-based-access

## Phase 1 (exploration) completed
[report](https://github.com/pondersource/surf-token-based-access/blob/main/phase-1/phase-1-report.md)


## Phase 2 (proof of concept)
### OAuth Scope Picker spec
See [draft](./phase-2/spec/draft.md).

### OAuth Scope Picker PoC
```
git clone https://github.com/pondersource/surf-token-based-access
cd surf-token-based-access
cd phase-2
cd poc
node client.js & node auth.js & node resource.js
```
Now you can use your browser to see the PoC;
* Start in the client on http://localhost:3001
* You will be redirected to the auth server on http://localhost:3002
* The auth server gets a standard OAuth request from one of its registered client, but without `requested_scope`
* The user selects a scope selection server from a list. Unlike the auth server, these scope selection servers are tightly coupled to specific resource servers and their offerings.
* The user's browser is redirected to the resource server (or more precisely, the scope selection server) on http://localhost:3003, at this point only with a randomly
generated `ticket` which acts as a transaction identifier and a `redirect_uri` pointing the way back to the auth server.
* The user can provide credentials and interactively select the resource details to be offered in this transaction.
* The user is redirected back to the auth server, with the transaction ID and in the query or fragment.
* The auth server knows how to discover transaction details from the resource server, and does so.
* The auth server displays human-readable info and allows the user to take a yes/no decision
* The user is redirected back to the client's `redirect_uri` with a refresh token in the query string.
* The client knows how to contact the auth server to exchange this refresh token for an access token
* The client now needs to discover access instructions. The client directly asks the resource server for this
### How is this different?
* the client sends 'pick=webdav-folder' instead of 'scope=...', and gets back a URL for a structured scope
* this scope was chosen by the user at the resource server's scope selection interface, the auth server doesn't understand it, except for the `humanReadable` field which it can display in various locales.
* the client can deference the scope to discover the protocol version, resource URL, etc.

## JWT in ownCloud PoC
### Development
```
git clone https://github.com/pondersource/dev-stock
cd dev-stock
./scripts/init-token-based-access.sh
./scripts/testing-token-based-access.sh
```
Then:
```
echo "{\"token\":`curl -X POST http://localhost:8080/index.php/apps/tokenbaseddav/auth/token`}" > token.json
curl -X POST  -H "Content-Type:application/json" --data-binary @token.json http://localhost:8080/index.php/apps/tokenbaseddav/auth/test
rm token.json
```

### JWT token:
you can configure the app behavior according to this table: (they should be inserted in the oc_appconfig table with `appid` = `tokenbaseddav`)

|config key | description | default value |
|-----------|-------------|---------------|
|token_issuer_public_key| the public key of the certificate that sign the tokens (RS256 algorithm)||


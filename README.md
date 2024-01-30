# surf-token-based-access

## Phase 1 (exploration) completed
[report](https://github.com/pondersource/surf-token-based-access/blob/main/phase-1/phase-1-report.md)


## Phase 2 (proof of concept)
### OAuth Scope Gathering PoC
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
* TODO: indicate explicitly at this point that scope is to be negotiated interactively
* The user selects a scope selection server from a list. Unlike the auth server, these scope selection servers are tightly coupled to specific resource servers and their offerings.
* The user's browser is redirected to the resource server (or more precisely, the scope selection server) on http://localhost:3003, at this point only with a randomly
generated `ticket` which acts as a transaction identifier and a `redirect_uri` pointing the way back to the auth server.
* TODO: rename `ticket` to `transaction`?
* The user can provide credentials and interactively select the resource details to be offered in this transaction.
* The user is redirected back to the auth server, with the transaction ID and in the query or fragment.
* The auth server knows how to discover transaction details from the resource server, and does so.
* The auth server displays human-readable info and allows the user to take a yes/no decision
* The user is redirected back to the client's `redirect_uri` with a refresh token in the query string.
* The client knows how to contact the auth server to exchange this refresh token for an access token
* TODO: The client now needs to discover access instructions.
  * OPTION 1: the client can ask the auth server for this
  * OPTION 2: the client directly asks the resource server for this
* TODO: should the transaction ID between client and auth server be different from the one between auth server and resources server?
  * Pro: makes it easier since the client will eventually end up talking directly to the resource server anyway.
  * Con: might leak some traceability of users across services
  * Con: might make it harder if multiple resource servers are involved in a single transaction

Client should maybe request types of resources it can handle
It then gets the refresh token from the auth server and the API details from the resource server.

Part 1: resource access description
This is for client to deal with dynamic API discovery
It can maybe be done together with OCM?
In its basic form it's a WebDAV URL


Part 2: resource selection
Most of this can be done with tickets between auth server and resource server.
Except that the auth server should have a way to retrieve human-readable transaction details.

The resource scope description is what the resource server gives to the auth server, to help the decision
The resource access description is what the resource server gives to the client, to help the access
They describe the same resource so it makes sense to join them into one, right? That's also very SemWeb. :)
The scope is identified by a dereferenceable URL




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


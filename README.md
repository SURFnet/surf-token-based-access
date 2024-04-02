# surf-token-based-access

## Phase 1 (exploration) completed
[report](https://github.com/pondersource/surf-token-based-access/blob/main/phase-1/phase-1-report.md)

## Phase 2 (proof of concept)
### OAuth Scope Picker spec
See [draft](./phase-2/spec/out.txt).

### OAuth Scope Picker PoC
```
git clone https://github.com/pondersource/surf-token-based-access
cd surf-token-based-access
cd phase-2
cd poc
node clientApp.js & node auth.js & node rh.js
```
Now you can use your browser to see the PoC;
* Start in the client on http://localhost:3001. This client might support connecting via various authorization servers. Pick the top one.
* You will be redirected to the auth server on http://localhost:3002. This Auth server might support various resource servers. Pick the top one.
* Now you see the Resource Helper on http://localhost:3003. Pick a resource (only 'January' works).
* A scope is minted and the authorization server will receive an authorization code to access the informational API
* The authorization server fetches and displays the scope label "photos -> 2023 -> January" and asks you to grant the client access. This scope is both custom and dynamic. Click 'yes'
* Now the client can retrieve client config info from the AS that allow it to access the resource server


### Design choices
In general you can browse https://github.com/pondersource/surf-token-based-access/issues?q=is%3Aissue+is%3Aclosed to see closed discussions and the questions we visited on the way.

#### Name 'Resource Helper'
We wanted to design a plugin for an OAuth authorization server, and ended up calling this plugin the Resource Helper.
Another names we considered were 'scope picker'

#### Name 'Scope'
Even though the client and AS already use a 'scopes' parameter in their interactions, we decided to name the description of access scope that the Resource Helper produces a 'scope' too.
Other options we considered are listed in https://github.com/pondersource/surf-token-based-access/issues/33#issuecomment-2018236582

#### Use of OAuth for the RH informational API
We developed a PoC version that used `scope_secret` but that quickly proved hard to use. Using OAuth-within-OAuth here is elegant and simple.
See https://github.com/pondersource/surf-token-based-access/issues/30

#### Non-goals
We decided not to explore AS chaining in general or decentralized authorization such as https://ucan.xyz/ since it's not needed for our problem at hand of integrating may Resource Servers into one Authorization Server.

# OAuth Scope Picker

In this spec we propose to extend OAuth to support dynamically picked scopes. We propose two flows,
the 'predance', which is pretty close to existing work on GNAP and OAuth for bank payments, and the 'subdance' in which the auth server plays a role in decoupling the client from the resource server.

## Predance Flow
In this flow, the client first interacts with the resource server to pick a scope. This scope is assigned a URL which it can be dereferenced to obtain its machine-readable and human-readable descriptions. After this predance is completed, the client initiates a normal authorization code flow with this URL as the scope.

The auth server can fetch the JSON document from this URL using an `Authorization: Bearer <scope_secret>` request header and display the text from the `humanReadable[locale]` field, so the user knows which scope is meant. The client can fetch the same document to discover the protocol and API endpoint for interacting with the resource server.

Example:
Step 1) the client redirects the user to the scope picking GUI of the resource server, with a `redirect_uri` and a `pick=` query parameter referring to the requirements of the resource and scope to be picked. For instance, `pick=photo`.
Step 2) the resource server shows a GUI where the user can select a (structured) scope.
Step 3) the details of what the user selected are stored in a JSON document at a URL
Step 4) this URL is returned as a `scope` query parameter to the `redirect_uri` from step 1, along with a `scope_secret`.
Step 5) the `scope` is used in a standard OAuth flow
Step 6) even though the auth server has presumably never seen this `scope` before, it can still
display a description of it, but fetching the JSON document from this URL using an `Authorization: Bearer <scope_secret>` request header and taking the `humanReadable[locale]` field from there.

```
Client  Auth  Resource
   |      |      |
   |--------1--->|
   |      |      2
   |      |      3
   |<--4---------|
   |---5->|      |
   |<-----|      |
   |      |      |
```


## Subdance Flow
The subdance flow works slightly differently:
1) the client initiates an OAuth authorization code flow request where instead of a `scope` parameter, there is a `pick` parameter.
2) based on the `pick` parameter the auth server offers one or more options for the user to be redirected to a scope picker
3) the interaction with the scope picker is identical to steps 2 to 4 of the predance flow, except that the `redirect_uri` now points to the auth server instead of to the client
4) the auth server can now continue as from step 5 of the predance flow.

```
Client  Auth  Resource
   |      |      |
   |---1->|      |
   |      2      |
   |      |---3->|
   |      |<-----|
   |<--4--|      |
   |      |      |
```

## Security considerations
The client and authorization server have a way to access the scope document using the `scope_secret` which should, for privacy reasons, not be exposed to the public internet.

The resource server is responsible for:
* making sure that the `humanReadable[locale]` string in the scope document is easy for the auth server to display and for the user to recognise as describing the scope they just picked
* making sure the access instructions are sufficient for the client to successfully access the scope/resource
* making sure the access it ends up granting corresponds with what the user intended in the scope selection interaction

Even though the auth server has a trust relationship with the scope picker of the resource server, it is important that it treats the `humanReadable[locale]` description as input from an untrusted source and not as a trusted part of itself. It is responsible for:
* protecting against code injection
* protecting against click-jacking
* protecting against misinformation
* clearly displaying the `humanReadable` description to the user

The client is responsible for:
* for the predance flow, ensuring the resource server is a trusted one
* for both the predance and the subdance flow, ensuring that the auth server is a trusted one
# OAuth Resource Helper
### Abstract
This specification repurposes the dynamic registration of protected resources and scopes from UMA 2.0 Federated Authorization for use in OAuth Authorization Code and Implicit grants. We define the Resource Helper as a subsystem of an OAuth authorization server that is associated with a resource server. Implementations of OAuth authorization servers can delegate the scope selection to a Resource Helper. The Authorization Server can optionally provide a Scope Info endpoint to clients, so that the client can discover which resources and scopes (and potentially also which resource server) it was given access to.

## 1.  Introduction
We embed the Resource Registration Creation Request from UMA 2.0 Federated Authorization in an OAuth 2.0 [RFC6749] Authorization Code or Implicit grant. After having been redirected from Client to Authorization Server, the Resource Owner is redirected to what we call the Resource Helper, and back to the Authorization Server, before finally being redirected back to the Client (see Figure 1).

![swimlanes](https://github.com/pondersource/surf-token-based-access/blob/main/phase-2/plantuml/swimlanes-poc-3.png)

Figure 1

## 2. The Resource Helper
The Resource Helper publishes an end point at which the resource owner can choose specific resources and scopes, which the Resource Helper then registers before redirecting the Resource Owner back to the main Authorization server.

[TODO: RH identifier and .well-known-endpoint]

### 2.1 Interaction between main AS and Resource Helper
In the OAuth 2.0 authorization code and implicit flows, the resource owner is first redirected from the Client to the main Authorization Server.

[TODO: specify front channel redirection from AS to RH-AS, binding of AS session to RH-AS session]

In the OAuth Resource Helper extension, before being redirected back to the client with a code or token, the resource owner is redirected to the authorization endpoint of the Resource Helper, where they select or mint a specific Resource Registration, in the sense of UMA 2.0 Federated Authorization. Note that the main AS and the Resource Helper may each require the RO to authenticate, even if the RO may already have authenticated to the client.

For the scopes parameter in this authorization request, the main AS MAY forward the exact value that it received from its client, OR some translation of it.

Once a resource and scope has been selected, the resource owner is redirected back to the main AS, with a scope parameter that matches the resource Id and scope that was just created [FIXME: concatenated with a “:”?] and the main authorization flow is completed as normal.

[TODO: how does the RH communicate back failure to the AS? Failure could be refusal on the part of the RH, cancellation by the user, or some other error condition the the RH identifies] 

## 3. The client-facing Scope Info API
Optionally, the main AS can make a scope info API available to its own clients, where it makes available the resource URL(s), granted scopes, and potentially also the Resource Server location as client configuration. For instance, when one main AS manages access to many Resource Servers, this could be a way for clients to discover the API location and capabilities of the Resource Server that was selected. 

## 4. Authentication Considerations
The RH is responsible for authenticating the current user during the interaction through the authorization dialog of the RH-AS. The Client SHOULD NOT be granted access to which resources for which the authentication at the RH-AS is insufficient, regardless of authentication that may happen at the main AS or at the Client.

[TODO: can we distinguish and describe typical setups and provide guidance for them?]

## 5. Security Considerations
The scope descriptions offered by the RH only attenuate the access that is granted by the main AS. The RH only helps the main AS to describe fine-grained scopes which the resource owner chooses to delegate in a language which the RS will understand.

The authentication of the user at the main AS and the authentication of the user at the RH-AS may be different, i.e. they might result in different identities. The RS, when interpreting the access token must be aware of this. The RS can learn about the identity of the user at the RH through the scope info that is opaquely passed on by the main AS in access token payload and, if applicable, in introspection information. The exact format and mechanism for this are out of the scope of this document.

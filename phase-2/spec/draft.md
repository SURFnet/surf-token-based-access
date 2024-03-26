# Scope Picker Plugin for OAuth Authorization Servers

We propose a generic plugin APIs for customisable authorization servers that allows for fine-grained and/or single-use scopes.

Authorization servers that are tightly coupled to resource servers can already define fine-grained and single-use scopes since the scopes parameter that the client sees does not need
to contain all the precise information about the authorization. For instance, the "scope" parameter in the [access token response](https://datatracker.ietf.org/doc/html/rfc6749#section-5.1) may be something as generic as "payment", but behind the scenes, fine-grained and/or single-use details would be linked to the authorization.

Generic authorization servers can often be customised with "custom scopes", but these need to be defined at installation time, so allowing for fine-grained and/or single-use scopes
would require the definition of a large if not infinite number of such custom scopes.

The [Lodging Intent Pattern](https://curity.io/resources/videos/lodging-intent-pattern/) provides a good way for OAuth deployments to support fine-grained and single-use scopes with
generic authorization servers because the complexity of the scope selection stays between the client and a custom GUI provided by the resource server. A downside of this approach is that it requires changes to the client and to the interaction between client and authorization server.

We therefore propose the "scope picker plugin", which exposes the following functionality to the authorization server:

* the scope picker, which acts as an authorization server and grants access to scope definitions.
* these scope definitions themselves don't hold any value and don't represent any authorization until the main authorization server grants an authorization that refers to one of them.
* the scope-info API which acts as a resource server, providing labels for display in the main authorization server's main consent dialog, as ad-hoc custom scopes

We separately propose the scope-info endpoint for authorization servers, where clients can discover information about the token they received, beyond the information that was
encoded in the scopes response parameter. For instance, the client may discover the internet address of the resource server, supported protocol versions, and/or the identifier
of the resource that was selected. There may still be information hidden, so the Venn diagram is:

```
/-----------------\
|                 |
|  hidden from    |
|  client         |
|                 |
| /-------------\ |
| |             | |
| |  get from   | |
| | scope-info  | |
| |             | |
| | /---------\ | |
| | | in resp | | |
| | | param   | | |
| | \---------/ | |
| |             | |
| \-------------/ |
|                 |
\-----------------/
```

In order to respond to scope-info requests from clients, the main authorization server will generally retrieve scope-info from the secondary authorization server, and add some of its own information as necessary.
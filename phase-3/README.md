# Phase 3

In phase 2 we presented our ideas for the Resource Helper and the Scope Info data structure at [OSW in Rome](https://oauth.secworkshop.events/osw2024/agenda-wednesday-osw-2024). We got some very good feedback, among others from Justin Richer.

The main points I remember off the top of my head (will double-check my notes later):
* the RH-API (see [diagram](https://github.com/SURFnet/surf-token-based-access/blob/main/phase-2/spec/OAuth%20Scope%20Info.pdf)) is essentially a resource registry, there is existing work on this, see how PAR and GNAP-RS do this
* the scope-info for client configuration sounds less interesting

[GNAP-RAR](https://datatracker.ietf.org/doc/html/draft-ietf-gnap-core-protocol#name-resource-access-rights) defines a format for the rights listed in this registry. See also Justin's [blogpost](https://justinsecurity.medium.com/applying-rar-in-oauth-2-and-gnap-76a7bae442da).


I think I remember GNAP has something similar to https://docs.kantarainitiative.org/uma/wg/rec-oauth-uma-federated-authz-2.0.html but can't find it now. I can only find the description of RAR and the [blogpost](https://docs.kantarainitiative.org/uma/wg/rec-oauth-uma-federated-authz-2.0.html#rfc.section.1.5) lists how it can be used between Client and AS, between AS and RO, and from AS to RS, but not from RS to AS.


## What to build
Idea for what to build in this phase. I'm thinking since SRAM doesn't really have an authorization server included yet,
and we want to do some novel things there, I'll keep mocking the AS completely like in phase 2.
I can change the client to one that actually gets WebDAV access to a file hosted on ownCloud.
And then an ownCloud app that:
* implements the resource helper dialog
* uses UMA-Fed-Authz to register a protected resource
* redirects back to the AS
* exposes a WebDAV API that accepts the token eventually issued by the AS

It would be nice if the AS could be somehow really connected to the testing version of SRAM.
I could define a server that you can log in to with OIDC from SRAM
https://sram.surf.nl/new-service-request

Research Drive has its own login page that redirects to SURFConext.
In my demo I would show the standard ownCloud login screen.

In ownCloud GUI it would make sense if this became a share type (just like we did with federated shares)
https://tst-miskatonic.data.surfsara.nl/

SRAM shares can only be created from within the GNAP-RH app.
But they should be listed and revokable like other shares.
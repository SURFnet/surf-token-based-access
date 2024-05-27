# Phase 3

In phase 2 we presented our ideas for the Resource Helper and the Scope Info data structure at [OSW in Rome](https://oauth.secworkshop.events/osw2024/agenda-wednesday-osw-2024). We got some very good feedback, among others from Justin Richer.

The main points I remember off the top of my head (will double-check my notes later):
* the RH-API (see [diagram](https://github.com/SURFnet/surf-token-based-access/blob/main/phase-2/spec/OAuth%20Scope%20Info.pdf)) is essentially a resource registry, there is existing work on this, see how PAR and GNAP-RS do this
* the scope-info for client configuration sounds less interesting

[GNAP-RAR](https://datatracker.ietf.org/doc/html/draft-ietf-gnap-core-protocol#name-resource-access-rights) defines a format for the rights listed in this registry. See also Justin's [blogpost](https://justinsecurity.medium.com/applying-rar-in-oauth-2-and-gnap-76a7bae442da).

Idea for what to build in this phase:
...

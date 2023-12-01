# SURF token-based access project
## Report of phase 1
Ponder Source was asked to look into the possibilities for establishing token-based access between SURF Research Cloud (SRC) in the role of client, SURF Research Drive (RD) in the role of resource server, leveraging the position of SURF Reseach Access Management (SRAM) in the role of authorisation server.

### Initial problem statement

Given the following existing infrastructure:

![existing infrastructure](./existing-infrastructure.jpeg)

Researchers from various institutes come together in a Collaborative Organisation ("CO" in SRAM terms), to work on a science project together. They use a Virtual Machine ("VM") which is provisioned through SURF Research Cloud. The researchers will then want to establish both read and write access between the VM and files from various Research Drive instances.


### Initial Exploration
In the meetings on 17 January, 3 April, 7 July we prepared a plan for a project around token-based access for mounting Research Drive WebDAV folders into SURF Research Cloud Virtual Machines:

Milestone 2.1: Token-based access to Research Drive: (30 person days) * 300 = 9,000 euros

It is already possible to access the WebDAV interface of ResearchDrive using a token, but these tokens
give root access to all documents on a user’s account, and don’t expire. In this milestone:

● We will show how short-lived tokens can be used instead
● We will show how access can be restricted to only a certain folder or share
● For selecting which resources (folders) to share with which SRAM group, this will build on
the Federated Group work from the RD-SRAM project
● We don’t expect this to require any changes to the core server code of OC-10
● Deliverable: an open source OC-10 app that can be installed on a ResearchDrive server
Milestone 2.2: Token-based remote folder in Research Cloud: (30 person days) * 300 = 9,000 euros

It is already possible to mount a WebDAV folder into a Research Cloud Workspace (VM). But now:

● We will show how to combine such a mount with a process that refreshes the short-lived
tokens, using a refresh token
● This will probably require some kind of scheduled task that refreshes the token in time
before it expires
● If the access was revoked since the last refresh, the mounted folder will be removed from
the VM
● Deliverable: a command-line tool on the VM that triggers a web view in the user’s browser,
or vice versa, plus the refresh task to be scheduled

Attachment: SURF-Ponder Source Contract 2 Milestones and deliverables (part 2, continued)

Milestone 2.3: Token-based access via SRAM: (30 person days) * 300 = 9,000 euros

As discussed, groups can play a very useful role in granting access; on the resource side (Research
Drive, see milestone 2.1) an SRAM group is given access to a given folder or share, this is something that
was already introduced in the RD-SRAM project. And on the relying party side (Research Cloud, see
milestone 2.2), access can simply be requested to “whatever resources have been tied to this group
elsewhere”, in a nicely decoupled way. Therefore:

● We will show how an authorization server can allow an authenticated user to give out an
access token to a service, delineating the scope of access in terms of choosing a specific
SRAM group from a list.
● We will probably use an off-the-shelf open source OAuth server, and have it take its
scopes configuration and user administration from the SRAM groups list and users list,
respectively.
● Deliverable: the full Proof-of-Concept in a reproducible test network (using
Docker-Compose or similar), demonstrating the integration between resource server
(Research Drive), authorization server (configured from SRAM), and relying party
(Research Cloud).
### Problem analysis

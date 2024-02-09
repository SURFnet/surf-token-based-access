In Research and Education we want to avoid coupling the authorization server too tightly to the resource server.
The organisation in control of a given resource server is often separate from the organisation in control of the authorization server, and we don't want to interlink their deployment schedules.
One authorization server deployment is often connected to a diverse set of resource servers, and having to update the authorization server software each time one of those resource servers add a new feature would be too much work.
Therefore authorization server should not have detailed knowledge about the resources and access modes a resource server can offer. Yet this knowledge is needed in order to present the GUI for reviewing and selecting the access scope in a standard OAuth authorization code flow.

We considered solving this with the Lodging Intent Pattern, a "pre-dance" where the client obtains a prefixed scope before initiating the main OAuth dance, but we rejected this approach because it creates an undesirable many-to-many relationship between clients and specific resource servers. Instead, we want to hide the resource server behind the authorization server which acts as a trusted broker in the middle between the clients of various organisations and the various resource servers of various other organisations.

Another option would be to leave scope descriptions vague and generic, but this hinders fine-grained access control and grants clients broader access scopes than strictly necessary.

We therefore want to propose an OAuth extension which adds a "scope picker" service, close to each resource server, to which the authorization server redirects the user in a "sub-dance", leaving the GUI of the authorization server generic and easy to maintain.

This works as follows: using standard authorization code flow, the client redirects the user to the authorization server with a generic scope description  - for instance 'photo', 'webdav folder', or 'ActivityPub feed'. The authorization server then redirects the user to a well-known endpoint on the scope picker service, specifying this generic scope description.

The scope picker shows a GUI in which the user can select a specific photo, folder, news feed, etc, from the ones they have access to, and to which it wants to give the client access. This structured scope is given a human-memorable name, either suggested by the scope picker or chosen by the user. This human-memorable description, a description that the resource server will understand (e.g. a local resource ID and access mode), and optionally a description that the client will understand (e.g. a WebDAV URL), are put into a JSON document for which a unique URL is minted. This URL is then used as the scope name from this point onward.

The scope picker redirects the user back to the authorization server, which is able to display the human-memorable description in its GUI, even though the authorization server doesn't fully understand what it stands for. When the user clicks 'grant access', the OAuth authorization scope dance is continued back to the client as normal.

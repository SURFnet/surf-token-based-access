# Phase-3 PoC

## Demo (work in progress)
* The PoC demo starts at a server you're SSH'ed into. You could also just use your laptop for this.
* Clone this branch of this repo, check out the `dev` branch, and cd into this folder
* [Install Deno](https://docs.deno.com/runtime/manual/getting_started/installation) and run `deno compile --allow-net ./webdav-mounter-*.ts` to build the command line application from source. This will produce an executable called `./webdav-mounter`.
* Now run the webdav-mounter command line applications:
```
./webdav-mounter
```
See [screencast](https://vimeo.com/952348865)

You also need to run the [Authorization Server](https://github.com/michielbdejong/ts-oauth2-server-example/tree/sram-auth-poc) and a public ownCloud server (see ./start-public-ownCloud.sh)

## Development
* Run the webdav-mounter application using [Deno](https://deno.com/): `deno run --allow-net ./webdav-mounter.ts`
* Build the webdav-mounter application using [Deno](https://deno.com/): `deno compile --allow-net ./webdav-mounter.ts`
* `ssh root@vultr3.pondersource.org` and run [the sram-auth-poc branch on my fork of ts-auth-server](https://github.com/michielbdejong/ts-oauth2-server-example/tree/sram-auth-poc) in the `sram-main` and `sram-web` screens
* On `ssh root@vultr3.pondersource.org`, run `psql postgresql://prisma:secret@localhost:8888/prismadb` to see the database of the AS
* see https://github.com/SURFnet/surf-token-based-access/issues for open PoC development issues

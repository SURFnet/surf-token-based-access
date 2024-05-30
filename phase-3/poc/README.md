# Phase-3 PoC

* The PoC demo starts at a server you're SSH'ed into. You could also just use your laptop for this
* Clone this branch of this repo and cd into this folder
* Build the webdav-mounter application using [Deno](https://deno.com/): `deno compile --allow-net ./webdav-mounter.ts`
* Now run it:
```
./webdav-mounter
{
  clientId: "737af593-2c7c-480c-96ce-3e83d36b735b",
  clientSecret: "ec9a9933677036f350447a152848639730ef52e26372da6e1f1324f0bc310a79ca4e30bf7d410d3da61b925492deeaca3491"... 28 more characters,
  name: "webdav-mounter-637e1df17d"
}
```


* Run the [sram-auth-poc branch on my fork of Jason Raimondi's ts-oauth2-server-example](https://github.com/michielbdejong/ts-oauth2-server-example/tree/sram-auth-poc).
* From this folder, cd into [./webdav-mounter](./webdav-mounter/) and follow the readme instructions there
* in a third window, run `psql postgresql://prisma:secret@localhost:8888/prismadb` to see the database of the AS

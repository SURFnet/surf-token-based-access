# dav-token-access

## JWT token:
you can configure the app behavior according to this table: (they should be inserted in the oc_appconfig table with `appid` = `tokenbasedav`)

|config key | description | default value |
|-----------|-------------|---------------|
|token_issuer_public_key| the public key of the certificate that sign the tokens (RS256 algorithm)||


# surf-token-based-access
## Development
```
git clone https://github.com/pondersource/dev-stock
cd dev-stock
./scripts/init-token-based-access.sh
./scripts/testing-token-based-access.sh
```
Then:
```
curl -i -X POST http://localhost:8080/index.php/apps/tokenbasedav/auth/token
curl -i -X POST http://localhost:8080/index.php/apps/tokenbasedav/auth/test
```

FIXME: update these docs with conclusions from spelonking

## JWT token:
you can configure the app behavior according to this table: (they should be inserted in the oc_appconfig table with `appid` = `tokenbasedav`)

|config key | description | default value |
|-----------|-------------|---------------|
|token_issuer_public_key| the public key of the certificate that sign the tokens (RS256 algorithm)||


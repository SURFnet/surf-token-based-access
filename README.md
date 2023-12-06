# surf-token-based-access

## Phase 1 completed
[report](https://github.com/pondersource/surf-token-based-access/blob/main/phase-1/phase-1-report.md)

## Development
```
git clone https://github.com/pondersource/dev-stock
cd dev-stock
./scripts/init-token-based-access.sh
./scripts/testing-token-based-access.sh
```
Then:
```
echo "{\"token\":`curl -X POST http://localhost:8080/index.php/apps/tokenbaseddav/auth/token`}" > token.json
curl -X POST  -H "Content-Type:application/json" --data-binary @token.json http://localhost:8080/index.php/apps/tokenbaseddav/auth/test
rm token.json
```

## JWT token:
you can configure the app behavior according to this table: (they should be inserted in the oc_appconfig table with `appid` = `tokenbaseddav`)

|config key | description | default value |
|-----------|-------------|---------------|
|token_issuer_public_key| the public key of the certificate that sign the tokens (RS256 algorithm)||


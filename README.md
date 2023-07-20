# dav-token-access

## JWT token:
There is a configuration inside config.php to set the token encoding algorithm: 

> dav.JWTEncodeType

the allowed values are one of the `RS256`, `HS256`, and `Auto`. the default one is `Auto`.

If you choose the `RS256`, you must set the `ssl_pass_phrase` and `ssl_cert_path` in the oc_appconfig table. 
If you choose the `HS256`, there is no need to config anything. The encryption key will be automatically generated.
If the `Auto` is selected the app will check the app config table. if the RS256 requirement is available it will be selected otherwise the "HS256" will be applied on the token.

you can configure the app behavior according to this table: (they should be inserted in the oc_appconfig table with `appid` = `tokenbasedav`)

|config key | description | default value |
|-----------|-------------|---------------|
|ssl_pass_phrase| The secure password belongs to the SSL certificate (RS256 algorithm)||
|ssl_cert_path|the address of the private key of the SSL certificate (RS256 algorithm)||
|encoding_secret| the key that is used to encrypt the JWT token using the HS256 algorithm|It will be generated automatically|
|token_ttl| the time to live of the generated token| 8 * 60 *60 (8 hours)|

use this curl command to generate the token: 
```shell
curl --request POST \
  --url http://localhost:8080/index.php/apps/tokenbasedav/auth/token \
  --header 'Content-Type: application/json'  \
  --data ' {
	 "username":"einstein",
	 "password": "relativity" 
}
```

import {
 handleExpressResponse,
 handleExpressError,
} from "npm:@jmondi/oauth2-server/express";

import {  default as express } from "npm:express";

const app = express();

app.post("/token", async (req: Express.Request, res: Express.Response) => {
 const request = requestFromExpress(req);
 try {
  const oauthResponse = await authorizationServer.respondToAccessTokenRequest(request);
  return handleExpressResponse(res, oauthResponse);
 } catch (e) {
  handleExpressError(e, res);
  return;
 }
});

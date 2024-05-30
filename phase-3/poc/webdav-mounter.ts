import { randomBytes } from "node:crypto";
const name = `webdav-mounter-${randomBytes(5).toString('hex')}`;

const jsonResponse = await fetch("https://sram-auth-poc.pondersource.net/api/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name,
  }),
});
const { clientId, clientSecret } = await jsonResponse.json();
const ticket = randomBytes(12).toString('hex');
// console.log(jsonData);
console.log(`Please open https://sram-auth-poc.pondersource.net/api/front?client_id=${clientId}&ticket=${ticket} in your browser.`);

async function checkTicket(clientId: string, clientSecret: string, ticket: string) {
  const jsonResponse = await fetch("https://sram-auth-poc.pondersource.net/api/ticket", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      clientId,
      clientSecret,
      ticket,
    }),
  });
  const jsonData = await jsonResponse.json();
  console.log(jsonData);
  return jsonData.done;
}

let done = await checkTicket(clientId, clientSecret, ticket);
while (done !== true) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Checking...");
  done = await checkTicket(clientId, clientSecret, ticket);
}
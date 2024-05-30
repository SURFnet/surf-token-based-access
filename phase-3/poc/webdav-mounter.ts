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
const jsonData = await jsonResponse.json();
jsonData.name = name;
console.log(jsonData);
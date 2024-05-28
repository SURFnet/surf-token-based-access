import bcryptjs from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

void (async function () {
  const passwordHash = await bcryptjs.hash("password123", 10);

  const jasonId = "dd74961a-c348-4471-98a5-19fc3c5b5079";
  await prisma.user.upsert({
    where: { id: jasonId },
    update: { passwordHash },
    create: {
      id: jasonId,
      email: "jason@example.com",
      createdIP: "127.0.0.1",
      passwordHash,
    },
  });

  const clientId = "0e2ec2df-ee53-4327-a472-9d78c278bdbb";
  await prisma.oAuthClient.upsert({
    where: { id: clientId },
    update: {},
    create: {
      id: clientId,
      name: "Sample Client",
      secret: null,
      allowedGrants: ["authorization_code", "client_credentials", "refresh_token"],
      redirectUris: ["http://localhost:5173/callback"],
    },
  });

  const clientId2 = "9aeb7ebf-09e9-4e96-88a7-b3cf9f9739a2";
  await prisma.oAuthClient.upsert({
    where: { id: clientId2 },
    update: {},
    create: {
      id: clientId2,
      name: "WebDAV Mounter",
      secret: null,
      allowedGrants: ["authorization_code", "client_credentials", "refresh_token"],
      redirectUris: ["http://localhost:8080/callback"],
    },
  });

  const scopeId = "c3d49dba-53c8-4d08-970f-9c567414732e";
  await prisma.oAuthScope.upsert({
    where: { id: scopeId },
    update: {},
    create: {
      id: scopeId,
      name: "contacts.read",
    },
  });

  const scopeId2 = "22861a6c-dd8d-47b3-be1f-a3e7b67943bc";
  await prisma.oAuthScope.upsert({
    where: { id: scopeId2 },
    update: {},
    create: {
      id: scopeId2,
      name: "contacts.write",
    },
  });

  const scopeId3 = "d9b613f5-9b63-4044-b6f2-d6a77efd5d56";
  await prisma.oAuthScope.upsert({
    where: { id: scopeId3 },
    update: {},
    create: {
      id: scopeId3,
      name: "webdav-folder",
    },
  });
})();

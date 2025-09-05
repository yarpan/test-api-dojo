import { test as setup, expect } from "@playwright/test";
import fs from "fs";

const tokenFile = ".auth/resfulBookerUser.json";

setup("authentification", async ({ request }) => {
  const response = await request.post("/auth", {
    data: {
      username: process.env.RESTFUL_BOOKER_ADMIN,
      password: process.env.RESTFUL_BOOKER_ADMIN_PASSWORD,
    },
    headers: { "Content-Type": "application/json" },
  });
  expect(response.status()).toBe(200);
  const resBody = await response.json();
  const token =  resBody.token;
  fs.writeFileSync(tokenFile, token);
});

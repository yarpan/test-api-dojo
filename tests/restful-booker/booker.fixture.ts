import fs from "fs";
import { APIResponse, test as base, request as newRequest, } from "@playwright/test";


type Fixtures = {
  token: string;
  bookingId: string;
};

export const test = base.extend<Fixtures>({
  token: "Pavlo",
  request: async ({ request, token }, use) => {
    if (fs.existsSync("tests/restfull-booker/.token") === false) {
      const result: APIResponse = await request.post("/auth", {
        data: {
          username: "admin",
          password: "password123",
        },
      });

      const json = await result.json();
      token = json.token;
      fs.writeFileSync("tests/restfull-booker/.token", token);

    } else {

      token = fs.readFileSync("tests/restfull-booker/.token", {
        encoding: "utf-8",

      });

      console.log(token);
    }

    console.log("-- creating new context --- ");

    const requestWithToken = await newRequest.newContext({
      extraHTTPHeaders: {
        Cookie: `token=${token}`,
      },
    });

    console.log("-- created new context --- ");

    await use(requestWithToken); // return

    console.log("--- test ended ---");
  },


  bookingId: async ({ request }, use) => {
    const response = await request.post("/booking", {
      data: {
        firstname: "Jim",
        lastname: "Brown",
        totalprice: 111,
        depositpaid: true,
        bookingdates: {
          checkin: "2018-01-01",
          checkout: "2019-01-01",
        },
        additionalneeds: "Breakfast",
      },
      failOnStatusCode: true,
    });

    const bookingid = (await response.json()).bookingid;

    await use(bookingid);
  },
});

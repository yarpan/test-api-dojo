import { test, request, APIResponse, APIRequestContext, expect, } from "@playwright/test";
import Joi from "joi";


let token;

test.beforeAll(async ({ request }) => {
  test.setTimeout(60_000);

  const result: APIResponse = await request.post("/auth", {
    data: {
      username: "admin",
      password: "password123",
    },
  });

  const json = await result.json();
  token = json.token;
});



test("RB-0001 get auth token", async () => {
  const context: APIRequestContext = await request.newContext({
    baseURL: "https://restful-booker.herokuapp.com",
  });

  const result: APIResponse = await context.post("/auth", {
    data: {
      username: "admin",
      password: "password123",
    },
  });

  expect(result.status()).toBe(200);

  const json = await result.json();
  const token = json.token;

  expect(token).toBeDefined();
});



test("create booking, headers should exist", async ({ request }) => {
  const result = await request.post("/booking", {
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

  const expectedHeaders = {
    "content-length": "196",
    "content-type": "application/json; charset=utf-8",
    date: "Mon, 11 Aug 2025 17:42:22 GMT",
    etag: 'W/"c4-I7xOw4G7gM4dGHKexg/muK7tR60"',
    nel: '{"report_to":"heroku-nel","response_headers":["Via"],"max_age":3600,"success_fraction":0.01,"failure_fraction":0.1}',
    "report-to":
      '{"group":"heroku-nel","endpoints":[{"url":"https://nel.heroku.com/reports?s=fmmZHG8QuHAVRjbASiGErEQfhF%2FW5w7vTuqsv%2Fq4EC0%3D\\u0026sid=c46efe9b-d3d2-4a0c-8c76-bfafa16c5add\\u0026ts=1754934142"}],"max_age":3600}',
    "reporting-endpoints":
      'heroku-nel="https://nel.heroku.com/reports?s=fmmZHG8QuHAVRjbASiGErEQfhF%2FW5w7vTuqsv%2Fq4EC0%3D&sid=c46efe9b-d3d2-4a0c-8c76-bfafa16c5add&ts=1754934142"',
    server: "Heroku",
    via: "1.1 heroku-router",
    "x-powered-by": "Express",
  };

  const headers = result.headers();

  for (const key in expectedHeaders) {
    expect(headers[key]).toBeDefined();
  }

  expect(headers).toMatchObject(expectedHeaders);
});

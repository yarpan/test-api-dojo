import { expect } from "@playwright/test";
import {test } from "./booker.fixture";
import Joi from "joi";

test("create booking, json schema should be valid", async ({ request }) => {
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

  const json = await result.json();

  const bookingSchema = Joi.object({
    additionalneeds: Joi.string().required(),
    totalprice: Joi.number().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    depositpaid: Joi.boolean().required(),
    bookingdates: Joi.object({
      checkin: Joi.date().required(),
      checkout: Joi.date().required(),
    }),
  });

  const schema = Joi.object({
    bookingid: Joi.number().required(),
    booking: bookingSchema,
  });

  const validationResult = schema.validate(json);

  expect(validationResult.error).toBeUndefined();
});

test("update existing booking", async ({ request }) => {
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

  //   const stringBody = await result.text();
  //   expect(stringBody).toBeTruthy();
  //   expect(stringBody.length).toBe(0);

  const bookingid = (await result.json()).bookingid;
  expect(bookingid).toBeDefined();

  const updateResult = await request.put(`/booking/${bookingid}`, {
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
    headers: {
      Cookie: `token=${token}`,
    },
  });

  expect(updateResult.status()).toBe(200);
});

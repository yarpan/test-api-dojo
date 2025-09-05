import { test, expect } from "@playwright/test";
import * as schemas from "../../testCriteria/schemas/bookingSchemas.ts";
import { expectedHeaders } from "../../testCriteria/headers/bookingHeaders.ts";
import { generateClient } from "../../helpers/bookingDataGenerator.ts";
import fs from "fs";

let bookingId;
const tokenFile = ".auth/resfulBookerUser.json";
const token = fs.readFileSync(tokenFile, "utf-8");

test(
  "RB-001 get booking ids, headers should exist",
  { tag: ["@smoke", "@regression"] },
  async ({ request }) => {
    const response = await request.get("/booking");
    expect(response.status()).toBe(200);
    const receivedHeaders = response.headers();
    expect(receivedHeaders).toMatchObject(expectedHeaders);
  }
);

test("RB-002-1 create booking, json schema should be valid", async ({
  request,
}) => {
  const client = generateClient();
  const response = await request.post("/booking", {
    data: client,
  });
  expect(response.status()).toBe(200);
  const createdBooking = await response.json();
  const validationResult =
    schemas.createdBookingSchema.validate(createdBooking);
  expect(validationResult.error).toBeUndefined();
});

test.describe.serial(
  "RB-003 booking CRUD",
  { tag: ["@smoke", "@regression"] },
  () => {
    let client;
    let updatedBooking;
    test("RB-003-1 create booking", async ({ request }) => {
      client = generateClient();
      const response = await request.post("/booking", {
        data: client,
      });
      expect(response.status()).toBe(200);
      const createdBooking = await response.json();
      bookingId = createdBooking.bookingid;
      expect(bookingId).toBeDefined();
      expect(createdBooking.booking).toMatchObject(client);
    });

    test("RB-003-2 get by booking id", async ({ request }) => {
      const response = await request.get(`/booking/${bookingId}`);
      expect(response.status()).toBe(200);
      const resBody = await response.json();
      expect(resBody).toMatchObject(client);
    });

    test("RB-003-3 update booking", async ({ request }) => {
      client = generateClient();
      const response = await request.put(`/booking/${bookingId}`, {
        data: client,
        headers: {
          Cookie: `token=${token}`,
        },
      });
      expect(response.status()).toBe(200);
      updatedBooking = await response.json();
      expect(updatedBooking).toMatchObject(client);
    });

    test("RB-003-4 partial update booking", async ({ request }) => {
      const partialData = {
        firstname: "Updated First Name",
        lastname: "Updated Last Name",
      };
      const response = await request.patch(`/booking/${bookingId}`, {
        data: partialData,
        headers: {
          Cookie: `token=${token}`,
        },
      });
      expect(response.status()).toBe(200);
      const partialUpdatedBooking = await response.json();
      expect(partialUpdatedBooking.firstname).toEqual(partialData.firstname);
      expect(partialUpdatedBooking.lastname).toEqual(partialData.lastname);
      expect(partialUpdatedBooking.totalprice).toEqual(updatedBooking.totalprice);
      expect(partialUpdatedBooking.depositpaid).toEqual(updatedBooking.depositpaid);
    });

    test("RB-003-5 delete booking", async ({ request }) => {
      const response = await request.delete(`/booking/${bookingId}`, {
        headers: {
          Cookie: `token=${token}`,
        },
      });
      expect(response.status()).toBe(201);
    });

    test("RB-003-6 get by booking id after deletion", async ({ request }) => {
      const response = await request.get(`/booking/${bookingId}`);
      expect(response.status()).toBe(404);
    });
  }
);

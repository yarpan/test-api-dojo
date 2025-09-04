import { APIResponse, expect } from "playwright/test";
import { test } from "./booker-fixture";

const testData = [
  {
    testId: "RB-0003",
    suffix: "should be 200",
    data: {
      firstname: "Jim",
      lastname: "Brown",
      totalprice: 50,
      depositpaid: true,
      bookingdates: {
        checkin: "2022-01-01",
        checkout: "2023-01-01",
      },
      additionalneeds: "Breakfast",
    },
    expect: async (response: APIResponse) => {
      expect(response.status()).toBe(200);
      const bookingid = (await response.json()).bookingid;
      expect(bookingid).toBeDefined();
    },
  },
  {
    testId: "RB-0004",
    suffix: "should be 500",
    data: {
      totalprice: 50,
      depositpaid: true,
      bookingdates: {
        checkin: "2022-01-01",
        checkout: "2023-01-01",
      },
      additionalneeds: "Breakfast",
    },
    expect: async (response: APIResponse) => {
      expect(response.status()).toBe(500);
    },
  },
];
for (const { testId, suffix, data, expect } of testData) {
  test(`${testId} create booking - ${suffix}`, async ({ request }) => {
    const response = await request.post("/booking", {
      data: data,
    });

    await expect(response);
  });
}

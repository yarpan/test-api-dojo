import { test, expect } from '@playwright/test';
import { getDateWithOffset } from '../../helpers/date-manager';

const apiKey = 'JzaeM8dMrWZzUG3ZdpLQa2epUNbO13aSFosayUY4';



test.describe('APOD: Tests with date ranges', () => {

  const testData = [
    {
      testId: "ID-1001",
      params: {
        api_key: apiKey,
        start_date: getDateWithOffset(-2),
        end_date: getDateWithOffset(-1),
        thumbs: "True",
      },
    },
    {
      testId: "ID-1002",
      params: {
        api_key: apiKey,
        start_date: getDateWithOffset(-20),
        end_date: getDateWithOffset(-10),
        thumbs: "False",
      },
    },
    {
      testId: "ID-1003",
      params: {
        api_key: apiKey,
        start_date: getDateWithOffset(-200),
        end_date: getDateWithOffset(-100),
        thumbs: "False",
      },
    },
  ];

  for (const { testId, params } of testData) {
    test(`${testId} picture of the day between ${params.start_date} and ${params.end_date}`, async ({ request }) => {
      const response = await request.get(`/planetary/apod`, {
        params: params,
      });

      const body = await response.json();

      expect(response.status()).toBe(200);

      for (const item of body) {
        expect(item).toHaveProperty("date");
        expect(typeof item.date).toBe("string");

      }

      const headers = response.headers();
      expect(headers["content-type"]).toBe("application/json");

    });
  }
});



test.describe('APOD: Tests with date ranges [NEGATIVE]', () => {

  const testData = [
    {
      testId: "ID-2001",
      params: {
        api_key: apiKey,
        start_date: getDateWithOffset(-1),
        end_date: getDateWithOffset(1),
        thumbs: "True",
      },
    },
    {
      testId: "ID-2002",
      params: {
        api_key: apiKey,
        start_date: getDateWithOffset(1),
        end_date: getDateWithOffset(2),
        thumbs: "False",
      },
    },
    {
      testId: "ID-2003",
      params: {
        api_key: apiKey,
        start_date: getDateWithOffset(-100),
        end_date: getDateWithOffset(100),
        thumbs: "False",
      },
    },
  ];

  for (const { testId, params } of testData) {
    test(`${testId} picture of the day between ${params.start_date} and ${params.end_date}`, async ({ request }) => {
      const response = await request.get(`/planetary/apod`, {
        params: params,
      });

      const body = await response.json();

      expect(response.status()).toBe(400);
      expect(body.msg).toMatch(/^Date must be between Jun 16, 1995 and/);

      const headers = response.headers();
      expect(headers["content-type"]).toBe("application/json");

    });
  }
});



test.describe('APOD: Tests with results count', () => {

  const testData = [
    {
      testId: "ID-1011",
      params: {
        api_key: apiKey,
        count: 1,
        thumbs: "True",
      },
    },
    {
      testId: "ID-1012",
      params: {
        api_key: apiKey,
        count: 33,
        thumbs: "False",
      },
    },
    {
      testId: "ID-1013",
      params: {
        api_key: apiKey,
        count: 100,
        thumbs: "False",
      },
    },
  ];

  for (const { testId, params } of testData) {
    test(`${testId} picture of the day with count ${params.count} of results`, async ({ request }) => {
      const response = await request.get(`/planetary/apod`, {
        params: params,
      });

      const body = await response.json();
      expect(response.status()).toBe(200);

      const headers = response.headers();
      expect(headers["content-type"]).toBe("application/json");

    });
  }

});



test.describe('APOD: Tests with results count [NEGATIVE]', () => {

  const testData = [
    {
      testId: "ID-2011",
      params: {
        api_key: apiKey,
        count: 0,
        thumbs: "True",
      },
    },
    {
      testId: "ID-2012",
      params: {
        api_key: apiKey,
        count: -1,
        thumbs: "False",
      },
    },
    {
      testId: "ID-2013",
      params: {
        api_key: apiKey,
        count: 101,
        thumbs: "False",
      },
    },
  ];

  for (const { testId, params } of testData) {
    test(`${testId} picture of the day with count ${params.count} of results`, async ({ request }) => {
      const response = await request.get(`/planetary/apod`, {
        params: params,
      });

      const body = await response.json();
      expect(response.status()).toBe(400);
      expect(body.msg).toMatch(/^Count must be positive and cannot exceed 100/);

      const headers = response.headers();
      expect(headers["content-type"]).toBe("application/json");

    });
  }

});


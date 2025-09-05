import { expect } from "@playwright/test";

export const expectedHeaders = {
  "content-length": expect.any(String),
  "content-type": "application/json; charset=utf-8",
  date: expect.any(String),
  etag: expect.any(String),
  nel: expect.any(String),
  server: "Heroku",
  via: "1.1 heroku-router",
  "x-powered-by": "Express",
};

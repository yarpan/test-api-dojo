import {
    test,
    request,
    APIResponse,
    APIRequestContext,
    expect,
} from "@playwright/test";
import Joi from "joi";

/*
Creates a new auth token to use for access to the PUT and DELETE /booking

post
https://restful-booker.herokuapp.com/auth
Example 1:
curl -X POST \
  https://restful-booker.herokuapp.com/auth \
  -H 'Content-Type: application/json' \
  -d '{
    "username" : "admin",
    "password" : "password123"
}'
*/

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

/*
post
https://restful-booker.herokuapp.com/booking
curl -X POST \
  https://restful-booker.herokuapp.com/booking \
  -H 'Content-Type: application/json' \
  -d '{
    "firstname" : "Jim",
    "lastname" : "Brown",
    "totalprice" : 111,
    "depositpaid" : true,
    "bookingdates" : {
        "checkin" : "2018-01-01",
        "checkout" : "2019-01-01"
    },
    "additionalneeds" : "Breakfast"
}'
*/

/*
put
https://restful-booker.herokuapp.com/booking/:id
JSON example usage:
XML example usage:
URLencoded example usage:
curl -X PUT \
  https://restful-booker.herokuapp.com/booking/1 \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Cookie: token=abc123' \
  -d '{
    "firstname" : "James",
    "lastname" : "Brown",
    "totalprice" : 111,
    "depositpaid" : true,
    "bookingdates" : {
        "checkin" : "2018-01-01",
        "checkout" : "2019-01-01"
    },
    "additionalneeds" : "Breakfast"
}'
*/
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
        "report-to": '{"group":"heroku-nel","endpoints":[{"url":"https://nel.heroku.com/reports?s=fmmZHG8QuHAVRjbASiGErEQfhF%2FW5w7vTuqsv%2Fq4EC0%3D\\u0026sid=c46efe9b-d3d2-4a0c-8c76-bfafa16c5add\\u0026ts=1754934142"}],"max_age":3600}',
        "reporting-endpoints": 'heroku-nel="https://nel.heroku.com/reports?s=fmmZHG8QuHAVRjbASiGErEQfhF%2FW5w7vTuqsv%2Fq4EC0%3D&sid=c46efe9b-d3d2-4a0c-8c76-bfafa16c5add&ts=1754934142"',
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


test("update existing booking", async ({ request, token }) => {
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

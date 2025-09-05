import { faker } from "@faker-js/faker";
import { getDateFromToday } from "../helpers/dateHelper";

const needsOptions = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Late checkout",
  "Extra pillow",
  "Spa",
];

export function genCustomer() {
  return {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    totalprice: Math.round(Number(faker.commerce.price({ min: 100, max: 500 }))),
    depositpaid: true,
    bookingdates: {
      checkin: getDateFromToday(1),
      checkout: getDateFromToday(4),
    },
    additionalneeds: faker.helpers.arrayElement(needsOptions),
  };
}

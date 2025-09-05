import { faker } from "@faker-js/faker";

export class BookingFactory {
  static createValidBooking() {
    return {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      totalprice: faker.number.int({ min: 10, max: 1000 }),
      depositpaid: true,
      bookingdates: {
        checkin: "2018-01-01",
        checkout: "2019-01-01",
      },
      additionalneeds: "Breakfast",
    };
  }

  static createValidBookings(bookingCount: number) {
    const arr: Array<any> = [];

    for (const iter of new Array(bookingCount)) {
      const booking = this.createValidBooking();
      arr.push(booking);
    }

    return arr;
  }

  static createBookingWithoutDates() {
    return {
      firstname: "Jim",
      lastname: "Brown",
      totalprice: 111,
      depositpaid: true,
      additionalneeds: "Breakfast",
    };
  }

  static createBookingWithInvalidData() {
    return {
      firstname: -1,
      lastname: true,
      totalprice: 0,
      depositpaid: true,
      bookingdates: {
        checkin: "2018-01-01",
        checkout: "2019-01-01",
      },
      additionalneeds: "Breakfast",
    };
  }
}

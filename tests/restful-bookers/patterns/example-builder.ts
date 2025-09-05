
interface BookingDates {
  checkin: string;
  checkout: string;
}

interface Booking {
  firstname?: string;
  lastname?: string;
  totalprice?: number;
  depositpaid?: boolean;
  bookingdates?: BookingDates;
  additionalneeds?: string;
  requestDate?: string;
  isActive: boolean;
  preBookingDates?: Array<string>;
}

export class BookingBuilder {
  private data: Booking;

  constructor() {
    this.data = {
      requestDate: new Date().getTime().toString(),
      isActive: true,
    };
  }

  withPreBookingDate(dates: Array<any>) {
    this.data.preBookingDates = dates;
    return this;
  }
  withFirstName(name: string) {
    this.data.firstname = name;
    return this;
  }

  withUser(fullName: string) {
    // user retrieving logic
  }

  withLastName(lastName: string) {
    this.data.lastname = lastName;
    return this;
  }

  withTotalPrice(price: number) {
    this.data.totalprice = price;
    return this;
  }

  withIsDepositPaid(isPaid: boolean) {
    this.data.depositpaid = isPaid;
    return this;
  }
  withBookingDates(dates: BookingDates) {
    this.data.bookingdates = dates;
    return this;
  }

  withAdditionalNeeds(needs: string) {
    this.data.additionalneeds = needs;
    return this;
  }

  build() {
    if (this.data.isActive === false) {
      throw Error("IsActive should be true");
    }
    return this.data;
  }
}



const booking = new BookingBuilder()
  .withFirstName("John")
  .withBookingDates({
    checkin: "2002",
    checkout: "2003",
  })
  .withLastName("Smith")
  .build();

console.log(booking);

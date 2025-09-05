import { test, expect } from '@playwright/test';

const BASE_URL = 'https://restful-booker.herokuapp.com';
const USERNAME = 'pinokkio';
const PASSWORD = 'PapaKarlo';

interface BookingData {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: {
    checkin: string;
    checkout: string;
  };
  additionalneeds: string;
}

interface AuthResponse {
  token: string;
}

test.describe('RESTful Booker API Tests', () => {
  let authToken: string;
  let createdBookingId: number;

  test.beforeAll(async ({ request }) => {
    // Authenticate and get token
    const authResponse = await request.post(`${BASE_URL}/auth`, {
      data: {
        username: USERNAME,
        password: PASSWORD
      }
    });

    expect(authResponse.ok()).toBeTruthy();
    const authData: AuthResponse = await authResponse.json();
    authToken = authData.token;
    expect(authToken).toBeTruthy();
  });

  test('should authenticate user successfully', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/auth`, {
      data: {
        username: USERNAME,
        password: PASSWORD
      }
    });

    expect(response.ok()).toBeTruthy();
    const data: AuthResponse = await response.json();
    expect(data.token).toBeTruthy();
    expect(typeof data.token).toBe('string');
  });

  test('should get all booking IDs', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/booking`);

    expect(response.ok()).toBeTruthy();
    const bookingIds = await response.json();
    expect(Array.isArray(bookingIds)).toBeTruthy();
    expect(bookingIds.length).toBeGreaterThan(0);
    
    // Verify each ID is a number
    bookingIds.forEach((id: any) => {
      expect(typeof id).toBe('number');
      expect(id).toBeGreaterThan(0);
    });
  });

  test('should get a specific booking by ID', async ({ request }) => {
    // First get all booking IDs to find a valid one
    const idsResponse = await request.get(`${BASE_URL}/booking`);
    const bookingIds = await idsResponse.json();
    const testBookingId = bookingIds[0];

    const response = await request.get(`${BASE_URL}/booking/${testBookingId}`);

    expect(response.ok()).toBeTruthy();
    const booking = await response.json();
    
    // Verify booking structure
    expect(booking).toHaveProperty('firstname');
    expect(booking).toHaveProperty('lastname');
    expect(booking).toHaveProperty('totalprice');
    expect(booking).toHaveProperty('depositpaid');
    expect(booking).toHaveProperty('bookingdates');
    expect(booking).toHaveProperty('additionalneeds');
    
    // Verify bookingdates structure
    expect(booking.bookingdates).toHaveProperty('checkin');
    expect(booking.bookingdates).toHaveProperty('checkout');
  });

  test('should create a new booking', async ({ request }) => {
    const newBooking: BookingData = {
      firstname: 'John',
      lastname: 'Doe',
      totalprice: 150,
      depositpaid: true,
      bookingdates: {
        checkin: '2024-01-15',
        checkout: '2024-01-20'
      },
      additionalneeds: 'Breakfast included'
    };

    const response = await request.post(`${BASE_URL}/booking`, {
      data: newBooking,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(response.ok()).toBeTruthy();
    const createdBooking = await response.json();
    
    expect(createdBooking).toHaveProperty('bookingid');
    expect(typeof createdBooking.bookingid).toBe('number');
    expect(createdBooking.bookingid).toBeGreaterThan(0);
    
    // Store the created booking ID for later tests
    createdBookingId = createdBooking.bookingid;
    
    // Verify the booking data matches what was sent
    expect(createdBooking.booking).toEqual(newBooking);
  });

  test('should update an existing booking', async ({ request }) => {
    // Skip if no booking was created in previous test
    test.skip(!createdBookingId, 'No booking ID available from create test');

    const updatedBooking: BookingData = {
      firstname: 'Jane',
      lastname: 'Smith',
      totalprice: 200,
      depositpaid: false,
      bookingdates: {
        checkin: '2024-02-01',
        checkout: '2024-02-05'
      },
      additionalneeds: 'Late check-in'
    };

    const response = await request.put(`${BASE_URL}/booking/${createdBookingId}`, {
      data: updatedBooking,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${authToken}`
      }
    });

    expect(response.ok()).toBeTruthy();
    const updatedResponse = await response.json();
    
    // Verify the updated data
    expect(updatedResponse).toEqual(updatedBooking);
  });

  test('should partially update a booking', async ({ request }) => {
    // Skip if no booking was created in previous test
    test.skip(!createdBookingId, 'No booking ID available from create test');

    const partialUpdate = {
      firstname: 'Michael',
      additionalneeds: 'Airport transfer'
    };

    const response = await request.patch(`${BASE_URL}/booking/${createdBookingId}`, {
      data: partialUpdate,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${authToken}`
      }
    });

    expect(response.ok()).toBeTruthy();
    const updatedResponse = await response.json();
    
    // Verify only the specified fields were updated
    expect(updatedResponse.firstname).toBe(partialUpdate.firstname);
    expect(updatedResponse.additionalneeds).toBe(partialUpdate.additionalneeds);
    
    // Verify other fields remain unchanged
    expect(updatedResponse.lastname).toBe('Smith');
    expect(updatedResponse.totalprice).toBe(200);
  });

  test('should delete a booking', async ({ request }) => {
    // Skip if no booking was created in previous test
    test.skip(!createdBookingId, 'No booking ID available from create test');

    const response = await request.delete(`${BASE_URL}/booking/${createdBookingId}`, {
      headers: {
        'Cookie': `token=${authToken}`
      }
    });

    expect(response.status()).toBe(201);
    
    // Verify the booking is actually deleted by trying to get it
    const getResponse = await request.get(`${BASE_URL}/booking/${createdBookingId}`);
    expect(getResponse.status()).toBe(404);
  });

  test('should handle invalid booking ID gracefully', async ({ request }) => {
    const invalidId = 99999;
    
    const response = await request.get(`${BASE_URL}/booking/${invalidId}`);
    expect(response.status()).toBe(404);
  });

  test('should handle invalid authentication', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/auth`, {
      data: {
        username: 'invalid',
        password: 'invalid'
      }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.reason).toBe('Bad credentials');
  });

  test('should validate required fields for creating booking', async ({ request }) => {
    const invalidBooking = {
      firstname: 'John'
      // Missing required fields
    };

    const response = await request.post(`${BASE_URL}/booking`, {
      data: invalidBooking,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // The API might accept partial data or return an error
    // This test documents the current behavior
    console.log('Response status:', response.status());
    console.log('Response body:', await response.text());
  });
});

import { test, expect } from '@playwright/test';


const baseUrl = 'https://api.nasa.gov/planetary/apod';
const apiKey = 'JzaeM8dMrWZzUG3ZdpLQa2epUNbO13aSFosayUY4';


test.describe('APOD: Astronomy Picture of the Day', () => {

  test('Picture of the day', 
    {
      tag: ['@api', '@smoke'],
      annotation: { 
        type: 'description', 
        description: 'This test checks the picture of the day from NASA API' },
    },
      async ({ request }) => {

    const response = await request.get(`${baseUrl}?api_key=${apiKey}`);
    const json = await response.json();

    expect(response.status()).toBe(200);
    expect(json).toHaveProperty('title');
    expect(json).toHaveProperty('url');
    expect(json).toHaveProperty('explanation');

  });


  test('Picture of the day 2025-08-01', async ({ request }) => {

    const response = await request.get(`${baseUrl}?api_key=${apiKey}&date=2025-08-01`);
    const json = await response.json();

    expect(response.status()).toBe(200);
    expect(json).toHaveProperty('title');
    expect(json).toHaveProperty('url');
    expect(json).toHaveProperty('explanation');

  });


  test('Picture of the day 2025-07-01...2025-08-01', async ({ request }) => {

    const start_date = '2025-07-01';
    const end_date = '2025-08-01';

    const response = await request.get(`planetary/apod`, {
      params: {
        api_key: apiKey,
        start_date: start_date,
        end_date: end_date
      }
    });

    const json = await response.json();

    expect(response.status()).toBe(200);
    expect(Array.isArray(json)).toBe(true);
    expect(json.length).toBeGreaterThan(0);
    expect(json[0]).toHaveProperty('title');
    expect(json[0]).toHaveProperty('date');
    expect(json[0]).toHaveProperty('explanation');

  });


  test('Picture of the day - count=3', async ({ request }) => {

    const response = await request.get(`${baseUrl}?api_key=${apiKey}&count=3`);
    const json = await response.json();

    expect(response.status()).toBe(200);
    expect(Array.isArray(json)).toBe(true);
    expect(json.length).toBeGreaterThan(0);
    expect(json[0]).toHaveProperty('title');
    expect(json[0]).toHaveProperty('date');
    expect(json[0]).toHaveProperty('explanation');

  });


  test('Picture of the day - count=33', async ({ request }) => {

    const response = await request.get(`${baseUrl}?api_key=${apiKey}&count=33`);
    const json = await response.json();

    expect(response.status()).toBe(200);
    expect(Array.isArray(json)).toBe(true);
    expect(json.length).toBeGreaterThan(0);
    expect(json[0]).toHaveProperty('title');
    expect(json[0]).toHaveProperty('date');
    expect(json[0]).toHaveProperty('explanation');

  });


  test('Picture of the day - count=101 [negative]', async ({ request }) => {

    const response = await request.get(`${baseUrl}?api_key=${apiKey}&count=101`);
    const json = await response.json();
    
    expect(response.status()).toBe(400);
    expect(json.msg).toBe('Count must be positive and cannot exceed 100');

  });


  test('Picture of the day - tomorrow [negative]', async ({ request }) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];

    const response = await request.get(`${baseUrl}?api_key=${apiKey}&date=${dateString}`);
    const json = await response.json();

    expect(response.status()).toBe(400);
    expect(json.msg).toMatch(/^Date must be between Jun 16, 1995 and/);

  });

});

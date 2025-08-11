import { test, expect } from '@playwright/test';



test('get post by Id', async ({ request }) => {

  const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');

  const json = await response.json();

  expect(response.status()).toBe(200);
  expect(json).toHaveProperty('title');
  expect(json).toHaveProperty('body');

});


test('create post', async ({ request }) => {

  const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
    data:
    {
      "title": "foo",
      "body": "bar",
      "userId": 1
    }
  });

  const json = await response.json();

  expect(response.status()).toBe(201);
  expect(json).toHaveProperty('title');
  expect(json).toHaveProperty('body');

});


test('update post', async ({ request }) => {

  const response = await request.put('https://jsonplaceholder.typicode.com/posts/1', {
    data:
    {
      "id": 1,
      "title": "foo",
      "body": "bar",
      "userId": 1
    }
  });

  const json = await response.json();

  expect(response.status()).toBe(200);
  expect(json).toHaveProperty('title');
  expect(json).toHaveProperty('body');

});


test('update part post', async ({ request }) => {

  const response = await request.patch('https://jsonplaceholder.typicode.com/posts/1', {
    data:
    {
      "id": 1,
      "title": "foo",
      "userId": 1
    }
  });

  const json = await response.json();

  expect(response.status()).toBe(200);
  expect(json).toHaveProperty('title');
  expect(json).toHaveProperty('body');

});


test('delete post', async ({ request }) => {

  const response = await request.delete('https://jsonplaceholder.typicode.com/posts/1');

  expect(response.status()).toBe(200);


});
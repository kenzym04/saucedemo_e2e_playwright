import { test, expect } from '@playwright/test';
import Ajv from 'ajv';

const ajv = new Ajv();

const userSchema = {
  type: 'object',
  properties: {
    id: { type: ['string', 'number'] },
    name: { type: 'string' },
    job: { type: 'string' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' }
  },
  required: ['id', 'name', 'job'],
  additionalProperties: true
};

const getUserSchema = {
  type: 'object',
  properties: {
    data: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        email: { type: 'string' },
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        avatar: { type: 'string' }
      },
      required: ['id', 'email', 'first_name', 'last_name', 'avatar'],
      additionalProperties: true
    },
    support: { type: 'object' }
  },
  required: ['data'],
  additionalProperties: true
};

const putUserSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    job: { type: 'string' },
    updatedAt: { type: 'string' }
  },
  required: ['name', 'job', 'updatedAt'],
  additionalProperties: true
};

const RESPONSE_TIME_THRESHOLD = process.env.RESPONSE_TIME_THRESHOLD
  ? Number(process.env.RESPONSE_TIME_THRESHOLD)
  : 2000; // Default to 2000ms

const API_HEADERS = {
  'x-api-key': 'reqres-free-v1'
};

test.describe('Reqres.in CRUD API Tests', () => {
  let userId: string | number;

  test('POST /api/users - Create User', async ({ request }) => {
    const start = Date.now();
    const response = await request.post('https://reqres.in/api/users', {
      headers: API_HEADERS,
      data: { name: 'John', job: 'QA' },
    });
    const duration = Date.now() - start;

    expect(response.status()).toBe(201);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(duration).toBeLessThan(RESPONSE_TIME_THRESHOLD);

    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(typeof body.name).toBe('string');
    expect(typeof body.job).toBe('string');

    const valid = ajv.validate(userSchema, body);
    expect(valid, ajv.errorsText()).toBe(true);

    userId = body.id;
  });

  test('GET /api/users/:id - Get User', async ({ request }) => {
    const start = Date.now();
    const response = await request.get('https://reqres.in/api/users/2', {
      headers: API_HEADERS
    });
    const duration = Date.now() - start;

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(duration).toBeLessThan(RESPONSE_TIME_THRESHOLD);

    const body = await response.json();
    const valid = ajv.validate(getUserSchema, body);
    expect(valid, ajv.errorsText()).toBe(true);

    expect(body.data).toHaveProperty('id', 2);
    expect(typeof body.data.email).toBe('string');
    expect(typeof body.data.first_name).toBe('string');
    expect(typeof body.data.last_name).toBe('string');
  });

  test('PUT /api/users/:id - Update User', async ({ request }) => {
    const start = Date.now();
    const response = await request.put('https://reqres.in/api/users/2', {
      headers: API_HEADERS,
      data: { name: 'Jane', job: 'Developer' },
    });
    const duration = Date.now() - start;

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(duration).toBeLessThan(RESPONSE_TIME_THRESHOLD);

    const body = await response.json();
    expect(body).toHaveProperty('name', 'Jane');
    expect(body).toHaveProperty('job', 'Developer');
    expect(typeof body.updatedAt).toBe('string');

    const valid = ajv.validate(putUserSchema, body);
    expect(valid, ajv.errorsText()).toBe(true);
  });

  test('DELETE /api/users/:id - Delete User', async ({ request }) => {
    const start = Date.now();
    const response = await request.delete('https://reqres.in/api/users/2', {
      headers: API_HEADERS
    });
    const duration = Date.now() - start;

    expect(response.status()).toBe(204);
    expect(response.headers()['content-type']).toBeUndefined();
    expect(duration).toBeLessThan(RESPONSE_TIME_THRESHOLD);
  });

  test('POST /api/users - Missing Fields', async ({ request }) => {
    const response = await request.post('https://reqres.in/api/users', {
      headers: API_HEADERS,
      data: { name: 'NoJob' },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('name', 'NoJob');
    expect(body).not.toHaveProperty('job');
  });

  test('GET /api/users/9999 - Not Found', async ({ request }) => {
    const response = await request.get('https://reqres.in/api/users/9999', {
      headers: API_HEADERS
    });
    expect(response.status()).toBe(404);
  });

  test('PATCH /api/users/:id - Invalid Method', async ({ request }) => {
    const start = Date.now();
    const response = await request.patch('https://reqres.in/api/users/2', {
      headers: API_HEADERS,
      data: { name: 'PatchNotAllowed' },
    });
    const duration = Date.now() - start;
    expect([200, 404, 405]).toContain(response.status());
    expect(duration).toBeLessThan(RESPONSE_TIME_THRESHOLD);
  });

  test('POST /api/users - Malformed JSON', async ({ request }) => {
    const start = Date.now();
    const response = await request.fetch('https://reqres.in/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'reqres-free-v1'
      },
      data: "{ name: 'MissingQuotes }",
    });
    const duration = Date.now() - start;
    expect([400, 415, 500]).toContain(response.status());
    expect(duration).toBeLessThan(RESPONSE_TIME_THRESHOLD);
  });

  // test('GET /api/invalid-endpoint - Invalid Endpoint', async ({ request }) => {
  //   const start = Date.now();
  //   const response = await request.get('https://reqres.in/api/invalid-endpoint', {
  //     headers: API_HEADERS
  //   });
  //   const duration = Date.now() - start;
  //   expect(response.status()).toBe(404);
  //   expect(duration).toBeLessThan(RESPONSE_TIME_THRESHOLD);
  // });

  // test('POST /api/users - Unsupported Media Type', async ({ request }) => {
  //   const start = Date.now();
  //   const response = await request.post('https://reqres.in/api/users', {
  //     headers: {
  //       'Content-Type': 'application/gzip',
  //       'x-api-key': 'reqres-free-v1'
  //     },
  //     data: 'plain text body',
  //   });
  //   const duration = Date.now() - start;
  //   expect([400, 415]).toContain(response.status());
  //   expect(duration).toBeLessThan(RESPONSE_TIME_THRESHOLD);
  // });
});

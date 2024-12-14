const { test, expect } = require('@playwright/test');
const Ajv = require('ajv');

test.describe('API Response Validation', () => {
  test('Validate API response and schema', async ({ request }) => {
    // Send GET request
    const response = await request.get('https://reqres.in/api/users?page=2');
    expect(response.status()).toBe(200);

    // Parse response body
    const responseBody = await response.json();
    console.log(responseBody);

    // Define the schema
    const schema = {
      type: "object",
      properties: {
        page: { type: "integer" },
        per_page: { type: "integer" },
        total: { type: "integer" },
        total_pages: { type: "integer" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              email: { type: "string" },
              first_name: { type: "string" },
              last_name: { type: "string" },
              avatar: { type: "string" }
            },
            required: ["id", "email", "first_name", "last_name", "avatar"]
          }
        },
        support: {
          type: "object",
          properties: {
            url: { type: "string" },
            text: { type: "string" }
          },
          required: ["url", "text"]
        }
      },
      required: ["page", "per_page", "total", "total_pages", "data", "support"]
    };

    // Validate schema using AJV
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const isValid = validate(responseBody);
    expect(isValid).toBeTruthy(); // Pass if schema is valid
    if (!isValid) console.log(validate.errors);

    // Validate specific fields
    expect(responseBody.page).toBe(2);
    expect(responseBody.data).toBeInstanceOf(Array);
    expect(responseBody.data.length).toBe(responseBody.per_page);
    responseBody.data.forEach((user) => {
      expect(user.id).toBeGreaterThan(0);
      expect(typeof user.email).toBe('string');
      expect(typeof user.first_name).toBe('string');
      expect(typeof user.last_name).toBe('string');
      expect(typeof user.avatar).toBe('string');
    });

    // Validate support object
    expect(typeof responseBody.support).toBe('object');
    expect(typeof responseBody.support.url).toBe('string');
    expect(typeof responseBody.support.text).toBe('string');
  });
});

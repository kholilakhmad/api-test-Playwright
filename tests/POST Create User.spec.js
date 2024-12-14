const { test, expect } = require('@playwright/test');
const Ajv = require('ajv');

test.describe('API Response Validation - POST Request', () => {
  test('Validate response schema, fields, and values', async ({ request }) => {
    // Send POST request
    const response = await request.post('https://reqres.in/api/users', {
      data: {
        name: "Kholil Akhmad",
        job: "QA Engineer"
      },
    });

    // Parse response body
    const responseBody = await response.json();
    console.log(responseBody);

    // Validate Status Code
    expect(response.status()).toBe(201);

    // Define the JSON Schema
    const schema = {
      type: "object",
      required: ["name", "job", "id", "createdAt"],
      properties: {
        name: { type: "string" },
        job: { type: "string" },
        id: { type: "string" },
        createdAt: { type: "string"}
      }
    };

    // Validate Schema with AJV
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const isValid = validate(responseBody);
    expect(isValid).toBeTruthy(); // Pass if schema is valid
    if (!isValid) {
      console.error(validate.errors); // Log errors if schema validation fails
    }

    // Validate Field Values
    expect(responseBody.name).toBe("Kholil Akhmad");
    expect(responseBody.job).toBe("QA Engineer");

    // Validate `id` Field
    expect(typeof responseBody.id).toBe("string");

    // Validate `createdAt` Field is a Valid Timestamp
    const createdAt = new Date(responseBody.createdAt);
    expect(createdAt.toISOString()).toBe(responseBody.createdAt);
  });
});

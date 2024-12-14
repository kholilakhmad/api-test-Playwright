const { test, expect } = require('@playwright/test');
const Ajv = require('ajv');

test.describe('API Response Validation Update User', () => {
  test('Validate response schema, status, and content', async ({ request }) => {
    // Send PUT or POST request
    const response = await request.put('https://reqres.in/api/users/2', {
      data: {
        name: "Kholil Akhmad",
        job: "QA Engineer"
      },
    });

    // Parse the response body
    const responseBody = await response.json();
    console.log(responseBody);

    // Validate Status Code
    expect(response.status()).toBe(200);

    // Define the JSON Schema
    const schema = {
      type: "object",
      required: ["name", "job", "updatedAt"],
      properties: {
        name: { type: "string" },
        job: { type: "string" },
        updatedAt: { type: "string" }
      }
    };

    // Validate Schema using AJV
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const isValid = validate(responseBody);
    expect(isValid).toBeTruthy(); // Test passes if schema is valid
    if (!isValid) {
      console.error(validate.errors); // Log schema validation errors
    }

    // Validate Specific Field Values
    expect(responseBody.name).toBe("Kholil Akhmad");
    expect(responseBody.job).toBe("QA Engineer");

    // Validate `updatedAt` Field is a Valid Timestamp
    const updatedAt = new Date(responseBody.updatedAt);
    expect(updatedAt.toISOString()).toBe(responseBody.updatedAt);
  });
});

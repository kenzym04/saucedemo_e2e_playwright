# Saucedemo Playwright Automation

## Setup

1. **Install dependencies:**
   ```
   npm install
   ```

2. **Create a `.env` file with:**
   ```
   STANDARD_USER=standard_user
   LOCKED_USER=locked_out_user
   PROBLEM_USER=problem_user
   PERFORMANCE_USER=performance_glitch_user
   ERROR_USER=error_user
   VISUAL_USER=visual_user
   SAUCE_PASSWORD=secret_sauce
   ```

3. **Run tests:**
   ```
   npm test
   ```

## E2E/UI Test Users

The following test users are available for UI login scenarios:

**Accepted usernames:**  
- standard_user  
- locked_out_user  
- problem_user  
- performance_glitch_user  
- error_user  
- visual_user  

**Password for all users:**  
- secret_sauce

## Structure

- `tests/e2e/` - End-to-end tests (organized by feature, e.g., `login/`)
- `tests/utils/` - Utility functions (e.g., login)
- `tests/data/` - Test data

## Linting

1. **Install linting dependencies (if not already installed):**
   ```
   npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
   ```

2. **Run linting:**
   ```
   npm run lint
   ```

## Cleaning Test Artifacts

Remove old test results and reports:
```
npm run clean:artifacts
```

## Viewing Test Reports

After running tests, you can view the Playwright HTML report:
```
npx playwright show-report
```

## Browsers and Devices Tested

This project runs automated tests on:
- **Desktop Browsers:**  
  - Chromium (Chrome/Edge)
  - WebKit (Safari)
  - Firefox
- **Mobile Devices (Emulated):**
  - Pixel 5 (mobile Chrome/Android)
  - iPhone 12 (mobile Safari/iOS)

## Continuous Integration

This project is ready for CI integration (e.g., GitHub Actions).  
See `.github/workflows/playwright.yml` for an example workflow.

## CI/CD Secrets

In CI (e.g., GitHub Actions), environment variables for credentials are set as repository secrets and referenced in the workflow YAML:

```yaml
env:
  STANDARD_USER: ${{ secrets.STANDARD_USER }}
  # ...other secrets...
```

## Security Note

For real projects, never commit sensitive data.  
This project loads credentials from environment variables defined in `.env`, which is gitignored.  
In CI, set these as secrets in your pipeline configuration.

## API Test Approach

This project includes comprehensive automated API tests for the [reqres.in](https://reqres.in/) public API using Playwright and AJV for schema validation.

**Coverage includes:**
- All CRUD operations (POST, GET, PUT, DELETE)
- Status code, response body, data type, and header validation
- JSON schema validation using AJV
- Performance checks with configurable thresholds via `.env`
- Extensive negative testing:
  - Non-existent resources and endpoints
  - Missing or malformed request data
  - Invalid HTTP methods
  - Unsupported media types

**Performance thresholds** are configurable using the `RESPONSE_TIME_THRESHOLD` variable in `.env`.

These practices ensure robust, secure, and production-ready API automation.

## API Endpoints & Test Coverage

| Endpoint                  | Test Type         | Validations Performed                                                                 |
|---------------------------|-------------------|--------------------------------------------------------------------------------------|
| `POST /api/users`         | Positive/Negative | Status code, headers, response time, field/value checks, AJV schema, malformed JSON, unsupported media type |
| `GET /api/users/:id`      | Positive/Negative | Status code, headers, response time, field/value checks, AJV schema, non-existent user, invalid endpoint    |
| `PUT /api/users/:id`      | Positive          | Status code, headers, response time, field/value checks, AJV schema                  |
| `DELETE /api/users/:id`   | Positive          | Status code, response time                                                           |
| `PATCH /api/users/:id`    | Negative          | Status code, response time (invalid method)                                          |

**Legend:**  
- **AJV schema** = JSON schema validation using AJV  
- **Malformed JSON** = Invalid JSON request body  
- **Unsupported media type** = Invalid `Content-Type` header  
- **Invalid endpoint** = Non-existent API path  
- **Non-existent user** = User ID that does not exist


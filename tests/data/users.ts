/**
 * User credentials are loaded from environment variables for security.
 */

export const users = {
  standard: { username: process.env.STANDARD_USER, password: process.env.SAUCE_PASSWORD },
  locked: { username: process.env.LOCKED_USER, password: process.env.SAUCE_PASSWORD },
  problem: { username: process.env.PROBLEM_USER, password: process.env.SAUCE_PASSWORD },
  performance: { username: process.env.PERFORMANCE_USER, password: process.env.SAUCE_PASSWORD },
  error: { username: process.env.ERROR_USER, password: process.env.SAUCE_PASSWORD },
  visual: { username: process.env.VISUAL_USER, password: process.env.SAUCE_PASSWORD },
};
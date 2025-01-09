/**
 * Type utility functions for improved type safety
 */

/**
 * Check if a value is defined (not null or undefined)
 * @param value - Value to check
 * @returns Boolean indicating if value is defined
 */
export const isDefined = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

/**
 * Check if a value is a non-empty string
 * @param value - Value to check
 * @returns Boolean indicating if value is a non-empty string
 */
export const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0;
};

/**
 * Safely parse a value using a provided parser function
 * @param parser - Function to parse the input
 * @param input - Input to parse
 * @param defaultValue - Default value if parsing fails
 * @returns Parsed value or default value
 */
export const safeParse = <T>(parser: (input: unknown) => T, input: unknown, defaultValue: T): T => {
  try {
    return parser(input);
  } catch {
    return defaultValue;
  }
};

/**
 * Create a type guard for a specific object shape
 * @param keys - Required keys for the object
 * @returns Type guard function
 */
export const createObjectGuard = <T extends Record<string, unknown>>(keys: (keyof T)[]) => {
  return (obj: unknown): obj is T => {
    if (typeof obj !== 'object' || obj === null) return false;
    return keys.every((key) => key in obj);
  };
};

/**
 * Safely get a nested property from an object
 * @param obj - Source object
 * @param path - Dot-separated path to the property
 * @param defaultValue - Default value if property is not found
 * @returns Property value or default value
 */
export const safeGet = <T = unknown>(
  obj: unknown,
  path: string,
  defaultValue?: T
): T | undefined => {
  if (obj == null) return defaultValue;

  const keys = path.split('.');
  let result: unknown = obj;

  for (const key of keys) {
    if (result == null || typeof result !== 'object') return defaultValue;
    result = (result as Record<string, unknown>)[key];
  }

  return (result as T) ?? defaultValue;
};

/**
 * Filter out null and undefined values from an array
 * @param arr - Input array
 * @returns Array with only defined values
 */
export const compactArray = <T>(arr: (T | null | undefined)[]): T[] => {
  return arr.filter(isDefined);
};

/**
 * Validate an email address
 * @param email - Email address to validate
 * @returns Boolean indicating if the email is valid
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return isNonEmptyString(email) && emailRegex.test(email);
};

/**
 * Validate a password
 * @param password - Password to validate
 * @param minLength - Minimum password length (default: 8)
 * @returns Boolean indicating if the password is valid
 */
export const validatePassword = (password: string, minLength: number = 8): boolean => {
  return isNonEmptyString(password) && password.length >= minLength;
};

/**
 * Validate a non-empty string with optional length constraints
 * @param value - String to validate
 * @param fieldName - Name of the field for error messaging
 * @param minLength - Minimum length (optional)
 * @param maxLength - Maximum length (optional)
 * @throws Error if validation fails
 */
export const validateNonEmptyString = (
  value: unknown,
  fieldName: string,
  minLength?: number,
  maxLength?: number
): asserts value is string => {
  if (!isNonEmptyString(value)) {
    throw new Error(`${fieldName} must be a non-empty string`);
  }

  if (minLength !== undefined && value.length < minLength) {
    throw new Error(`${fieldName} must be at least ${minLength} characters long`);
  }

  if (maxLength !== undefined && value.length > maxLength) {
    throw new Error(`${fieldName} must be no more than ${maxLength} characters long`);
  }
};

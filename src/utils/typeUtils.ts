import type { GlobalTypes } from '@/types/global';

/**
 * Type utility functions for improved type safety
 */
export const isDefined = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

export const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0;
};

export const safeParse = <T>(parser: (input: unknown) => T, input: unknown, defaultValue: T): T => {
  try {
    return parser(input);
  } catch {
    return defaultValue;
  }
};

export const createObjectGuard = <T extends Record<string, unknown>>(keys: (keyof T)[]) => {
  return (obj: unknown): obj is T => {
    if (typeof obj !== 'object' || obj === null) return false;
    return keys.every(key => key in obj);
  };
};

export const safeGet = <T>(obj: unknown, path: string, defaultValue?: T): T | undefined => {
  if (obj == null) return defaultValue;
  
  const keys = path.split('.');
  let result: unknown = obj;
  
  for (const key of keys) {
    if (result == null || typeof result !== 'object') return defaultValue;
    result = (result as Record<string, unknown>)[key];
  }
  
  return result as T ?? defaultValue;
};

export const compactArray = <T>(arr: (T | null | undefined)[]): T[] => {
  return arr.filter(isDefined);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string, minLength: number = 8): boolean => {
  return password.length >= minLength;
};

export const validateNonEmptyString = (
  value: unknown,
  fieldName: string,
  minLength?: number,
  maxLength?: number
): asserts value is string => {
  if (value === null || value === undefined) {
    throw new Error(`${fieldName} cannot be null or undefined`);
  }

  if (typeof value !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length === 0) {
    throw new Error(`${fieldName} cannot be an empty string`);
  }

  if (minLength !== undefined && trimmedValue.length < minLength) {
    throw new Error(`${fieldName} must be at least ${minLength} characters long`);
  }

  if (maxLength !== undefined && trimmedValue.length > maxLength) {
    throw new Error(`${fieldName} must be no more than ${maxLength} characters long`);
  }
};

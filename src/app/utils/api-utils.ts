import { ApiResponse } from '../models';

/**
 * Extracts data from an API response, or returns an empty array if response is invalid
 * @param response API response object
 * @returns The data from the response
 */
export function extractArrayData<T>(response: ApiResponse<T[]> | null | undefined): T[] {
  if (!response || !response.data) return [];
  return response.data;
}

/**
 * Extracts data from an API response, or returns null if response is invalid
 * @param response API response object
 * @returns The data from the response or null
 */
export function extractItemData<T>(response: ApiResponse<T> | null | undefined): T | null {
  if (!response || !response.data) return null;
  return response.data;
}

/**
 * Safely converts a value to string, with fallback if undefined
 * @param value Value to convert
 * @param fallback Optional fallback value
 * @returns String representation of the value
 */
export function toSafeString(value: any, fallback: string = ''): string {
  if (value === undefined || value === null) return fallback;
  return String(value);
}
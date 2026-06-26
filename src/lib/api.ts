/**
 * Unified API utility for simulated network requests.
 * Provides consistent delay and error handling.
 */

export async function simulateNetworkRequest<T>(data: T, delay = 800): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
}

export class APIError extends Error {
  constructor(public message: string, public status: number = 500) {
    super(message);
    this.name = 'APIError';
  }
}

/// <reference types="astro/client" />

declare module "bun:test" {
  export function describe(name: string, run: () => void): void;
  export function it(name: string, run: () => void | Promise<void>): void;

  interface Matcher<TValue> {
    toBe(expected: unknown): void;
    toEqual(expected: unknown): void;
    toHaveLength(expected: number): void;
    toThrow(expected?: string | RegExp): void;
  }

  export function expect<TValue>(actual: TValue): Matcher<TValue>;
}

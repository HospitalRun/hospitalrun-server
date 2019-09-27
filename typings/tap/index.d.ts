// improve tap typings and publish them on @types/tap

declare module 'tap' {
  function test(description: string, t: unknown): unknown
}

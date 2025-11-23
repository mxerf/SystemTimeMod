// Type definitions for Cities Skylines 2 modding API
// These modules are provided by the game at runtime

declare module 'cs2/modding' {
  import type { ComponentType, ReactElement } from 'react'

  export interface ModuleRegistry {
    extend(id: string, component: ComponentType<any>): void
    append(id: string, component: () => ReactElement): void
  }

  export type ModRegistrar = (moduleRegistry: ModuleRegistry) => void
}

declare module 'cs2/api' {
  export interface ValueBinding<T> {
    readonly value: T
    subscribe(callback: (value: T) => void): () => void
  }

  export function bindValue<T>(
    namespace: string,
    key: string,
    fallback?: T
  ): ValueBinding<T>

  export function useValue<T>(binding: ValueBinding<T>): T

  export function trigger(
    namespace: string,
    event: string,
    ...args: any[]
  ): void

  export function call(
    namespace: string,
    method: string,
    ...args: any[]
  ): Promise<any>
}

declare module 'cs2/bindings' {
  // Game bindings will be added here as needed
}

declare module 'cs2/ui' {
  // Game UI utilities will be added here as needed
}

declare module 'cs2/input' {
  // Game input utilities will be added here as needed
}

declare module 'cs2/l10n' {
  // Game localization utilities will be added here as needed
}

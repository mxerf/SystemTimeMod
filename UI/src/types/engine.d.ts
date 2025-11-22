/**
 * Type definitions for Cities Skylines 2 engine bindings
 * Provides TypeScript support for communication with C# backend
 */

declare global {
  interface Window {
    /**
     * Game engine bindings for C# communication
     */
    engine?: {
      /**
       * Subscribe to events from C#
       * @param event Event name (e.g., 'systemTimeMod.settings')
       * @param callback Callback function to handle the event
       */
      on: (event: string, callback: (data: any) => void) => void

      /**
       * Unsubscribe from events
       * @param event Event name
       * @param callback The callback to remove
       */
      off: (event: string, callback: (data: any) => void) => void

      /**
       * Trigger an event to C#
       * @param event Event name (e.g., 'systemTimeMod.saveSettings')
       * @param args Arguments to pass to C#
       */
      trigger: (event: string, ...args: any[]) => void

      /**
       * Call a C# method and get a promise with the result
       * @param method Method name (e.g., 'systemTimeMod.settings')
       * @param args Arguments to pass
       * @returns Promise with the result
       */
      call: (method: string, ...args: any[]) => Promise<any>
    }
  }
}

/**
 * SystemTimeMod specific bindings
 */
export namespace SystemTimeModBindings {
  /**
   * Get mod settings from C#
   */
  export function getSettings(): Promise<ModSettings> {
    if (!window.engine?.call) {
      throw new Error('Engine bindings not available')
    }
    return window.engine.call('systemTimeMod.settings')
  }

  /**
   * Get game language
   */
  export function getGameLanguage(): Promise<string> {
    if (!window.engine?.call) {
      throw new Error('Engine bindings not available')
    }
    return window.engine.call('systemTimeMod.gameLanguage')
  }

  /**
   * Save widget position
   */
  export function savePosition(x: number, y: number): void {
    if (!window.engine?.trigger) {
      console.warn('Engine bindings not available')
      return
    }
    window.engine.trigger('systemTimeMod.savePosition', { x, y })
  }

  /**
   * Save widget size
   */
  export function saveWidgetSize(size: number): void {
    if (!window.engine?.trigger) {
      console.warn('Engine bindings not available')
      return
    }
    window.engine.trigger('systemTimeMod.saveWidgetSize', size)
  }

  /**
   * Reset settings to defaults
   */
  export function resetSettings(): void {
    if (!window.engine?.trigger) {
      console.warn('Engine bindings not available')
      return
    }
    window.engine.trigger('systemTimeMod.resetSettings')
  }

  /**
   * Subscribe to settings updates
   */
  export function onSettingsUpdate(callback: (settings: ModSettings) => void): () => void {
    if (!window.engine?.on || !window.engine?.off) {
      console.warn('Engine bindings not available')
      return () => {}
    }

    window.engine.on('systemTimeMod.settings', callback)

    // Return unsubscribe function
    return () => {
      if (window.engine?.off) {
        window.engine.off('systemTimeMod.settings', callback)
      }
    }
  }
}

/**
 * Mod settings interface
 */
export interface ModSettings {
  /** Language code (empty string means use game language) */
  language: string
  
  /** Use 24-hour time format */
  use24HourFormat: boolean
  
  /** Show seconds in time display */
  showSeconds: boolean
  
  /** Show date when expanded */
  showDate: boolean
  
  /** Widget size: 0 = small, 1 = medium, 2 = large */
  widgetSize: number
  
  /** Widget position: 0 = TopRight, 1 = TopLeft, 2 = BottomRight, 3 = BottomLeft */
  widgetPosition: number
  
  /** Custom X position (when dragged) */
  customPositionX: number
  
  /** Custom Y position (when dragged) */
  customPositionY: number
  
  /** Whether to use custom position */
  useCustomPosition: boolean
}

export {}

type IdleCallback = (deadline: { timeRemaining: () => number }) => void

declare global {
  function requestIdleCallback(cb: IdleCallback): number | undefined
}

export const runWhenIdle = (task: () => void) => {
    if (typeof globalThis.requestIdleCallback === 'function') {
      globalThis.requestIdleCallback(() => task())
    } else {
      setTimeout(task, 0)
    }
  }
  
  export const processInChunks = async <T>(
    items: T[],
    chunkSize: number,
    handler: (value: T) => Promise<void> | void,
  ) => {
    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize)
  
      for (const item of chunk) {
        await handler(item)
      }
  
      // Yield back to UI thread
      await new Promise<void>(resolve => {
        setTimeout(() => resolve(), 0)
      })
    }
  }

  
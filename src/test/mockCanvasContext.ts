/**
 * jsdom doesn't implement a real canvas renderer. The app only needs
 * `renderStrip`'s *output* (canvas dimensions) to be testable, and for
 * components that mount a <canvas> (thumbnails, the live strip preview)
 * to not crash — so this installs a permissive no-op 2D context that
 * accepts any method call or property assignment a template's draw
 * callback might make, without actually rendering anything.
 */
export function installFakeCanvasContext(): void {
  HTMLCanvasElement.prototype.getContext = function fakeGetContext(): unknown {
    const store: Record<string, unknown> = {};
    return new Proxy(store, {
      get(target, prop) {
        if (typeof prop !== 'string') return undefined;
        if (prop in target) return target[prop];
        const fn = (...args: unknown[]) => {
          if (prop === 'createLinearGradient' || prop === 'createRadialGradient') {
            return { addColorStop: () => undefined };
          }
          if (prop === 'getImageData') {
            const [, , w = 0, h = 0] = args as [number, number, number, number];
            return {
              data: new Uint8ClampedArray(Math.max(0, w) * Math.max(0, h) * 4),
              width: w,
              height: h,
              colorSpace: 'srgb',
            };
          }
          return undefined;
        };
        target[prop] = fn;
        return fn;
      },
      set(target, prop, value) {
        target[prop as string] = value;
        return true;
      },
    });
  } as unknown as typeof HTMLCanvasElement.prototype.getContext;
}

type PerformanceMarker = {
  start: number;
  end?: number;
  duration?: number;
};

export class PerformanceMonitor {
  private static markers: Record<string, PerformanceMarker> = {};
  private static isEnabled = process.env.NODE_ENV !== 'production';

  static start(label: string): void {
    if (!this.isEnabled) return;
    this.markers[label] = { start: performance.now() };
  }

  static end(label: string): number | undefined {
    if (!this.isEnabled) return undefined;

    const marker = this.markers[label];
    if (!marker) {
      console.warn(`No start marker found for ${label}`);
      return undefined;
    }

    marker.end = performance.now();
    marker.duration = marker.end - marker.start;

    this.log(label, marker.duration);
    return marker.duration;
  }

  private static log(label: string, duration: number): void {
    console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
  }

  static measure<T>(label: string, fn: () => T): T {
    if (!this.isEnabled) return fn();

    this.start(label);
    const result = fn();
    this.end(label);
    return result;
  }

  static async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    if (!this.isEnabled) return fn();

    this.start(label);
    const result = await fn();
    this.end(label);
    return result;
  }
}

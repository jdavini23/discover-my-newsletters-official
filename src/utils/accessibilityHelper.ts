export class AccessibilityHelper {
  /**
   * Generate a unique, semantic ID for elements
   * @param prefix Optional prefix for the ID
   * @returns A unique ID string
   */
  static generateId(prefix = 'a11y'): string {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Ensure proper color contrast for accessibility
   * @param foreground Foreground color hex
   * @param background Background color hex
   * @returns Contrast ratio
   */
  static calculateColorContrast(foreground: string, background: string): number {
    const getLuminance = (color: string) => {
      const rgb = parseInt(color.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >>  8) & 0xff;
      const b = (rgb >>  0) & 0xff;
      
      const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 
          ? v / 12.92 
          : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    const l1 = getLuminance(foreground);
    const l2 = getLuminance(background);
    const ratio = l1 > l2 
      ? (l1 + 0.05) / (l2 + 0.05)
      : (l2 + 0.05) / (l1 + 0.05);

    return Number(ratio.toFixed(2));
  }

  /**
   * Check if color contrast meets WCAG guidelines
   * @param foreground Foreground color hex
   * @param background Background color hex
   * @param level WCAG level (AA or AAA)
   * @returns Boolean indicating if contrast is sufficient
   */
  static isColorContrastAccessible(
    foreground: string, 
    background: string, 
    level: 'AA' | 'AAA' = 'AA'
  ): boolean {
    const ratio = this.calculateColorContrast(foreground, background);
    return level === 'AA' 
      ? ratio >= 4.5 
      : ratio >= 7;
  }

  /**
   * Create an aria-label for screen readers
   * @param text Text to be read by screen readers
   * @returns Aria label object
   */
  static createAriaLabel(text: string): { 'aria-label': string } {
    return { 'aria-label': text };
  }

  /**
   * Simulate reduced motion preference
   * @returns Boolean indicating if reduced motion is preferred
   */
  static prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}

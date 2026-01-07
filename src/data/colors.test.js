// Colors data tests
import { describe, it, expect } from 'vitest';
import { COLORS } from './colors';

describe('Colors Data', () => {
  describe('COLORS object', () => {
    it('is defined and is an object', () => {
      expect(COLORS).toBeDefined();
      expect(typeof COLORS).toBe('object');
      expect(COLORS).not.toBeNull();
    });

    it('has light and dark themes', () => {
      expect(COLORS).toHaveProperty('light');
      expect(COLORS).toHaveProperty('dark');
    });

    it('light theme is an object', () => {
      expect(typeof COLORS.light).toBe('object');
      expect(COLORS.light).not.toBeNull();
    });

    it('dark theme is an object', () => {
      expect(typeof COLORS.dark).toBe('object');
      expect(COLORS.dark).not.toBeNull();
    });
  });

  describe('light theme colors', () => {
    const lightColors = COLORS.light;

    it('has background property', () => {
      expect(lightColors).toHaveProperty('background');
      expect(typeof lightColors.background).toBe('string');
    });

    it('has backgroundGradient property', () => {
      expect(lightColors).toHaveProperty('backgroundGradient');
      expect(typeof lightColors.backgroundGradient).toBe('string');
    });

    it('has buttonGradient property', () => {
      expect(lightColors).toHaveProperty('buttonGradient');
      expect(typeof lightColors.buttonGradient).toBe('string');
    });

    it('has primary property', () => {
      expect(lightColors).toHaveProperty('primary');
      expect(typeof lightColors.primary).toBe('string');
    });

    it('has secondary property', () => {
      expect(lightColors).toHaveProperty('secondary');
      expect(typeof lightColors.secondary).toBe('string');
    });

    it('has text property', () => {
      expect(lightColors).toHaveProperty('text');
      expect(typeof lightColors.text).toBe('string');
    });

    it('has modalBackground property', () => {
      expect(lightColors).toHaveProperty('modalBackground');
      expect(typeof lightColors.modalBackground).toBe('string');
    });

    it('has modalText property', () => {
      expect(lightColors).toHaveProperty('modalText');
      expect(typeof lightColors.modalText).toBe('string');
    });

    it('has scrollbarThumb property', () => {
      expect(lightColors).toHaveProperty('scrollbarThumb');
      expect(typeof lightColors.scrollbarThumb).toBe('string');
    });

    it('has scrollbarTrack property', () => {
      expect(lightColors).toHaveProperty('scrollbarTrack');
      expect(typeof lightColors.scrollbarTrack).toBe('string');
    });
  });

  describe('dark theme colors', () => {
    const darkColors = COLORS.dark;

    it('has background property', () => {
      expect(darkColors).toHaveProperty('background');
      expect(typeof darkColors.background).toBe('string');
    });

    it('has navbackground property', () => {
      expect(darkColors).toHaveProperty('navbackground');
      expect(typeof darkColors.navbackground).toBe('string');
    });

    it('has backgroundGradient property', () => {
      expect(darkColors).toHaveProperty('backgroundGradient');
      expect(typeof darkColors.backgroundGradient).toBe('string');
    });

    it('has primary property', () => {
      expect(darkColors).toHaveProperty('primary');
      expect(typeof darkColors.primary).toBe('string');
    });

    it('has secondary property', () => {
      expect(darkColors).toHaveProperty('secondary');
      expect(typeof darkColors.secondary).toBe('string');
    });

    it('has text property', () => {
      expect(darkColors).toHaveProperty('text');
      expect(typeof darkColors.text).toBe('string');
    });

    it('has modalBackground property', () => {
      expect(darkColors).toHaveProperty('modalBackground');
      expect(typeof darkColors.modalBackground).toBe('string');
    });

    it('has modalText property', () => {
      expect(darkColors).toHaveProperty('modalText');
      expect(typeof darkColors.modalText).toBe('string');
    });

    it('has scrollbarThumb property', () => {
      expect(darkColors).toHaveProperty('scrollbarThumb');
      expect(typeof darkColors.scrollbarThumb).toBe('string');
    });

    it('has scrollbarTrack property', () => {
      expect(darkColors).toHaveProperty('scrollbarTrack');
      expect(typeof darkColors.scrollbarTrack).toBe('string');
    });
  });

  describe('color format validation', () => {
    describe('light theme hex colors', () => {
      it('background is valid hex color', () => {
        expect(COLORS.light.background).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });

      it('primary is valid hex color', () => {
        expect(COLORS.light.primary).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });

      it('secondary is valid hex color', () => {
        expect(COLORS.light.secondary).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });

      it('text is valid hex color', () => {
        expect(COLORS.light.text).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });

      it('modalBackground is valid hex color', () => {
        expect(COLORS.light.modalBackground).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });

      it('modalText is valid hex color', () => {
        expect(COLORS.light.modalText).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });

    describe('dark theme hex colors', () => {
      it('background is valid hex color', () => {
        expect(COLORS.dark.background).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });

      it('navbackground is valid hex color', () => {
        expect(COLORS.dark.navbackground).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });

      it('primary is valid hex color', () => {
        expect(COLORS.dark.primary).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });

      it('secondary is valid hex color', () => {
        expect(COLORS.dark.secondary).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });

      it('text is valid hex color', () => {
        expect(COLORS.dark.text).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });

      it('modalBackground is valid hex color', () => {
        expect(COLORS.dark.modalBackground).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });

      it('modalText is valid hex color', () => {
        expect(COLORS.dark.modalText).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });

    describe('gradient formats', () => {
      it('light backgroundGradient is valid CSS gradient', () => {
        expect(COLORS.light.backgroundGradient).toMatch(/^linear-gradient/);
      });

      it('light buttonGradient is valid CSS gradient', () => {
        expect(COLORS.light.buttonGradient).toMatch(/^linear-gradient/);
      });

      it('dark backgroundGradient is valid CSS gradient', () => {
        expect(COLORS.dark.backgroundGradient).toMatch(/^linear-gradient/);
      });
    });

    describe('rgba formats', () => {
      it('light scrollbarThumb is valid rgba color', () => {
        expect(COLORS.light.scrollbarThumb).toMatch(/^rgba\(/);
      });

      it('light scrollbarTrack is valid rgba color', () => {
        expect(COLORS.light.scrollbarTrack).toMatch(/^rgba\(/);
      });

      it('dark scrollbarThumb is valid rgba color', () => {
        expect(COLORS.dark.scrollbarThumb).toMatch(/^rgba\(/);
      });

      it('dark scrollbarTrack is valid rgba color', () => {
        expect(COLORS.dark.scrollbarTrack).toMatch(/^rgba\(/);
      });
    });
  });

  describe('specific color values', () => {
    describe('light theme values', () => {
      it('background is white (#FFFFFF)', () => {
        expect(COLORS.light.background).toBe('#FFFFFF');
      });

      it('primary is blue (#2563EB)', () => {
        expect(COLORS.light.primary).toBe('#2563EB');
      });

      it('text is dark gray (#333333)', () => {
        expect(COLORS.light.text).toBe('#333333');
      });
    });

    describe('dark theme values', () => {
      it('background is very dark (#121213)', () => {
        expect(COLORS.dark.background).toBe('#121213');
      });

      it('primary is light blue (#60A5FA)', () => {
        expect(COLORS.dark.primary).toBe('#60A5FA');
      });

      it('text is light gray (#E0E0E0)', () => {
        expect(COLORS.dark.text).toBe('#E0E0E0');
      });
    });
  });

  describe('theme contrast', () => {
    it('light and dark backgrounds are different', () => {
      expect(COLORS.light.background).not.toBe(COLORS.dark.background);
    });

    it('light and dark primary colors are different', () => {
      expect(COLORS.light.primary).not.toBe(COLORS.dark.primary);
    });

    it('light and dark text colors are different', () => {
      expect(COLORS.light.text).not.toBe(COLORS.dark.text);
    });

    it('light and dark secondary colors are different', () => {
      expect(COLORS.light.secondary).not.toBe(COLORS.dark.secondary);
    });

    it('light and dark modal backgrounds are different', () => {
      expect(COLORS.light.modalBackground).not.toBe(COLORS.dark.modalBackground);
    });

    it('light and dark modal text colors are different', () => {
      expect(COLORS.light.modalText).not.toBe(COLORS.dark.modalText);
    });
  });

  describe('color accessibility considerations', () => {
    it('light theme has light background', () => {
      // Light background should start with #F or #E or be #FFFFFF
      expect(COLORS.light.background).toMatch(/^#(F|E|D|C|FFFFFF)/i);
    });

    it('dark theme has dark background', () => {
      // Dark background should start with #0, #1, #2, or #3
      expect(COLORS.dark.background).toMatch(/^#(0|1|2|3)/);
    });

    it('light theme text is dark for contrast', () => {
      // Dark text should start with #0, #1, #2, #3, #4, or #5
      expect(COLORS.light.text).toMatch(/^#(0|1|2|3|4|5)/);
    });

    it('dark theme text is light for contrast', () => {
      // Light text should start with #C, #D, #E, or #F
      expect(COLORS.dark.text).toMatch(/^#(C|D|E|F)/i);
    });
  });

  describe('theme consistency', () => {
    it('both themes have same common property names', () => {
      const commonProperties = [
        'background',
        'backgroundGradient',
        'primary',
        'secondary',
        'text',
        'modalBackground',
        'modalText',
        'scrollbarThumb',
        'scrollbarTrack',
      ];

      commonProperties.forEach((prop) => {
        expect(COLORS.light).toHaveProperty(prop);
        expect(COLORS.dark).toHaveProperty(prop);
      });
    });

    it('all color values are non-empty strings', () => {
      Object.values(COLORS.light).forEach((value) => {
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
      });

      Object.values(COLORS.dark).forEach((value) => {
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
      });
    });
  });

  describe('immutability', () => {
    it('COLORS object structure is preserved', () => {
      const originalLight = { ...COLORS.light };
      const originalDark = { ...COLORS.dark };

      // Attempt to read values (should not throw)
      const { background: _background } = COLORS.light;
      const _darkBg = COLORS.dark.background;

      // Original values should still be intact
      expect(COLORS.light.background).toBe(originalLight.background);
      expect(COLORS.dark.background).toBe(originalDark.background);
    });
  });

  describe('export validation', () => {
    it('default export matches named export', async () => {
      const { default: defaultExport, COLORS: namedExport } = await import('./colors');
      expect(defaultExport).toEqual(namedExport);
    });
  });
});

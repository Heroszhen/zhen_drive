import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno()],
  variants: [
    (matcher) => matcher.startsWith('actived:') ? {
      matcher: matcher.slice(8), // Remove 'active:' prefix
      selector: (s) => `${s}.actived`, // Apply styles when "active" class exists
    } : undefined,
  ],
  rules: [
    [/^bg-color-(.+)$/, ([, color]) => ({ 'background-color': `#${color}` })],
  ],
  theme: {
    breakpoints: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
    },
  }, 
})
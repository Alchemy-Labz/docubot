# DocuBot Theming System

## Overview

DocuBot implements a comprehensive dual-axis theming system designed to provide both professional business themes and creative neon themes, each available in light and dark modes. This results in four distinct theme combinations optimized for different user preferences and use cases.

## Theme Architecture

### Dual-Axis System

The theming system operates on two independent axes:

1. **Theme Type**: Business vs Neon
   - **Business**: Professional, clean, conversion-focused themes using grayscale palettes
   - **Neon**: Creative, vibrant themes with colorful accents and the original DocuBot aesthetic

2. **Theme Mode**: Light vs Dark
   - **Light**: Bright backgrounds with dark text
   - **Dark**: Dark backgrounds with light text

### Available Themes

1. **Business Light** (Default)
   - Clean white backgrounds with dark text
   - Professional grayscale color palette
   - Optimized for business users and conversions
   - High contrast for accessibility

2. **Business Dark**
   - Dark backgrounds with light text
   - Professional appearance suitable for low-light environments
   - Maintains business-focused aesthetic

3. **Neon Light**
   - Preserves the original DocuBot light theme
   - Purple and green accent colors
   - Creative, vibrant appearance

4. **Neon Dark**
   - Preserves the original DocuBot dark theme
   - Neon accents with dark backgrounds
   - Ideal for creative users

## Implementation

### Core Components

#### 1. Theme Provider Configuration

```typescript
// src/app/layout.tsx
<ThemeProvider
  attribute='class'
  defaultTheme='business-light'
  enableSystem={false}
  themes={['business-light', 'business-dark', 'neon-light', 'neon-dark']}
  disableTransitionOnChange={false}
>
```

#### 2. Theme Management Hook

```typescript
// src/hooks/useThemeManager.ts
import { useThemeManager } from '@/hooks/useThemeManager';

const {
  themeType, // 'business' | 'neon'
  themeMode, // 'light' | 'dark'
  currentTheme, // 'business-light' | 'business-dark' | 'neon-light' | 'neon-dark'
  setThemeType, // Function to change theme type
  setThemeMode, // Function to change theme mode
  setTheme, // Function to set complete theme
  toggleMode, // Function to toggle between light/dark
  isBusinessTheme, // Boolean helper
  isNeonTheme, // Boolean helper
  isDarkMode, // Boolean helper
  isLightMode, // Boolean helper
  mounted, // Hydration safety
} = useThemeManager();
```

#### 3. Theme-Aware Components

```typescript
// Using the useThemeClasses hook
import { useThemeClasses } from '@/components/Global/ThemeAwareWrapper';

const { getClasses } = useThemeClasses();

const className = getClasses({
  base: 'common-classes',
  business: 'business-specific-classes',
  neon: 'neon-specific-classes',
  light: 'light-mode-classes',
  dark: 'dark-mode-classes',
  businessLight: 'business-light-specific',
  businessDark: 'business-dark-specific',
  neonLight: 'neon-light-specific',
  neonDark: 'neon-dark-specific',
});
```

### CSS Variables

Each theme defines a complete set of CSS variables that components can reference:

```css
/* Business Light Theme */
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 9%;
  --primary: 0 0% 9%;
  --secondary: 0 0% 96%;
  /* ... */
}

/* Business Dark Theme */
.business-dark {
  --background: 0 0% 9%;
  --foreground: 0 0% 98%;
  /* ... */
}
```

## Usage Guidelines

### For Developers

1. **Always use CSS variables** for colors instead of hardcoded values
2. **Use the theme hooks** for conditional styling based on theme type/mode
3. **Mark components as 'use client'** when using theme hooks
4. **Test all interactive states** (hover, focus, active) in each theme
5. **Ensure accessibility compliance** across all themes

### Component Development

```typescript
'use client';

import { useThemeClasses } from '@/components/Global/ThemeAwareWrapper';

export function MyComponent() {
  const { getClasses, isBusinessTheme } = useThemeClasses();

  return (
    <div className={getClasses({
      base: 'p-4 rounded-lg',
      business: 'border border-border bg-card',
      neon: 'border border-accent2/80 bg-light-500/30',
    })}>
      {/* Component content */}
    </div>
  );
}
```

## Accessibility Features

- **High contrast support** for users with visual impairments
- **Reduced motion support** for users with vestibular disorders
- **Proper focus indicators** for keyboard navigation
- **WCAG 2.1 AA compliance** across all themes
- **Screen reader compatibility** with proper ARIA labels

## Migration from Legacy Themes

The system maintains backward compatibility with the original light/dark themes:

- Legacy `light` theme maps to `neon-light`
- Legacy `dark` theme maps to `neon-dark`
- Existing components continue to work without modification

## Testing

Use the Theme Debugger component to test all theme combinations:

```typescript
import ThemeDebugger from '@/components/Debug/ThemeDebugger';

// Add to any page for testing
<ThemeDebugger />
```

## Performance Considerations

- **CSS variables** provide efficient theme switching without re-rendering
- **Minimal JavaScript** for theme management
- **Optimized bundle size** with tree-shaking support
- **Fast theme transitions** with CSS-only animations

## Browser Support

- Modern browsers with CSS custom properties support
- Graceful degradation for older browsers
- Progressive enhancement approach

## Testing Checklist

### Manual Testing

- [ ] All four themes render correctly
- [ ] Theme switching works without page refresh
- [ ] Theme preferences persist across sessions
- [ ] All interactive elements work in each theme
- [ ] Focus indicators are visible in all themes
- [ ] Text contrast meets accessibility standards
- [ ] Components adapt properly to theme changes

### Automated Testing

```typescript
// Example test structure
describe('Theme System', () => {
  test('should switch between all theme combinations', () => {
    // Test theme switching functionality
  });

  test('should persist theme preferences', () => {
    // Test localStorage persistence
  });

  test('should maintain accessibility standards', () => {
    // Test contrast ratios and focus indicators
  });
});
```

## Troubleshooting

### Common Issues

1. **Hydration Mismatch**: Ensure components using theme hooks are marked with 'use client'
2. **Theme Not Persisting**: Check localStorage and next-themes configuration
3. **CSS Variables Not Working**: Verify theme classes are applied to document body
4. **Component Not Updating**: Ensure proper use of theme hooks and mounted state

### Debug Tools

- Use the ThemeDebugger component to visualize current theme state
- Check browser DevTools for applied CSS classes
- Verify CSS variables in computed styles
- Test with different system preferences

## Future Enhancements

- Additional theme types (e.g., high contrast, colorblind-friendly)
- User-customizable accent colors
- Automatic theme switching based on time of day
- Integration with system accessibility preferences
- Theme preview functionality
- Advanced color palette customization

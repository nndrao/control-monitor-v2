/**
 * AG-Grid Theme Configuration — shadcn/ui Notion
 *
 * Colors aligned with the Notion-inspired design system.
 * Font: System fonts (matching the app's body font).
 *
 * Light: white background, warm grays (#37352f text, #f7f7f5 hover)
 * Dark: Notion dark (#191919 bg, #202020 card, #252525 muted)
 */

import { themeQuartz } from 'ag-grid-community';

// ─── Light Theme (Notion-inspired) ──────────────────────────────────────────
export const agGridLightTheme = themeQuartz.withParams({
  // Surfaces
  backgroundColor: "#fafaf9",              // Notion warm white
  oddRowBackgroundColor: "#f7f7f5",        // Notion hover color
  foregroundColor: "#37352f",              // Notion text color

  // Borders
  borderColor: "#e9e9e7",                  // Notion border
  columnBorder: true,

  // Interactive
  accentColor: "#37352f",                  // Notion dark text

  // Chrome (header area)
  chromeBackgroundColor: "#ffffff",        // Pure white
  headerFontSize: 13,

  // Typography — System fonts
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  fontSize: 12,

  // Geometry
  borderRadius: 4,
  wrapperBorderRadius: 8,

  // Spacing
  spacing: 6,
  browserColorScheme: "light",
});

// ─── Dark Theme (Notion dark) ────────────────────────────────────────────────
export const agGridDarkTheme = themeQuartz.withParams({
  // Surfaces — Notion dark
  backgroundColor: "#191919",              // Notion dark bg
  oddRowBackgroundColor: "#202020",        // Notion card
  foregroundColor: "rgba(255,255,255,0.87)", // Notion dark text

  // Chrome — slightly elevated surface
  chromeBackgroundColor: "#252525",        // Notion muted

  // Borders
  borderColor: "#333333",                  // Notion dark border
  columnBorder: true,

  // Interactive
  accentColor: "rgba(255,255,255,0.87)",  // Light text

  // Typography
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  fontSize: 12,
  headerFontSize: 13,

  // Geometry
  borderRadius: 4,
  wrapperBorderRadius: 8,

  // Spacing
  spacing: 6,
  browserColorScheme: "dark",
});

/**
 * Helper function to get the appropriate AG-Grid theme based on current theme mode
 * @param mode - 'light' or 'dark'
 * @returns The appropriate AG-Grid theme
 */
export function getAgGridTheme(mode: 'light' | 'dark') {
  return mode === 'dark' ? agGridDarkTheme : agGridLightTheme;
}

/**
 * Helper function to apply AG-Grid theme dynamically
 * Use this when the theme changes at runtime
 * @param mode - 'light' or 'dark'
 * @param gridApi - Optional AG-Grid API instance to refresh
 */
export function setAgGridThemeMode(mode: 'light' | 'dark', gridApi?: any) {
  const theme = getAgGridTheme(mode);

  // If gridApi is provided, refresh the grid to apply new theme
  if (gridApi) {
    gridApi.refreshCells({ force: true });
  }

  return theme;
}

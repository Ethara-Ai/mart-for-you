[ ] The App test is having trouble because the ErrorFallback component (ErrorBoundary) is using `useTheme` outside of a ThemeProvider. This is a bug in the app - the ErrorFallback should be inside the provider or shouldn't use theme. 
[ ] the OffersPage has two H1 headings (one from Hero, one from the page itself). This is actually a semantic issue (pages should only have one H1)

# Pantry Chef – Naming Conventions Quick Reference

| Category     | Convention                 | Example                 |
| ------------ | -------------------------- | ----------------------- |
| Folders      | lowercase                  | `components/`           |
| Components   | `PascalCase.tsx`           | `PantryItemCard.tsx`    |
| Screens      | `PascalCaseScreen.tsx`     | `HomeScreen.tsx`        |
| Hooks        | `useSomething.ts`          | `usePantry.ts`          |
| Services     | `somethingService.ts`      | `pantryService.ts`      |
| Types        | `something.types.ts`       | `pantry.types.ts`       |
| Utils        | `somethingHelpers.ts`      | `dateHelpers.ts`        |
| Variables    | camelCase                  | `pantryItems`           |
| Functions    | verb-first camelCase       | `fetchRecipes()`        |
| Booleans     | `is/has/can/should` prefix | `isExpired`             |
| Arrays       | always plural              | `recipes`               |
| Global const | UPPER_SNAKE_CASE           | `API_BASE_URL`          |
| Local const  | camelCase                  | `defaultExpirationDays` |
| Context      | `PascalCase + Context`     | `PantryContext.tsx`     |
| Styles       | descriptive camelCase      | `cardHeader`            |

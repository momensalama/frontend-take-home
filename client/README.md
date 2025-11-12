# Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Critical Bug Fixed](#critical-bug-fixed)
- [Technical Decisions](#technical-decisions)
- [Future Improvements](#future-improvements)

---

> **Note on Commit Messages:** All commit messages in this repository end with "(This commit message was AI-generated.)" This is because I use VS Code with custom instructions to generate conventional commit messages with AI assistance, rather than writing each commit message manually. This helps maintain consistent commit message formatting throughout the project.

## Features

**Interactive Data Table**

- Display shipping load data with 8 columns: Load ID, Origin, Destination, Status, Date, Weight, Carrier, Price
- Responsive table design with hover effects
- Color-coded status badges for visual clarity

**Smart Filtering System**

- Real-time text search across Load ID, Origin, and Destination
- Debounced search input (500ms) to reduce unnecessary API calls
- Dynamic status dropdown filter (populated from API)
- Dynamic carrier dropdown filter (populated from API)
- Filters work together (AND logic)
- **URL state persistence** - filters and pagination state are saved in URL for shareable links

**Pagination**

- Navigate through loads with Previous/Next buttons
- Shows current page and total pages
- 10 items per page
- Automatic reset to page 1 when filters change

**Enhanced UX**

- Loading skeleton screens during data fetch
- Proper error state handling
- Empty state message when no results found
- Smooth transitions and visual feedback
- Browser back/forward button support (URL-based state)
- Shareable URLs with filter state (e.g., `/loads?status=5943&carrier=7284&search=Los&page=2`)

## Technology Stack

- **React 19.2** - UI library with hooks
- **TypeScript 5.9** - Static type checking
- **Vite 7.2** - Fast build tool and dev server
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **Native Fetch API** - HTTP client (no external dependencies needed)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- The mock API server must be running on `http://localhost:3001`

### Installation & Running

**Install dependencies:**

```bash
cd client
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

## API Dependencies

This application requires the mock API server to be running at `http://localhost:3001`.

**API Endpoints Used:**

- `GET /api/loads` - Fetch paginated and filtered loads
- `GET /api/statuses` - Fetch status options
- `GET /api/carriers` - Fetch carrier options

See the main project README for API setup instructions and documentation.

## Project Structure

```
src/
├── components/
│   ├── LoadsTable.tsx              # Main container
│   └── LoadsTable                 # Subcomponents (FilterBar, Table, Pagination, etc.)
├── hooks/
│   ├── useDebounce.ts              # Debounce hook
│   └── useURLState.ts              # URL state sync
├── services/
│   └── api.ts                      # API layer
├── types/
│   └── index.ts                    # TypeScript interfaces
└── App.tsx, main.tsx, index.css
```

## Critical Bug Fixed

### The Problem: Filter Dropdowns Not Working

During testing, I discovered that the **Status and Carrier filter dropdowns were not working** and selecting any filter would return zero results, even though the data existed.

### Debugging Process

1. **Initial Observation:**

   - Text search worked perfectly
   - Status and Carrier filters always returned empty results
   - No errors in console

2. **API Testing:**

   ```bash
   curl "http://localhost:3001/api/loads?status=5943"
   # Result: {"data":[],"pagination":{...}}  <- Empty!
   ```

3. **Data Inspection:**

   - Verified that loads with `status: 5943` existed in the data
   - Confirmed filter values were being sent correctly from client

4. **Root Cause Identified:**
   Located the bug in `server/server.js` (lines 52-58):
   ```javascript
   // Status filter (AND condition)
   if (status && load.status !== status) {
     return false;
   }
   ```

### The Root Cause

**Type Mismatch in Comparison:**

- **Data in JSON:** Status and Carrier IDs are stored as **numbers**

  ```json
  { "id": "LD001", "status": 5943, "carrier": 7284 }
  ```

- **HTTP Query Parameters:** Always received as **strings**

  ```
  GET /api/loads?status=5943
                        ↑
                  String "5943" (not number 5943)
  ```

- **The Comparison:**
  ```javascript
  if (status && load.status !== status) {
    //     5943    !==    "5943"    <- Different types!
    //     ↑              ↑
    //   number         string
  ```

In JavaScript, the strict inequality operator (`!==`) checks **both value and type**. Since `5943 !== "5943"` is `true`, every record was incorrectly filtered out.

### The Solution

Fixed the type coercion issue by parsing the query parameters to integers before comparison:

```javascript
// server/server.js (lines 52-58)

// Status filter and convert string to number
if (status && load.status !== parseInt(status, 10)) {
  return false;
}

// Carrier filter and convert string to number
if (carrier && load.carrier !== parseInt(carrier, 10)) {
  return false;
}
```

**Why `parseInt(status, 10)`:**

- Converts the string `"5943"` to the number `5943`
- The `10` parameter ensures base-10 (decimal) parsing
- Now both sides of the comparison are numbers: `5943 !== 5943` → `false` (correct!)

### Impact

**Before Fix:**

- Status filter: 0 results (always)
- Carrier filter: 0 results (always)

**After Fix:**

- Status filter: Returns correct filtered results
- Carrier filter: Returns correct filtered results
- Combined filters: Works with AND logic as expected

### Why Fix on Server, Not Client?

The fix **must** be on the server because:

- Query parameters are strings by nature (HTTP protocol limitation)
- The comparison happens server-side where the data lives
- The client is already sending correct data
- Fixing the server makes the API more robust for any client

## Technical Decisions

### 1. **Custom Hooks**

Created `useDebounce` and `useURLState` hooks to encapsulate complex logic:

- `useDebounce` - Delays API calls to reduce server load (reduces ~100 calls to 1 per search)
- `useURLState` - Syncs filter state with URL for shareable links and browser navigation

**Why:** Separates concerns, improves testability, and enables reusability across the application.

### 2. **Modular Component Architecture**

Split the application into 7 focused components (FilterBar, Table, Pagination, StatusBadge, LoadingSkeleton, ErrorState, EmptyState) plus the main container.

**Why:** Single responsibility principle enables independent testing, easier maintenance, and better scalability. Changes to one component don't affect others.

### 3. **TypeScript for Type Safety**

Comprehensive TypeScript interfaces for all data structures (Load, Status, Carrier, Pagination, etc.).

**Why:** Catch errors at compile time, provide IDE autocomplete, and serve as self-documenting code.

### 4. **API Service Layer**

Dedicated `api.ts` service file for all HTTP calls instead of inline fetch operations.

**Why:** Centralized configuration, easier mocking for tests, and single location for error handling or authentication logic.

### 5. **Skeleton Screens**

Loading states use skeleton screens instead of spinners or text.

## Future Improvements

Given more time, here are optimizations and features I would implement:

### Testing

- Unit tests with Vitest and React Testing Library
- E2E tests with Playwright for critical user flows
- Test hooks and API service in isolation

### Performance

- React.memo and useMemo to prevent unnecessary re-renders
- Request caching with React Query

### Features

- Column sorting (by date, weight, price, etc.)
- Advanced filters (date range, min/max price/weight, multi-select)
- Export to CSV/Excel
- Real-time updates via WebSocket

### Accessibility

- ARIA labels and keyboard navigation
- WCAG AA color contrast compliance
- Screen reader testing

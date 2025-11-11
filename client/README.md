# Shipping Loads Client Application

A React-based web application for managing and viewing shipping loads with advanced filtering and pagination capabilities.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Critical Bug Fixed](#critical-bug-fixed)
- [Technical Decisions](#technical-decisions)
- [Future Improvements](#future-improvements)

## Features

✅ **Interactive Data Table**

- Display shipping load data with 8 columns: Load ID, Origin, Destination, Status, Date, Weight, Carrier, Price
- Responsive table design with hover effects
- Color-coded status badges for visual clarity

✅ **Smart Filtering System**

- Real-time text search across Load ID, Origin, and Destination
- Debounced search input (500ms) to reduce unnecessary API calls
- Dynamic status dropdown filter (populated from API)
- Dynamic carrier dropdown filter (populated from API)
- Filters work together (AND logic)
- **URL state persistence** - filters and pagination state are saved in URL for shareable links

✅ **Pagination**

- Navigate through loads with Previous/Next buttons
- Shows current page and total pages
- 10 items per page
- Automatic reset to page 1 when filters change

✅ **Enhanced UX**

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

1. **Install dependencies:**

```bash
npm install
```

2. **Start the development server:**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

3. **Build for production:**

```bash
npm run build
```

4. **Preview production build:**

```bash
npm run preview
```

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   └── LoadsTable.tsx      # Main table component with all logic
│   ├── services/
│   │   └── api.ts              # API service layer with type-safe methods
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces and types
│   ├── App.tsx                 # Root component
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global styles with Tailwind directives
├── public/                      # Static assets
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Critical Bug Fixed

### 🐛 The Problem: Filter Dropdowns Not Working

During testing, I discovered that the **Status and Carrier filter dropdowns were not working** - selecting any filter would return zero results, even though the data existed.

### 🔍 Debugging Process

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

### 💡 The Root Cause

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

### ✅ The Solution

Fixed the type coercion issue by parsing the query parameters to integers before comparison:

```javascript
// server/server.js (lines 52-58)

// Status filter - convert string to number
if (status && load.status !== parseInt(status, 10)) {
  return false;
}

// Carrier filter - convert string to number
if (carrier && load.carrier !== parseInt(carrier, 10)) {
  return false;
}
```

**Why `parseInt(status, 10)`:**

- Converts the string `"5943"` to the number `5943`
- The `10` parameter ensures base-10 (decimal) parsing
- Now both sides of the comparison are numbers: `5943 !== 5943` → `false` (correct!)

### 📊 Impact

**Before Fix:**

- Status filter: ❌ 0 results (always)
- Carrier filter: ❌ 0 results (always)

**After Fix:**

- Status filter: ✅ Returns correct filtered results
- Carrier filter: ✅ Returns correct filtered results
- Combined filters: ✅ Works with AND logic as expected

### 🎓 Key Learnings

1. **HTTP query parameters are always strings** - regardless of what the client sends
2. **Strict comparison operators (`===`, `!==`) don't perform type coercion** - this is usually good, but requires awareness
3. **Type safety is critical** - TypeScript on the client helped, but the server needed runtime validation
4. **Always test the API directly** - using `curl` or Postman helps isolate frontend vs backend issues

### 🔧 Why Fix on Server, Not Client?

The fix **must** be on the server because:

- Query parameters are strings by nature (HTTP protocol limitation)
- The comparison happens server-side where the data lives
- The client is already sending correct data
- Fixing the server makes the API more robust for any client

## Technical Decisions

### 1. **Debounced Search Implementation**

```typescript
// Custom debounce using useEffect
const [searchTerm, setSearchTerm] = useState("");
const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 500);
  return () => clearTimeout(timer);
}, [searchTerm]);
```

**Rationale:** Reduces API calls from ~50-100 per search phrase to just 1, improving performance and reducing server load.

### 2. **Component Architecture**

Kept the application in a single `LoadsTable` component rather than splitting into smaller components.

**Rationale:**

- Application scope is focused and limited
- Single component is easier to understand and maintain for this use case
- No props drilling or state management complexity
- For larger applications, I would split into: `FilterBar`, `Table`, `Pagination`, `StatusBadge` components

### 3. **Type Safety with TypeScript**

Created comprehensive interfaces for all data structures:

```typescript
interface Load {
  id: string;
  origin: string;
  destination: string;
  status: number;
  date: string;
  weight: number;
  carrier: number;
  price: number;
}
```

**Rationale:** Catches errors at compile time, provides autocomplete, and serves as documentation.

### 4. **API Service Layer**

Separated API logic into a dedicated service file rather than inline fetch calls.

**Rationale:**

- Centralized API configuration (base URL)
- Reusable methods across components
- Easier to mock for testing
- Single place to add error handling, retry logic, or authentication

### 5. **Loading States**

Implemented skeleton screens instead of simple "Loading..." text.

**Rationale:**

- Better perceived performance
- Maintains layout stability (no content shift)
- Modern UX pattern users expect
- Shows structure of incoming content

### 6. **URL State Management**

Implemented URL-based state persistence for all filters and pagination using the native History API.

```typescript
// Read initial state from URL on mount
const getInitialStateFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    page: params.get("page") ? parseInt(params.get("page")!, 10) : 1,
    search: params.get("search") || "",
    status: params.get("status") ? parseInt(params.get("status")!, 10) : undefined,
    carrier: params.get("carrier") ? parseInt(params.get("carrier")!, 10) : undefined,
  };
};

// Update URL when filters change
useEffect(() => {
  const params = new URLSearchParams();
  if (currentPage > 1) params.set("page", currentPage.toString());
  if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
  if (selectedStatus) params.set("status", selectedStatus.toString());
  if (selectedCarrier) params.set("carrier", selectedCarrier.toString());

  const newURL = params.toString()
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;

  window.history.pushState({}, "", newURL);
}, [currentPage, debouncedSearchTerm, selectedStatus, selectedCarrier]);
```

**Rationale:**

- **Shareable links** - Users can share filtered views with colleagues
- **Browser navigation** - Back/forward buttons work as expected
- **Bookmark-friendly** - Users can bookmark specific filter combinations
- **No external dependencies** - Uses native browser History API
- **Persistence** - Filter state survives page refreshes
- **Professional UX** - Expected behavior in modern web applications

**Benefits:**
- Example shareable URL: `http://localhost:5173/?status=5943&carrier=7284&search=Los&page=2`
- Filters are restored when sharing or refreshing the page
- Search engines can index different filtered views (if made public)

### 7. **State Management**

Used React's built-in `useState` and `useEffect` hooks.

**Rationale:**

- Sufficient for this application's scope
- No additional dependencies needed
- Easy to understand and maintain
- For larger apps, I'd consider Context API, Zustand, or Redux

## API Dependencies

This application requires the mock API server to be running at `http://localhost:3001`.

**API Endpoints Used:**

- `GET /api/loads` - Fetch paginated and filtered loads
- `GET /api/statuses` - Fetch status options
- `GET /api/carriers` - Fetch carrier options

See the main project README for API setup instructions and documentation.

## License

This is a take-home assignment project.

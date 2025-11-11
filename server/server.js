const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Load data
const loads = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "loads.json"), "utf8")
);
const statuses = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "statuses.json"), "utf8")
);
const carriers = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "carriers.json"), "utf8")
);

// Simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// GET /api/statuses - Return list of status options
app.get("/api/statuses", async (req, res) => {
  await delay(300);
  res.json(statuses);
});

// GET /api/carriers - Return list of carrier options
app.get("/api/carriers", async (req, res) => {
  await delay(300);
  res.json(carriers);
});

// GET /api/loads - Return paginated and filtered loads
app.get("/api/loads", async (req, res) => {
  await delay(300);

  const {
    page = 1,
    limit = 10,
    status = "",
    carrier = "",
    search = "",
  } = req.query;

  // Parse pagination params
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  // Filter loads
  let filteredLoads = loads.filter((load) => {
    // Status filter (AND condition)
    if (status && load.status !== parseInt(status, 10)) {
      return false;
    }

    // Carrier filter (AND condition)
    if (carrier && load.carrier !== parseInt(carrier, 10)) {
      return false;
    }

    // Search filter - searches in origin, destination, and id (AND condition)
    if (search) {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        load.origin.toLowerCase().includes(searchLower) ||
        load.destination.toLowerCase().includes(searchLower) ||
        load.id.toLowerCase().includes(searchLower);

      if (!matchesSearch) {
        return false;
      }
    }

    return true;
  });

  // Calculate pagination
  const totalItems = filteredLoads.length;
  const totalPages = Math.ceil(totalItems / limitNum);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;

  // Get paginated data
  const paginatedLoads = filteredLoads.slice(startIndex, endIndex);

  // Return response
  res.json({
    data: paginatedLoads,
    pagination: {
      page: pageNum,
      limit: limitNum,
      totalItems: totalItems,
      totalPages: totalPages,
      hasNextPage: pageNum < totalPages,
      hasPreviousPage: pageNum > 1,
    },
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "API is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚚 Shipping Loads API running on http://localhost:${PORT}`);
  console.log(`📋 API endpoints:`);
  console.log(`   - GET http://localhost:${PORT}/api/loads`);
  console.log(`   - GET http://localhost:${PORT}/api/statuses`);
  console.log(`   - GET http://localhost:${PORT}/api/carriers`);
  console.log(`   - GET http://localhost:${PORT}/api/health`);
});

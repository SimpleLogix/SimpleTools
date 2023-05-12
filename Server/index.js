const express = require("express");
const dotenv = require("dotenv");

// Load.env file
dotenv.config();

const app = express();

// routes
app.get("/endpoint-1", (req, res, next) => {
  res.status(200).json({
    success: true,
    data: { x: 0 },
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

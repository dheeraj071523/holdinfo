import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import db from "./db.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// For resolving __dirname with ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "../public")));

// Route to fetch top 10 results from the database
app.get("/api/crypto", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM crypto_data LIMIT 10");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch data from WazirX API and store in database
app.get("/api/fetch-and-store", async (req, res) => {
  try {
    const { data } = await axios.get("https://api.wazirx.com/api/v2/tickers");
    const top10 = Object.keys(data).slice(0, 10);

    for (let key of top10) {
      const { name, last, buy, sell, volume, base_unit } = data[key];
      await db.query(
        "INSERT INTO crypto_data (name, last, buy, sell, volume, base_unit) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (name) DO UPDATE SET last = $2, buy = $3, sell = $4, volume = $5, base_unit = $6",
        [name, last, buy, sell, volume, base_unit]
      );
    }

    res.status(200).send("Data stored successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch or store data" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

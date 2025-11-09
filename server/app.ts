import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { ingest } from "./src/ingest";
import path from "path";
import fs from "fs";
import { query } from "./src/query";


dotenv.config();

const app = express();
// ✅ Register CORS before everything else
app.use(cors()); 
app.use(express.json());
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ Created uploads directory:", uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});
const upload = multer({ storage });

app.post("/api/ingest", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Path to the temporarily saved file
    const filePath = path.resolve(req.file.path);

    console.log(`📁 File uploaded to: ${filePath}`);

    try {
    await ingest(filePath);
    console.log("✅ Ingestion completed successfully");
    } catch (ingestError) {
      console.error("❌ Ingestion failed:", ingestError);
      return res.status(500).json({ error: "Ingestion failed" });
    }

    // (Optional) delete the file after ingestion
    fs.unlink(filePath, (err) => {
      if (err) console.warn("⚠️ Failed to delete temp file:", err);
      else console.log("🧹 Temp file deleted:", filePath);
    });

    res.status(200).json({ message: "File ingested successfully" });
  } catch (error) {
    console.error("❌ Error during ingestion:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/query", async (req, res) => {
  const { question } = req.body;
  console.log(`❓ Received question: ${question}`);
  const answer = await query(question)
  res.json({ answer:answer });
})

const PORT = 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
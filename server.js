import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

app.post("/upload-room", upload.single("room"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file" });

  res.json({
    success: true,
    filename: req.file.filename
  });
});

app.post("/save-project", (req,res)=>{
  fs.writeFileSync("project.json", JSON.stringify(req.body,null,2));
  res.json({ saved:true });
});

app.listen(3000,()=>console.log("Backend running on port 3000"));

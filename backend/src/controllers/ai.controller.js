const { exec } = require("child_process");
const path = require("path");

exports.generateRoomDesign = async (req, res) => {
  try {
    const { style, room, color, lighting } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const inputImage = req.file.filename;
    const outputImage = `gen_${Date.now()}.png`;

    // ✅ ABSOLUTE PATHS (CRITICAL)
    const pythonPath = path.join(__dirname, "../../python/generate_room.py");
    const inputPath  = path.join(__dirname, "../../uploads_ai", inputImage);
    const outputPath = path.join(__dirname, "../../generated_ai", outputImage);

    // ✅ FINAL COMMAND (ONLY THIS GOES TO EXEC)
    const command = `python "${pythonPath}" "${inputPath}" "${outputPath}" "${style}" "${room}" "${color}" "${lighting}"`;

    console.log("Running command:", command);

    exec(command, (err) => {
      if (err) {
        console.error("Python error:", err);
        return res.status(500).json({ error: "AI generation failed" });
      }

      res.json({
        originalImage: `http://localhost:5000/uploads_ai/${inputImage}`,
        generatedImage: `http://localhost:5000/generated_ai/${outputImage}`,
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

import express from "express";
import mongoose from "mongoose";
import shortUrl from "./models/shortUrl.js";

mongoose.connect("mongodb://localhost:27017/shorturl", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const shortUrls = await shortUrl.find();
  res.render("index", { shortUrls });
});

app.post("/shorturl", async (req, res) => {
  try {
    await shortUrl.create({ full: req.body.url }); // Fix is here
    res.redirect("/");
  } catch (err) {
    console.error("Error creating short URL:", err);
    res.status(400).send("Failed to shorten URL");
  }
});

app.get("/:shortUrl", async (req, res) => {
  const found = await shortUrl.findOne({ short: req.params.shortUrl });
  if (!found) return res.sendStatus(404);

  found.clicks++;
  await found.save();

  res.redirect(found.full);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

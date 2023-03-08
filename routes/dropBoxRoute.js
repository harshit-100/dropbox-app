const express = require("express");
const fileUploading = require("../models/dropBoxSchema");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/data/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

//creae record
router.post("/", upload.single("file"), async (req, res) => {
  const dropBox = await fileUploading.create({
    createdBy: req.user._id,
    file: `/data/${req.file.filename}`,
  });
  return res.status(201).redirect("/");
});

//Delete route
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params.id;
    await fileUploading.deleteOne(id);
    return res.status(200).redirect("/");
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = router;

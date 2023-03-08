const { Schema, model } = require("mongoose");

const dropBoxSchema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
    },
    file: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const dropBox = model("dropBox", dropBoxSchema);

module.exports = dropBox;

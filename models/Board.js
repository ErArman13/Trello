const { Schema, model } = require("mongoose");

const BoardSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = model("Board", BoardSchema);

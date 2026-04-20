const { Schema, model } = require("mongoose");

const IssueSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Todo", "In Progress", "Done"],
      default: "Todo",
    },
    board: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = model("Issue", IssueSchema);

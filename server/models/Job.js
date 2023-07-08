const { Schema, model } = require("mongoose");
const NoteSchema = require('./Note')
const dateFormat = require("../utils/dateFormat");

const JobSchema = new Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
      trim: true,
    },
    dateSubmitted: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp),
    },
    notes: [NoteSchema],
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

JobSchema.virtual('noteCount').get(function() {
  return this.notes.length;
})

const Job = model("Job", JobSchema);

module.exports = Job;

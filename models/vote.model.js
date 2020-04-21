const mongoose = require("mongoose");

const VoteSchema = mongoose.Schema(
    {
        vote: Number,
        parentId: String,
        createdBy: Object
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Vote", VoteSchema);
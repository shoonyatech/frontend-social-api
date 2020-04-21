const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema(
  {
    parentId:String,
    comment:String,
    rating: Number,
    createdTime: String,
    createdBy: Object,
    replies:[]
  },
  {
    timestamps: true,
  }
);

const ReplySchema = mongoose.Schema(
    {
      reply:String,
      createdTime: String,
      createdBy: Object,
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model("Comment", CommentSchema);

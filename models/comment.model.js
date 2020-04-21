const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema(
  {
    parentId:String,
    commentText:String,
    rating: Number,
    createdBy: Object,
    replies:[]
  },
  {
    timestamps: true,
  }
);

const ReplySchema = mongoose.Schema(
    {
      replyText:String,
      createdTime: String,
      createdBy: Object,
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model("Comment", CommentSchema);

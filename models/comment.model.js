const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema(
  {
    parentId:String,  //Will have GUID of Course/Tool/etc
    commentId:String,  //Added ID
    comment:String,
    createdTime: String,
    createdBy: Object,
    replies:[ReplySchema]
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

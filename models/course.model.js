const mongoose = require("mongoose");

const CourseSchema = mongoose.Schema(
    {
        courseName: String,
        technology: String,
        description: String,
        createdBy: Object,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Course", CourseSchema);
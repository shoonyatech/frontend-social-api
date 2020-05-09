const mongoose = require("mongoose");

const CourseSchema = mongoose.Schema(
    {
        title: String,
        technology: String,
        description: String,
        introductoryVideoId: String,
        chapters: [
            {
                title: String,
                description: String,
                aboutAuthor: String,
                sections: [
                    {
                        title: String,
                        codeLink: String,
                        videoId: String,
                        codeSubtitle: [
                            {
                                time: String,
                                file: String,
                                line: String
                            }
                        ]
                    }
                ]
            }
        ],
        createdBy: Object,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Course", CourseSchema);
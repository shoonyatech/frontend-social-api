const Course = require("../models/course.model.js");
const { getAppliedFilters } = require("../utils/helperMethods");
const { filterTypes } = require("../utils/constants");
const { getExplicitFilters } = require("../utils/jobUtils");

exports.create = (req, res) => {
    const course = new Course({ ...req.body, createdBy: req.user });
    course
        .save()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the course."
            });
        });
};

// Retrieve and return all courses from the database.
exports.findAll = (req, res) => {
    const {
        searchText,
        skills = "",
    } = req.query;
    let filterObj = {};
    let filter = []

    const skillFilter = getAppliedFilters(skills, filterTypes.SKILL);
    const response = {
        results: [],
        meta: { filters: { skills: skillFilter } }
    };

    if (searchText) {
        filter.push({
            $or: [
                { title: { $regex: searchText, $options: "i" } },
                { description: { $regex: searchText, $options: "i" } }
            ]
        });
    }

    if (skills) {
        let requiredSkills = skills.split(",");
        if (requiredSkills.length) {
            filter.push({
                ["$or"]: [{ technology: { $in: requiredSkills } }]
            });
        }
    }

    if (filter.length) {
        filterObj = {
            $and: filter
        };
    }

    const limit = Number(req.query.limit) || 100
    const page = Number(req.query.page) || 1
    Course.find(filterObj)
        .sort({ createdAt: "descending" })
        .limit(limit)
        .skip(limit * (page - 1))
        .then(courses => {
            if (courses.length) {
                response.results = courses;
            }
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving courses."
            });
        });
};

// Find a single course with a id
exports.findOne = (req, res) => {
    Course.findById(req.params.id)
        .then(course => {
            if (!course) {
                return res.status(404).send({
                    message: "course not found with id " + req.params.id
                });
            }
            res.send(course);
        })
        .catch(err => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    message: "course not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error retrieving course with id " + req.params.id
            });
        });
};

// Update a course identified by the id in the request
exports.update = (req, res) => {
    Course.findByIdAndUpdate(
        req.params.id,
        {
            ...req.body
        },
        { new: true }
    )
        .then(course => {
            if (!course) {
                return res.status(404).send({
                    message: "course not found with id " + req.params.id
                });
            }
            res.send(course);
        })
        .catch(err => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    message: "course not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error updating course with id " + req.params.id
            });
        });
};

// Delete a course with the specified id in the request
exports.delete = (req, res) => {
    Course.findByIdAndRemove(req.params.id)
        .then(course => {
            if (!course) {
                return res.status(404).send({
                    message: "course not found with id " + req.params.id
                });
            }
            res.send({ message: "course deleted successfully!" });
        })
        .catch(err => {
            if (err.kind === "ObjectId" || err.name === "NotFound") {
                return res.status(404).send({
                    message: "course not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Could not delete course with id " + req.params.id
            });
        });
};

const Blog = require("../models/blog.model.js");

exports.create = (req, res) => {
    const blog = new Blog({ ...req.body, createdBy: req.user });
    blog
        .save()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the blog."
            });
        });
};

// Retrieve and return all blogs from the database.
exports.findAll = async (req, res) => {
    const {
        searchText,
        skills = "",
    } = req.query;
    let filterObj = {};
    let filter = []

    if (searchText) {
        filter.push({
            $or: [
                { title: { $regex: searchText, $options: "i" } }
            ]
        });
    }

    if (filter.length) {
        filterObj = {
            $and: filter
        };
    }

    const limit = Number(req.query.limit) || 100
    const page = Number(req.query.page) || 1

    Blog.find(filterObj)
        .sort({ createdAt: "descending" })
        .limit(limit)
        .skip(limit * (page - 1))
        .then(blogs => {
            if (blogs.length) {
                response.results = blogs;
            }
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving blogs."
            });
        });
};

// Find a single blog with a id
exports.findOne = (req, res) => {
    Blog.findById(req.params.id)
        .then(blog => {
            if (!blog) {
                return res.status(404).send({
                    message: "blog not found with id " + req.params.id
                });
            }
            res.send(blog);
        })
        .catch(err => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    message: "blog not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error retrieving blog with id " + req.params.id
            });
        });
};

// Update a blog identified by the id in the request
exports.update = (req, res) => {
    Blog.findByIdAndUpdate(
        req.params.id,
        {
            ...req.body
        },
        { new: true }
    )
        .then(blog => {
            if (!blog) {
                return res.status(404).send({
                    message: "blog not found with id " + req.params.id
                });
            }
            res.send(blog);
        })
        .catch(err => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    message: "blog not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Error updating blog with id " + req.params.id
            });
        });
};

// Delete a blog with the specified id in the request
exports.delete = (req, res) => {
    Blog.findByIdAndRemove(req.params.id)
        .then(blog => {
            if (!blog) {
                return res.status(404).send({
                    message: "blog not found with id " + req.params.id
                });
            }
            res.send({ message: "blog deleted successfully!" });
        })
        .catch(err => {
            if (err.kind === "ObjectId" || err.name === "NotFound") {
                return res.status(404).send({
                    message: "blog not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Could not delete blog with id " + req.params.id
            });
        });
};
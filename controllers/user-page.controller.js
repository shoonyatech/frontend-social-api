const UserPage = require("../models/user-page.model.js");

// Create and Save a new userPage
exports.create = (req, res) => {
    const userPage = new UserPage({ ...req.body, url: req.headers.referer, createdBy: req.user });

    // Delete and Save userPage in the database
    UserPage.deleteMany({ username: req.user.username })
        .then((response) => {
            userPage.save()
                .then((data) => {
                    res.send(data);
                })
                .catch((err) => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while creating the userPage.",
                    });
                });
        })
};

// Delete a userPage by user
exports.delete = (req, res) => {
    UserPage.deleteMany({ username: req.user.username, url: req.headers.referer })
        .then((comment) => {
            if (!comment) {
                return res.status(404).send({
                    message: "userpage not found with id " + req.params.id,
                });
            }
            res.send({ message: "userpage deleted successfully!" });
        })
        .catch((err) => {
            if (err.kind === "ObjectId" || err.name === "NotFound") {
                return res.status(404).send({
                    message: "userpage not found with url " + req.params.url,
                });
            }
            return res.status(500).send({
                message: "Could not delete userpage with url " + req.params.url,
            });
        });
};

//Get All user online
exports.findAllUserByURL = (req, res) => {
    UserPage.find({ url: req.headers.referer })
        .then((users) => {
            users = users.filter(x => (req.body.currentTime - x.createdTime) / 1000 <= 10)
            res.send(users);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving userPages.",
            });
        });
};

exports.getUserCountByURL = (req, res) => {
    UserPage.find({ url: req.body.url })
        .then((users) => {
            res.send({ "userCount": users.length });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving userPages.",
            });
        });
}
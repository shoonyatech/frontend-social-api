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

// //Get All user online
// exports.findAllUserByURL = (req, res) => {
//     UserPage.find({ url: req.headers.referer })
//         .then((users) => {
//             users = users.filter(x => (req.body.currentTime - x.createdTime) / 1000 <= 15)
//             users.sort(compare);
//             res.send(users);
//         })
//         .catch((err) => {
//             res.status(500).send({
//                 message: err.message || "Some error occurred while retrieving userPages.",
//             });
//         });
// };

//Get All user online
exports.findAllUserByURL = (req, res) => {
    var createdBy = {
        username: req.body.username, avatar: req.body.avatar,
        name: req.body.name
    }

    var pageURL = req.headers.referer;
    if (pageURL.includes('join-meeting')) {
        pageURL = pageURL.split('?')[0];
    }
    const userPage = new UserPage({ ...req.body, url: pageURL, createdBy });

    // Delete and Save userPage in the database
    UserPage.deleteMany({ username: req.body.username })
        .then((response) => {
            //console.log(response)
            userPage.save()
                .then((data) => {
                    //conysole.log(data)
                    UserPage.find({ url: pageURL })
                        .then((users) => {
                            users = users.filter(x => (req.body.currentTime - x.createdTime) / 1000 <= 15)
                            users.sort(compare);
                            res.send(users);
                        })
                })
                .catch((err) => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while creating the userPage.",
                    });
                });
        })
};

function compare(a, b) {
    if (a.username < b.username) {
        return -1;
    }
    if (a.username > b.username) {
        return 1;
    }
    return 0;
}


exports.getUserCountByURL = (req, res) => {
    var pageURL = req.body.url;
    if (pageURL.includes('?')) {
        pageURL = pageURL.split('?')[0];
    }
    UserPage.find({ url: pageURL })
        .then((users) => {
            users = users.filter(x => (Date.now() - x.createdTime) / 1000 <= 15)
            res.send({ "userCount": users.length });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving userPages.",
            });
        });
}
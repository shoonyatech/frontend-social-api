const FreelanceJobApply = require("../models/freelanceJobApply.model.js");

exports.create = (req, res) => {
  const freelance = new FreelanceJobApply({
    ...req.body,
  });

  // Save freelancer in the database
  freelance
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the freelancer.",
      });
    });
};
exports.findAll = (req, res) => {
  let andQuery = getQuery(req.query);
  let finalQuery = {};
  if (andQuery.length) {
    finalQuery = { $and: andQuery };
  }

  const limit = Number(req.query.limit) || 100;
  const page = Number(req.query.page) || 1;
  FreelanceJobApply.find(finalQuery)
    .sort({ dateFrom: "descending" })
    .limit(limit)
    .skip(limit * (page - 1))
    .then((freelancers) => {
      res.send(freelancers);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving freelancers.",
      });
    });
};
// Find a single freelance with a id
exports.findOne = (req, res) => {
  FreelanceJobApply.find({ jobId: req.params.id })
    .then((freelance) => {
      if (!freelance) {
        return res.status(404).send({
          message: "freelance not found with username " + req.params.username,
        });
      }
      res.send(freelance);
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          "Error retrieving freelance with username " + req.params.username,
      });
    });
};
function getQuery(query) {
  const { relatedSkills, jobType, Duration, Payment, Budget } = query;

  let skillsQuery = {};
  let jobTypeQuery = {};
  let PaymentQuery = {};
  let workDurationQuery = {};
  let BudgetQuery = {};
  let andQuery = [];

  if (relatedSkills) {
    let skills = relatedSkills.split(",");
    if (skills.length) {
      skillsQuery["$or"] = [{ relatedSkills: { $in: skills } }];
      andQuery.push(skillsQuery);
    }
  }

  if (jobType) {
    let job = jobType.split(",");
    if (job.length) {
      jobTypeQuery["$or"] = [{ jobType: { $in: job } }];
      andQuery.push(jobTypeQuery);
    }
  }

  if (Budget) {
    let amount = Budget.split(",");
    if (amount.length) {
      BudgetQuery["$or"] = [{ budget: { $in: amount } }];
      andQuery.push(BudgetQuery);
    }
  }

  if (Payment) {
    let pay = Payment.split(",");
    if (pay.length) {
      PaymentQuery["$or"] = [{ budgetBasis: { $in: pay } }];
      andQuery.push(PaymentQuery);
    }
  }

  if (Duration) {
    let work = Duration.split(",");
    if (work.length) {
      workDurationQuery["$or"] = [{ workDuration: { $in: work } }];
      andQuery.push(workDurationQuery);
    }
  }
  return andQuery;
}

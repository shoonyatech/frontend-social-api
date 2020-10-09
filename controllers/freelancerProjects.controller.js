const FreelanceProject = require("../models/freelancerProjects.model.js");

exports.create = (req, res) => {
  const freelanceProject = new FreelanceProject({
    ...req.body,
    createdBy: req.user,
  });
  freelanceProject
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the Freelancer Project.",
      });
    });
};

exports.delete = (req, res) => {
  FreelanceProject.findByIdAndRemove(req.params.id)
    .then((freelancerProject) => {
      if (!freelancerProject) {
        return res.status(404).send({
          message: "Freelancer Project not found with id " + req.params.id,
        });
      }
      res.send({ message: "Freelancer Project deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Freelancer Project not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Could not delete Freelancer Project with id " + req.params.id,
      });
    });
};
exports.update = (req, res) => {
  FreelanceProject.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
    },
    { new: true }
  )
    .then((freelancerProject) => {
      if (!freelancerProject) {
        return res.status(404).send({
          message: "Freelancer Project not found with id " + req.params.id,
        });
      }
      res.send(freelancerProject);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Freelancer Project not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Error updating Freelancer Project with id " + req.params.id,
      });
    });
};

// Retrieve and return all freelancers from the database.
exports.findAll = (req, res) => {
  let andQuery = getQuery(req.query);
  let finalQuery = {};
  if (andQuery.length) {
    finalQuery = { $and: andQuery };
  }

  const limit = Number(req.query.limit) || 100;
  const page = Number(req.query.page) || 1;
  FreelanceProject.find(finalQuery)
    .sort({ dateFrom: "descending" })
    .limit(limit)
    .skip(limit * (page - 1))
    .then((freelancerProject) => {
      res.send(freelancerProject);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Freelancer Project.",
      });
    });
};
// Find a single freelance with a id
exports.findOne = (req, res) => {
  FreelanceProject.findById(req.params.id)
    .then((freelancerProject) => {
      if (!freelancerProject) {
        return res.status(404).send({
          message: "Freelancer Project not found with id " + req.params.id,
        });
      }
      res.send(freelancerProject);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Freelancer Project not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Error retrieving Freelancer Project with id " + req.params.id,
      });
    });
};
exports.getAllSkills = async (req, res) => {
  try {
    const skill = await FreelanceProject.find({});
    let skills = skill.reduce((acc, val) => {
      return acc.concat(val.relatedSkills);
    }, []);
    res.send(Array.from(new Set(skills)));
  } catch (err) {
    res.status(500).send(err || "error occurred while getting skills");
  }
};
exports.getAllJobType = async (req, res) => {
  try {
    const job = await FreelanceProject.find({});
    let jobs = job.reduce((acc, val) => {
      return acc.concat(val.jobType);
    }, []);
    res.send(Array.from(new Set(jobs)));
  } catch (err) {
    res.status(500).send(err || "error occurred while getting skills");
  }
};
exports.getAllBudgetBasis = async (req, res) => {
  try {
    const payment = await FreelanceProject.find({});
    let payments = payment.reduce((acc, val) => {
      return acc.concat(val.budgetBasis);
    }, []);
    res.send(Array.from(new Set(payments)));
  } catch (err) {
    res.status(500).send(err || "error occurred while getting skills");
  }
};
exports.getAllBudget = async (req, res) => {
  try {
    const budget = await FreelanceProject.find({});
    let budgets = budget.reduce((acc, val) => {
      return acc.concat(val.budget);
    }, []);
    res.send(Array.from(new Set(budgets)));
  } catch (err) {
    res.status(500).send(err || "error occurred while getting skills");
  }
};
exports.getAllWorkDuration = async (req, res) => {
  try {
    const work = await FreelanceProject.find({});
    let works = work.reduce((acc, val) => {
      return acc.concat(val.workDuration);
    }, []);
    res.send(Array.from(new Set(works)));
  } catch (err) {
    res.status(500).send(err || "error occurred while getting skills");
  }
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

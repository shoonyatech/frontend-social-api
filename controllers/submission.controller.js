const Submission = require("../models/submission.model");

exports.create = async (req, res) => {
  try{
    const submission = new Submission({...req.body, submittedBy: req.user});
    const data = await submission.save();
    res.send(data);
  } catch(err) {
    res.status(500).send(err || 'error occurred while saving submission')
  }
}

exports.getSubmissionsByChallengeId = async (req, res) => {
  try {
   const submissions =  await Submission.find({challengeId: req.params.challengeId});
   res.send(submissions);
  } catch(err) {
    res.status(500).send(err || 'error while fetching submisson for challengeId' + req.params.challengeId);
  }
}

exports.delete = async (req, res) => {
 try{
  const id = req.params.id;
  const submission = await Submission.findByIdAndDelete({id});
  if (!submission) {
    res.status(404).send('submission not found');
  } else {
    res.send(200);;
  }
 } catch(err) {
  res.status(500).send(err || 'error while deleting submisson for submissionId' + req.params.id);
 }
}


exports.upVote = async(req, res) => {
  try {
    const id = req.params.id;
    const submission = Submission.findByIdAndUpdate({id}, {$inc: {'upVote': 1}}, {new: true});
    if (!submission) {
      res.status(400).send('submission not found');
    } else {
      res.send(200)
    }
  } catch( err ) {
    res.status(500).send(err || 'error while upvoting submisson for submissionId' + req.params.id);
  }
}

exports.downVote = async(req, res) => {
  try {
    const id = req.params.id;
    const submission = Submission.findByIdAndUpdate({id}, {$inc: {'downVote': 1}}, {new: true});
    if (!submission) {
      res.status(400).send('submission not found');
    } else {
      res.send(200)
    }
  } catch( err ) {
    res.status(500).send(err || 'error while downVoting submisson for submissionId' + req.params.id);
  }
}

const Submission = require("../models/submission.model");
const Challenge = require("../models/challenge.model");

exports.create = async (req, res) => {
  try{
    const submission = new Submission({...req.body, submittedBy: req.user, upVote: 0, downVote: 0});
    const data = await submission.save();
    res.send(data);
  } catch(err) {
    res.status(500).send(err || 'error occurred while saving submission')
  }
}

exports.getSubmissionsByChallengeId = async (req, res) => {
  try {
    const challengeId = req.params.challengeId;
    const challenge = await Challenge.findById(challengeId);

    if (challenge) {
      let submission;
      if (challenge.published) {
        submissions =  await Submission.find({challengeId: challengeId});
      } else {
        submissions = await Submission.find({challengeId: challengeId, 'submittedBy.username': req.user.username});
      }
      res.send(submissions);
    }

  } catch(err) {
    res.status(500).send(err || 'error while fetching submisson for challengeId' + req.params.challengeId);
  }
}

exports.delete = async (req, res) => {
 try{
  const id = req.params.id;
  const submission = await Submission.findByIdAndDelete(id);
  if (!submission) {
    res.status(404).send('submission not found');
  } else {
    res.send(200);;
  }
 } catch(err) {
  res.status(500).send(err || 'error while deleting submisson for submissionId' + req.params.id);
 }
}


exports.upVote = async (req, res) => {
  return vote(req, res, 1);
}

exports.downVote = async (req, res) => {
  return vote(req, res, -1);
}


const vote = async (req, res, vote) => {
  try {
    const id = req.params.id;
    const submission = await Submission.findById(id);
    if (!submission) {
      return res.status(400).send('submission not found');
    }

    if (!submission.votes) {
      submission.votes = [];
    }

    if (submission.votes.find(x => x.username === req.user.username)) {
      submission.votes = submission.votes.map((x) => {
        if (x.username === req.user.username) {
          return {...x, vote}
        }
        return x;
      });
    } else {
      submission.votes.push({
        username: req.user.username,
        vote,
      });
    }; 

    console.log(submission);

    const updatedValue = await Submission.findByIdAndUpdate(id, submission, {new: true});
    if (!updatedValue) {
      return res.status(400).send('Failed to vote');
    } else {
      return res.status(200).send(submission);
    }
  } catch( err ) {
    res.status(500).send(err || 'error while voting submission for submissionId' + req.params.id);
  }
}
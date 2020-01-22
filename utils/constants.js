const skillFilterSet = [
  {
    name: "React",
    id: "react",
    type: "MULTISELECT",
    selected: false
  },
  {
    name: "Angular",
    id: "angular",
    type: "MULTISELECT",
    selected: false
  },
  {
    name: "Vue",
    id: "vue",
    type: "MULTISELECT",
    selected: false
  },
  {
    name: "Web Components",
    id: "webComponents",
    type: "MULTISELECT",
    selected: false
  }
];

const jobTypeIds = {
  FULL_TIME: "fullTime",
  PART_TIME: "partTime",
  CONTRACT: "contract",
  PERMANENT: "permanent"
};

const jobFilterSet = [
  {
    name: "Full Time",
    id: jobTypeIds.FULL_TIME,
    selected: false,
    group: "jobType",
    groupName: "Job Type",
    type: "MULTISELECT"
  },
  {
    name: "Part Time",
    id: jobTypeIds.PART_TIME,
    selected: false,
    type: "MULTISELECT",
    group: "jobType",
    groupName: "Job Type"
  },
  {
    name: "Contract",
    id: jobTypeIds.CONTRACT,
    selected: false,
    type: "MULTISELECT",
    group: "jobType",
    groupName: "Job Type"
  },
  {
    name: "Permanent",
    id: jobTypeIds.PERMANENT,
    selected: false,
    type: "MULTISELECT",
    group: "jobType",
    groupName: "Job Type"
  }
];

const filterTypes = {
  JOB: "JOB",
  SKILL: "SKILL"
};

module.exports = {
  filterTypes,
  jobFilterSet,
  skillFilterSet,
  jobTypeIds
};

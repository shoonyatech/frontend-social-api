const { jobTypeIds } = require("./constants");
const getJobTypeKey = id => {
  const { CONTRACT, PERMANENT, PART_TIME, FULL_TIME } = jobTypeIds;
  let defaultId;
  switch (id) {
    case CONTRACT:
      return "isContract";
    case PERMANENT:
      return "isPermanent";
    case PART_TIME:
      return "isPartTime";
    case FULL_TIME:
      return "isFullTime";
    default:
      return defaultId;
  }
};

const getJobTypesQuery = (jobFilter = []) => {
  let query = [];
  let jobQuery;
  jobFilter.forEach(({ id, selected }) => {
    if (selected) {
      const jobKey = getJobTypeKey(id);
      query.push({ [jobKey]: true });
    }
  });
  if (query.length) {
    jobQuery = {
      $or: query
    };
  }
  return jobQuery;
};
const getSearchTextQuery = searchText => {
  let searchTextQuery;
  if (searchText) {
    searchTextQuery = {
      $or: [
        { title: { $regex: searchText, $options: "i" } },
        { description: { $regex: searchText, $options: "i" } }
      ]
    };
  }
  return searchTextQuery;
};

const getSkillsQuery = skills => {
  let query;
  if (skills) {
    let requiredSkills = skills.split(",");
    if (requiredSkills.length) {
      query = {
        ["$or"]: [{ skills: { $in: requiredSkills } }]
      };
    }
  }
  return query;
};

const getCityQuery = city => {
  return city ? { $or: [{ city: { $regex: city, $options: "i" } }] } : null;
};

const getCountryQuery = country => {
  return country
    ? { $or: [{ country: { $regex: country, $options: "i" } }] }
    : null;
};

const getLevelQuery = level => {
  return level > -1 ? { $and: [{ level }] } : null;
};

const getExplicitFilters = ({
  searchText,
  skills,
  jobFilter,
  city,
  country,
  level
}) => {
  const explicitFilters = [];
  const searchTextQuery = getSearchTextQuery(searchText);
  const skillsQuery = getSkillsQuery(skills);
  const jobTypesQuery = getJobTypesQuery(jobFilter);
  const cityQuery = getCityQuery(city);
  const countryQuery = getCountryQuery(country);
  const levelQuery = getLevelQuery(level);
  explicitFilters.push(
    searchTextQuery,
    skillsQuery,
    jobTypesQuery,
    cityQuery,
    countryQuery,
    levelQuery
  );
  return explicitFilters.filter(item => !!item);
};

module.exports = {
  getExplicitFilters
};

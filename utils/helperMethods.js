const { filterTypes, jobFilterSet, skillFilterSet } = require("./constants");

const getFiltersSet = type => {
  switch (type) {
    case filterTypes.JOB:
      return jobFilterSet;
    case filterTypes.SKILL:
      return skillFilterSet;
    default:
      return [];
  }
};

const getAppliedFilters = (filters = "", type) => {
  const filterSet = getFiltersSet(type);
  const selectedFilterSet = new Set(filters.split(","));
  return filterSet.map(item => {
    return {
      ...item,
      selected: selectedFilterSet.has(item.id)
    };
  });
};

module.exports = {
  getAppliedFilters
};

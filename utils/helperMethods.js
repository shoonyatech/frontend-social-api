const { filterTypes, jobFilterSet, skillFilterSet } = require("./constants");

const generateUniqueId = (title) => {
  let _t = title.toLowerCase();
  _t = _t
    .trim()
    .replace(/[^\w\s]/gi, "")
    .replace(/ /g, "-");
  return _t;
};

const getFiltersSet = (type) => {
  switch (type) {
    case filterTypes.JOB:
      return jobFilterSet;
    case filterTypes.SKILL:
      return skillFilterSet;
    default:
      return [];
  }
};

const getAppliedFilters = (filters = "", type, filterSet) => {
  if (!filterSet) {
    filterSet = getFiltersSet(type);
  }
  const selectedFilterSet = new Set(filters.split(","));
  return filterSet.map((item) => {
    return {
      ...item,
      selected: selectedFilterSet.has(item.id),
    };
  });
};

module.exports = {
  getAppliedFilters,
  generateUniqueId,
};

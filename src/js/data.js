terms = ["1A", "1B",  "WT1", "2A",  "WT2", "2B",  "WT3",
         "3A", "WT4", "3B",  "WT5", "4A",  "WT6", "4B"];

var workPresets = function(workTermIndex) {
  var presets = [];
  var totalTerms = 6;

  var waterlooEarningsLow = 3520;
  var waterlooEarningsHigh = 5000;
  presets.push({
    name: "Waterloo",
    values: {
      earnings: waterlooEarningsLow + ((waterlooEarningsHigh - waterlooEarningsLow) / totalTerms) * workTermIndex,
      housing: 500,
    }
  });

  var torontoEarningsLow = 3520;
  var torontoEarningsHigh = 5420;
  presets.push({
    name: "Toronto",
    values: {
      earnings: torontoEarningsLow + ((torontoEarningsHigh - torontoEarningsLow) / totalTerms) * workTermIndex,
      housing: 800,
    }
  });

  var sfEarningsLow = 5500;
  var sfEarningsHigh = 7000;
  presets.push({
    name: "San Francisco Bay Area",
    values: {
      earnings: sfEarningsLow + ((sfEarningsHigh - sfEarningsLow) / totalTerms) * workTermIndex,
      housing: 2000,
    }
  });

  var eCoopEarningsLow = 0;
  var eCoopEarningsHigh = 2000;
  presets.push({
    name: "ECoop (in Waterloo)",
    values: {
      earnings: eCoopEarningsLow + ((eCoopEarningsHigh - eCoopEarningsLow) / totalTerms) * workTermIndex,
      housing: 500,
    }
  });

  return presets;
};

var schoolTerm = function(name) {
  return {
    id: name,
    name: "Term " + name,
    fields: [
      {
        id: "tuition",
        name: "Tuition",
        multiplier: -1,
        value: {
          "1A":  4729.00,
          "1B":  4729.00,
          "2A":  4918.00,
          "2B":  5114.00,
          "3A":  5114.00,
          "3B":  5318.00,
          "4A":  5530.00,
          "4B":  5530.00,
        }[name],
      },
      {
        id: "fees",
        name: "School Fees",
        multiplier: -1,
        value: {
          "1A": 1191.67,
          "1B": 1160.67,
          "2A": 1124.24,
          "2B": 1328.43,
          "3A": 1139.38,
          "3B": 1173.35,
          "4A": 1192.35,
          "4B": 1159.15,
        }[name],
      },
      {
        id: "scholarships",
        name: "Scholarships",
        multiplier: 1,
        value: {
          "1A": 2000.00,
        }[name],
        defaults: [
          {
            name: "None",
            value: "0",
          },
          {
            name: "President's Scholarship",
            value: "2000",
          },
        ],
      },
      {
        id: "housing",
        name: "Housing",
        unit: "month",
        multiplier: -4,
        defaults: [
          {
            name: "V1, REV, MKV",
            value: "671.75",
          },
          {
            name: "VeloCity",
            value: "728.75",
          },
          {
            name: "Off-Campus (Cheap)",
            value: "400.00",
          },
          {
            name: "Off-Campus",
            value: "620.00",
          },
          {
            name: "With Parents",
            value: "0.00",
          },
        ],
      },
      {
        id: "living",
        name: "Living Costs",
        detail: "Food, Coffee, etc.",
        multiplier: -4,
        value: 400.00,
        unit: "month",
      },
      {
        id: "earnings",
        name: "Income",
        detail: "Part-Time, Freelance, etc.",
        multiplier: -4,
        unit: "month",
      },
    ],
  };
};

var workTerm = function(name) {
  var index = parseInt(name.replace("WT", ""), 10);
  return {
    id: name,
    name: "Work Term " + index,
    presets: workPresets(index),
    fields: [
      {
        id: "earnings",
        name: "Income",
        multiplier: 4,
        unit: "month",
      },
      {
        id: "housing",
        name: "Housing",
        multiplier: -4,
        unit: "month",
      },
      {
        id: "living",
        name: "Living Costs",
        detail: "Food, Coffee, etc.",
        multiplier: -4,
        value: 400.00,
        unit: "month",
      },
      {
        id: "tuition",
        name: "Tuition",
        detail: "Online Courses",
        multiplier: -1,
        defaults: [
          {
            name: "No Courses",
            value: "0",
          },
          {
            name: "1 Online Course",
            value: "1019.00",
          },
          {
            name: "2 Online Courses",
            value: "2038",
          },
        ],
      },
    ],
  };
};

var term = function(name) {
  var term;
  if (name.indexOf("A") !== -1 || name.indexOf("B") !== -1) {
    term = schoolTerm(name);
  } else {
    term = workTerm(name);
  }

  _.forEach(term.fields, function(field) {
    if (!field.value) {
      if (field.defaults && field.defaults.length) {
        field.value = field.defaults[0].value;
      } else if (term.presets && term.presets.length) {
        var parts = field.id.split("_");
        var attr = parts[parts.length - 1];
        field.value = term.presets[0].values[attr];
      }

      if (!field.value) {
        field.value = 0;
      }

      field.value = Math.round(field.value * 100) / 100;
    }
  });

  return term;
};

var terms = _.map(terms, term);

var data = {
  years: _.reduce(terms, function(acc, term) {
    var termsPerYear = 3;
    if (acc.length === 0) {
      acc.push([term]);
    } else {
      if (acc[acc.length - 1].length < termsPerYear) {
        acc[acc.length - 1].push(term);
      } else {
        acc.push([term]);
      }
    }
    return acc;
  }, []),
};

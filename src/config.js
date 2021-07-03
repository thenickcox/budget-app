const config = {
  budget: {
    total: 250000000,
    warnings: {},
    items: {
      1: {
        name: "Give employees healthcare",
        cost: 1000000,
        description: "This should explain what healthcare is all about.",
        count: 0
      },
      2: {
        name: "Scholarship Programs for Students of Color",
        cost: 1000000,
        count: 0
      },
      3: {
        name: "Cost of living pay increase for all staff and faculty",
        cost: 10000000,
        description:
          "An explanation of the amount of the increase and the implications",
        count: 0
      },
      4: {
        name: "New atheletic facility",
        cost: 40000000,
        count: 2
      },
      5: {
        name: "Per-department Faculty Salary",
        cost: 2000000,
        count: 8,
        thresholds: [
          {
            count: 5,
            effect: "27 faculty jobs will be eliminated"
          }
        ]
      }
    }
  }
};

export default config;

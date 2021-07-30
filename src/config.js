const config = {
  budget: {
    total: 250000000,
    warnings: {},
    items: {
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
      },
      6: {
        name: "International Student Affairs",
        cost: 1000000,
        count: 1
      },
      7: {
        name: "New Engineering Building",
        cost: 73000000,
        count: 1
      },
      8: {
        name: "Business School Renovation",
        cost: 5000000,
        count: 1
      },
      9: {
        name: "Auraria Campus Police Department: Annual",
        cost: 5400000,
        count: 1
      },
      10: {
        name: "House a student for a year",
        cost: 20000,
        count: 10
      },
      11: {
        name: "Feed a student for a year",
        cost: 4080,
        count: 10
      },
      12: {
        name: "Full Ride Scholarship (4 years)",
        cost: 31680,
        count: 10
      },
      13: {
        name: "Childcare for a year",
        cost: 15325,
        count: 5
      }
    }
  }
};

export default config;

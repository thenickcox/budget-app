import React from "react";
import "./styles.css";
import AnimatedNumber from "react-animated-number";
import { CSVDownloader } from "react-papaparse";
import config from "./config";
import map from "lodash.map";
import reduce from "lodash.reduce";
import values from "lodash.values";
import omit from "lodash.omit";
import forEach from "lodash.foreach";
import { dollarFormatter } from "./utils";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.decrement = this.decrement.bind(this);
    this.increment = this.increment.bind(this);
    this.toggleTooltip = this.toggleTooltip.bind(this);
    const remainingTotal = reduce(
      config.budget.items,
      (accum, item) => {
        return accum - item.count * item.cost;
      },
      config.budget.total
    );
    this.state = {
      ...config,
      budget: {
        ...config.budget,
        warnings: {},
        total: remainingTotal
      }
    };
  }

  toggleTooltip(id, show = false) {
    this.setState((prevState) => ({
      ...prevState,
      tooltipShown: show ? id : null
    }));
  }

  decrement(item, id) {
    const updatedCount = item.count - 1;
    const itemThresholds = this.state.budget.items[id].thresholds;
    let warning;
    let shouldBreak;
    forEach(itemThresholds, (threshold) => {
      if (shouldBreak) return;
      if (updatedCount < threshold.count) {
        warning = {
          [`${item.name}:${threshold.count}`]: threshold.effect
        };
        shouldBreak = true;
      }
    });
    const currentWarnings = this.state.budget.warnings;
    let newWarnings;
    if (warning) {
      newWarnings = { ...currentWarnings, ...warning };
    } else {
      newWarnings = currentWarnings;
    }
    this.setState((prevState) => ({
      ...prevState,
      budget: {
        ...prevState.budget,
        total: prevState.budget.total + item.cost,
        warnings: newWarnings,
        items: {
          ...prevState.budget.items,
          [id]: {
            ...item,
            count: updatedCount
          }
        }
      }
    }));
  }

  increment(item, id) {
    const updatedCount = item.count + 1;
    const itemThresholds = this.state.budget.items[id].thresholds;
    const currentWarnings = this.state.budget.warnings;
    let newWarnings;
    forEach(itemThresholds, (threshold) => {
      if (
        updatedCount > threshold.count &&
        currentWarnings[`${item.name}:${threshold.count}`]
      ) {
        console.log("omitting");
        newWarnings = omit(currentWarnings, [
          `${item.name}-${threshold.count}`
        ]);
      } else {
        newWarnings = currentWarnings;
      }
    });

    this.setState((prevState) => ({
      ...prevState,
      budget: {
        ...prevState.budget,
        total: prevState.budget.total - item.cost,
        warnings: newWarnings,
        items: {
          ...prevState.budget.items,
          [id]: {
            ...item,
            count: item.count + 1
          }
        }
      }
    }));
  }

  render() {
    console.log(this.state.budget.warnings);
    const csvData = map(this.state.budget.items, (item) => ({
      name: item.name,
      description: item.description,
      count: item.count,
      cost: item.cost,
      total: item.cost * item.count
    }));
    return (
      <div className="App">
        <h1>Spend the budget</h1>
        {values(this.state.budget.warnings) &&
          map(Object.keys(this.state.budget.warnings), (key) => {
            const [name, count] = key.split(":");
            return (
              <div className="warning">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 30"
                  x="0px"
                  y="0px"
                >
                  <title>warning</title>
                  <g>
                    <path d="M21.63,17.29,14.08,4.19a2.4,2.4,0,0,0-4.16,0L2.36,17.3A2.5,2.5,0,0,0,4.55,21h14.9a2.49,2.49,0,0,0,2.18-3.72Zm-1.75,1.48a.49.49,0,0,1-.43.24H4.55a.49.49,0,0,1-.43-.24.48.48,0,0,1,0-.48l7.55-13.1a.41.41,0,0,1,.7,0l7.54,13.08A.49.49,0,0,1,19.88,18.77Z" />
                    <path d="M12,9a1,1,0,0,0-1,1v4a1,1,0,0,0,2,0V10A1,1,0,0,0,12,9Z" />
                    <path d="M11.62,16.09a1,1,0,0,0-.33.22,1,1,0,0,0,0,1.41,1,1,0,0,0,1.42-1.41A1,1,0,0,0,11.62,16.09Z" />
                  </g>
                </svg>
                As the result of this budgetary change,{" "}
                <strong>{this.state.budget.warnings[key]}</strong>. To fix this,
                adjust the count of <strong>"{name}"</strong> above{" "}
                <strong>{count}</strong>.
              </div>
            );
          })}
        <CSVDownloader data={csvData} type="button" filename={"filename"}>
          Download CSV
        </CSVDownloader>
        <h3 className="remaining">
          <AnimatedNumber
            value={this.state.budget.total}
            formatValue={(v) => dollarFormatter(v)}
            duration={300}
            stepPrecision={0}
          />
        </h3>
        <ul>
          {map(this.state.budget.items, (i, id) => {
            const classes =
              this.state.tooltipShown === id
                ? "description show"
                : "description hide";
            return (
              <li key={i.name}>
                <h3>
                  {i.name}
                  {i.description && (
                    <div className="question">
                      <span
                        onMouseEnter={() => this.toggleTooltip(id, true)}
                        onMouseLeave={() => this.toggleTooltip(id, false)}
                      >
                        ?<i className={classes}>{i.description}</i>
                      </span>
                    </div>
                  )}
                </h3>
                <h4>{dollarFormatter(i.cost)}</h4>
                <button
                  onClick={() => this.decrement(i, id)}
                  disabled={i.count === 0}
                >
                  -
                </button>
                {i.count}
                <button onClick={() => this.increment(i, id)}>+</button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

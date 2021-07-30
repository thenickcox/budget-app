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
      if (updatedCount <= threshold.count) {
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
        newWarnings = omit(currentWarnings, [
          `${item.name}:${threshold.count}`
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
        warnings: newWarnings || {},
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
    console.log(this.state.budget);
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
        {Object.keys(this.state.budget.warnings) &&
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
        <div className="download-container">
          <CSVDownloader data={csvData} type="button" filename={"filename"}>
            Download CSV
            <svg
              className="download-icon"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              xmlnsSerif="http://www.serif.com/"
              viewBox="0 0 32 40"
              version="1.1"
              xmlSpace="preserve"
              x="0px"
              y="0px"
              fill-rule="evenodd"
              clip-rule="evenodd"
              stroke-linejoin="round"
              stroke-miterlimit="2"
            >
              <g transform="matrix(1,0,0,1,0,-42)">
                <path d="M17.759,69.5L7,69.5C6.337,69.5 5.701,69.237 5.232,68.768C4.763,68.299 4.5,67.663 4.5,67C4.5,62.48 4.5,51.52 4.5,47C4.5,46.337 4.763,45.701 5.232,45.232C5.701,44.763 6.337,44.5 7,44.5C10.646,44.5 18,44.5 18,44.5L18.007,44.5C18.097,44.501 18.181,44.526 18.253,44.569L18.255,44.57C18.301,44.597 18.344,44.633 18.38,44.675L24.38,51.675C24.399,51.697 24.416,51.721 24.43,51.746L24.431,51.747C24.473,51.818 24.498,51.901 24.5,51.989L24.5,52L24.5,61.101C26.28,62.012 27.5,63.865 27.5,66C27.5,69.036 25.036,71.5 22,71.5C20.294,71.5 18.768,70.721 17.759,69.5ZM22,61.5C24.484,61.5 26.5,63.516 26.5,66C26.5,68.484 24.484,70.5 22,70.5C19.516,70.5 17.5,68.484 17.5,66C17.5,63.516 19.516,61.5 22,61.5ZM17.5,45.5L7,45.5C6.602,45.5 6.221,45.658 5.939,45.939C5.658,46.221 5.5,46.602 5.5,47C5.5,51.52 5.5,62.48 5.5,67C5.5,67.398 5.658,67.779 5.939,68.061C6.221,68.342 6.602,68.5 7,68.5L17.101,68.5C16.717,67.75 16.5,66.9 16.5,66C16.5,62.964 18.964,60.5 22,60.5C22.52,60.5 23.023,60.572 23.5,60.707L23.5,52.5L20,52.5C18.619,52.5 17.5,51.381 17.5,50L17.5,45.5ZM21.5,66.793L21.5,64C21.5,63.724 21.724,63.5 22,63.5C22.276,63.5 22.5,63.724 22.5,64L22.5,66.793L23.061,66.232C23.256,66.037 23.573,66.037 23.768,66.232C23.963,66.427 23.963,66.744 23.768,66.939L22.354,68.354C22.158,68.549 21.842,68.549 21.646,68.354L20.232,66.939C20.037,66.744 20.037,66.427 20.232,66.232C20.427,66.037 20.744,66.037 20.939,66.232L21.5,66.793ZM9,58.5L20,58.5C20.276,58.5 20.5,58.276 20.5,58C20.5,57.724 20.276,57.5 20,57.5L9,57.5C8.724,57.5 8.5,57.724 8.5,58C8.5,58.276 8.724,58.5 9,58.5ZM9,55.5L20,55.5C20.276,55.5 20.5,55.276 20.5,55C20.5,54.724 20.276,54.5 20,54.5L9,54.5C8.724,54.5 8.5,54.724 8.5,55C8.5,55.276 8.724,55.5 9,55.5ZM9,52.5L14,52.5C14.276,52.5 14.5,52.276 14.5,52C14.5,51.724 14.276,51.5 14,51.5L9,51.5C8.724,51.5 8.5,51.724 8.5,52C8.5,52.276 8.724,52.5 9,52.5ZM18.5,46.352L18.5,50C18.5,50.828 19.172,51.5 20,51.5L22.913,51.5L18.5,46.352Z" />
              </g>
            </svg>
          </CSVDownloader>
        </div>
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

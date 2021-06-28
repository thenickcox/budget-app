import React from "react";
import "./styles.css";
import AnimatedNumber from "react-animated-number";
import { CSVDownloader } from "react-papaparse";
import config from "./config";
import map from "lodash.map";
import reduce from "lodash.reduce";
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
    this.setState((prevState) => ({
      ...prevState,
      budget: {
        ...prevState.budget,
        total: prevState.budget.total + item.cost,
        items: {
          ...prevState.budget.items,
          [id]: {
            ...item,
            count: item.count - 1
          }
        }
      }
    }));
  }

  increment(item, id) {
    this.setState((prevState) => ({
      ...prevState,
      budget: {
        ...prevState.budget,
        total: prevState.budget.total - item.cost,
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

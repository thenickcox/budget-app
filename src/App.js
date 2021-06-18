import React from "react";
import "./styles.css";
import AnimatedNumber from "react-animated-number";
import config from "./config";
import map from "lodash.map";
import reduce from "lodash.reduce";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.decrement = this.decrement.bind(this);
    this.increment = this.increment.bind(this);
    console.log(config.budget);
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
    console.log(this.state.budget);
    return (
      <div className="App">
        <h1>Spend the budget</h1>
        <h3>
          Remaining:{" "}
          <AnimatedNumber
            value={this.state.budget.total}
            formatValue={(v) =>
              `$${v.toLocaleString("en-US", { minimumFractionDigits: 0 })}`
            }
            duration={300}
            stepPrecision={0}
          />
        </h3>
        {map(this.state.budget.items, (i, id) => {
          return (
            <li key={i.name}>
              {i.name}: {i.count}
              <button onClick={() => this.decrement(i, id)}>Remove</button>
              <button onClick={() => this.increment(i, id)}>Add</button>
            </li>
          );
        })}
      </div>
    );
  }
}

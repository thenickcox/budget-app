import React from "react";
import "./styles.css";
import AnimatedNumber from "react-animated-number";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.decrement = this.decrement.bind(this);
    this.increment = this.increment.bind(this);
    this.state = {
      budget: {
        remaining: 500,
        total: 500,
        items: [
          {
            name: "Give employees healthcare",
            cost: 100
          }
        ]
      }
    };
  }

  decrement(cost) {
    this.setState((prevState) => ({
      ...prevState,
      budget: {
        ...prevState.budget,
        remaining: prevState.budget.remaining - cost
      }
    }));
  }

  increment(cost) {
    this.setState((prevState) => ({
      ...prevState,
      budget: {
        ...prevState.budget,
        remaining: prevState.budget.remaining + cost
      }
    }));
  }

  render() {
    return (
      <div className="App">
        <h1>Spend the budget</h1>
        <h3>
          Remaining:{" "}
          <AnimatedNumber
            value={this.state.budget.remaining}
            formatValue={(v) => `$${v.toFixed(0)}`}
            duration={300}
          />
        </h3>
        {this.state.budget.items.map((i) => {
          return (
            <li>
              {i.name}
              <button onClick={() => this.increment(i.cost)}>Remove</button>
              <button onClick={() => this.decrement(i.cost)}>Add</button>
            </li>
          );
        })}
      </div>
    );
  }
}

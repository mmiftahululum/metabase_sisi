/* eslint-disable react/prop-types */
import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { t } from "ttag";

export default class LimitWidget extends Component {
  static propTypes = {
    limit: PropTypes.number,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    options: [undefined, 1, 10, 25, 100, 1000],
  };

  render() {
    return (
      <ul className="Button-group Button-group--blue">
        {this.props.options.map(count => (
          <li
            key={count || "None"}
            className={cx("Button", {
              "Button--active": count === this.props.limit,
            })}
            onClick={() => this.props.onChange(count)}
          >
            {count || t`None`}
          </li>
        ))}
      </ul>
    );
  }
}

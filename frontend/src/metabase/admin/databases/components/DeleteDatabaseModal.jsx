import React, { Component } from "react";
import PropTypes from "prop-types";
import { t } from "ttag";

import Button from "metabase/core/components/Button";
import ModalContent from "metabase/components/ModalContent";

export default class DeleteDatabaseModal extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      confirmValue: "",
      error: null,
    };
  }

  static propTypes = {
    database: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    onDelete: PropTypes.func,
  };

  handleSubmit = async e => {
    e.preventDefault();

    try {
      this.props.onDelete(this.props.database);
      // immediately call on close because database deletion should be non blocking
      this.props.onClose();
    } catch (error) {
      this.setState({ error });
    }
  };

  render() {
    const { confirmValue } = this.state;
    const { database } = this.props;

    let formError;
    if (this.state.error) {
      let errorMessage = t`Server error encountered`;
      if (this.state.error.data && this.state.error.data.message) {
        errorMessage = this.state.error.data.message;
      } else {
        errorMessage = this.state.error.message;
      }

      // TODO: timeout display?
      formError = <span className="text-error px2">{errorMessage}</span>;
    }

    const confirmed =
      confirmValue.trim().toLowerCase() === database.name.trim().toLowerCase();

    return (
      <ModalContent
        title={t`Delete the ${database.name} database?`}
        onClose={this.props.onClose}
      >
        <form
          className="flex flex-column"
          onSubmit={confirmed ? this.handleSubmit : undefined}
        >
          <div className="mb4">
            <p className="text-paragraph">
              {t`All saved questions, metrics, and segments that rely on this database will be lost.`}{" "}
              <strong>{t`This cannot be undone.`}</strong>
            </p>
            <p className="text-paragraph">
              {t`If you're sure, please type`} <strong>{database.name}</strong>{" "}
              {t`in this box:`}
            </p>
            <input
              className="Form-input"
              type="text"
              onChange={e => this.setState({ confirmValue: e.target.value })}
              autoFocus
            />
          </div>

          <div className="ml-auto">
            <Button
              type="button"
              onClick={this.props.onClose}
            >{t`Cancel`}</Button>
            <Button
              ml={2}
              danger
              type="submit"
              disabled={!confirmed}
            >{t`Delete`}</Button>
            {formError}
          </div>
        </form>
      </ModalContent>
    );
  }
}

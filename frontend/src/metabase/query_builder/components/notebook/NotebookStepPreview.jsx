/* eslint-disable react/prop-types */
import React from "react";

import cx from "classnames";
import _ from "underscore";

import { isReducedMotionPreferred } from "metabase/lib/dom";

import Icon from "metabase/components/Icon";
import Button from "metabase/core/components/Button";
import { Motion, spring } from "react-motion";

import QuestionResultLoader from "metabase/containers/QuestionResultLoader";
import Visualization from "metabase/visualizations/components/Visualization";

import Question from "metabase-lib/lib/Question";
import {
  PreviewButtonContainer,
  PreviewHeader,
  PreviewIconContainer,
  PreviewRoot,
} from "./NotebookStepPreview.styled";

class NotebookStepPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: this.getPreviewQuestion(props.step),
    };
  }

  refresh = () => {
    this.setState({
      question: this.getPreviewQuestion(this.props.step),
    });
  };

  getPreviewQuestion(step) {
    const query = step.previewQuery;
    return Question.create()
      .setQuery(query.limit() < 10 ? query : query.updateLimit(10))
      .setDisplay("table")
      .setSettings({ "table.pivot": false });
  }

  getIsDirty() {
    const newQuestion = this.getPreviewQuestion(this.props.step);
    return !_.isEqual(newQuestion.card(), this.state.question.card());
  }

  render() {
    const { onClose } = this.props;
    const { question } = this.state;

    const isDirty = this.getIsDirty();

    const preferReducedMotion = isReducedMotionPreferred();
    const springOpts = preferReducedMotion
      ? { stiffness: 500 }
      : { stiffness: 170 };

    return (
      <PreviewRoot>
        <PreviewHeader>
          <span className="text-bold">{`Preview`}</span>
          <PreviewIconContainer>
            <Icon
              name="close"
              onClick={onClose}
              className="text-light text-medium-hover cursor-pointer ml1"
            />
          </PreviewIconContainer>
        </PreviewHeader>
        {isDirty ? (
          <PreviewButtonContainer className="bordered shadowed rounded bg-white p4">
            <Button onClick={this.refresh}>Refresh</Button>
          </PreviewButtonContainer>
        ) : (
          <QuestionResultLoader question={question}>
            {({ rawSeries, result }) => (
              <Motion
                defaultStyle={{ height: 36 }}
                style={{
                  height: spring(getPreviewHeightForResult(result), springOpts),
                }}
              >
                {({ height }) => {
                  const targetHeight = getPreviewHeightForResult(result);
                  const snapHeight =
                    height > targetHeight / 2 ? targetHeight : 0;
                  const minHeight = preferReducedMotion ? snapHeight : height;
                  return (
                    <Visualization
                      rawSeries={rawSeries}
                      error={result && result.error}
                      className={cx("bordered shadowed rounded bg-white", {
                        p2: result && result.error,
                      })}
                      style={{ minHeight }}
                    />
                  );
                }}
              </Motion>
            )}
          </QuestionResultLoader>
        )}
      </PreviewRoot>
    );
  }
}

function getPreviewHeightForResult(result) {
  const rowCount = result ? result.data.rows.length : 1;
  return rowCount * 36 + 36 + 2;
}

export default NotebookStepPreview;

/* eslint-disable react/prop-types */
import React from "react";
import { t } from "ttag";
import StructuredQuery from "metabase-lib/lib/queries/StructuredQuery";
import { fieldRefForColumn } from "metabase/lib/dataset";
import {
  getAggregationOperator,
  isCompatibleAggregationOperatorForField,
} from "metabase/lib/schema_metadata";
import { capitalize } from "metabase/lib/formatting";

export default ({ question, clicked = {} }) => {
  const { column, value } = clicked;
  const query = question.query();
  if (!column || value !== undefined || !(query instanceof StructuredQuery)) {
    return [];
  }
  const dateDimension = query
    .dimensionOptions(d => d.field().isDate())
    .all()[0];
  if (!dateDimension) {
    return [];
  }
  return ["sum"]
    .map(getAggregationOperator)
    .filter(aggregator =>
      isCompatibleAggregationOperatorForField(aggregator, column),
    )
    .map(aggregator => ({
      name: "summarize-by-time",
      buttonType: "horizontal",
      section: "summarize",
      icon: "line",
      title: (
        <span>
          {capitalize(aggregator.short)} {t`over time`}
        </span>
      ),
      question: () =>
        question
          .aggregate(
            aggregator.requiresField
              ? [aggregator.short, fieldRefForColumn(column)]
              : [aggregator.short],
          )
          .pivot([dateDimension.defaultBreakout()]),
    }));
};

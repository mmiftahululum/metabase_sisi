/* eslint-disable react/prop-types */
import { drillDownForDimensions } from "metabase/modes/lib/actions";

import { t } from "ttag";

export default ({ question, clicked, settings }) => {
  const dimensions = (clicked && clicked.dimensions) || [];
  const drilldown = drillDownForDimensions(dimensions, question.metadata());
  if (!drilldown) {
    return [];
  }

  return [
    {
      name: "timeseries-zoom",
      section: "zoom",
      title: t`Zoom in`,
      buttonType: "horizontal",
      icon: "zoom_in",
      question: () => question.pivot(drilldown.breakouts, dimensions),
    },
  ];
};

import { RenderMermaidChartProps } from "@components/common/Mermaid/Typing";
import { twMerge } from "tailwind-merge";

import React from "react";
/**
 * @title RenderMermaidChart Component
 * @notice This component is used for rendering mermaid charts in a flexible and error-handling way
 * @dev This React functional component takes `RenderMermaidChartProps` and conditionally renders the chart or an error message
 */
export const RenderMermaidChart: React.FC<RenderMermaidChartProps> = ({
  article,
  chartError,
}: RenderMermaidChartProps) => {
  return (
    <React.Fragment>
      <div
        className={twMerge(
          "flex items-center gap-4 w-full h-36 relative overflow-hidden py-2",
          `${chartError === true && "h-fit"}`
        )}
      >
        {chartError === false ? (
          <div className="mermaid flex w-full h-full justify-center mt-4" key={article?.document.id}>
            {article?.document.abstractChart}
          </div>
        ) : (
          <p className="text-sm text-neutral-gray">There is no valid chart for this article.</p>
        )}
      </div>
    </React.Fragment>
  );
};

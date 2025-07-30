"use client";
import * as Tooltip from "@components/common/Tooltip/Tooltip";
import React from "react";

/**
 * @title Tooltip Provider Wrapper
 * @notice This component wraps content with a Tooltip provider and root.
 * @dev This is a higher-order component that facilitates the use of the Tooltip component throughout the application. To use a tooltip, wrap the relevant content with this component.
 * @param props {React.PropsWithChildren} Contains the children nodes to be rendered inside the Tooltip root.
 */
export const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <Tooltip.Provider>{children}</Tooltip.Provider>;
};

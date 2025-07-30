import "@styles/tooltip.css";

import * as Tooltip from "@radix-ui/react-tooltip";

import { twMerge } from "tailwind-merge";
import { TooltipInformationProps } from "./Typing";

import HelpIcon from "public/svgs/common/help.svg";
import React from "react";

/**
 * @title Tooltip Components
 * @notice Provides a set of components for creating and managing tooltips.
 * @dev This module exports various components from Radix UI's Tooltip, customized for use.
 */
const Provider: React.FC<Tooltip.TooltipProviderProps> = ({ children, ...props }) => {
  return <Tooltip.Provider {...props}>{children}</Tooltip.Provider>;
};

/**
 * @dev Tooltip root component that controls the tooltip behavior.
 */
const Root: React.FC<Tooltip.TooltipProps> = ({ children, ...props }) => {
  return <Tooltip.Root {...props}>{children}</Tooltip.Root>;
};

/**
 * @dev Trigger component for the tooltip. This component acts as the tooltip activator.
 */
const Trigger: React.FC<Tooltip.TooltipTriggerProps> = ({ children, ...props }) => {
  return (
    <Tooltip.Trigger type="button" {...props}>
      {children}
    </Tooltip.Trigger>
  );
};

/**
 * @dev Portal component for the tooltip, controlling its positioning in the DOM.
 */
const Portal: React.FC<Tooltip.TooltipPortalProps> = ({ children, ...props }) => {
  return <Tooltip.Portal {...props}>{children}</Tooltip.Portal>;
};

/**
 * @dev Content component of the tooltip, which includes the actual information displayed.
 * @param className CSS class for additional styling.
 */
const Content: React.FC<Tooltip.TooltipContentProps> = ({ className, children, ...props }) => {
  return (
    <Tooltip.Content className={twMerge("tooltip-content", className)} sideOffset={5} {...props}>
      {children}
      <Tooltip.Arrow width={16} height={8} className="TooltipArrow" />
    </Tooltip.Content>
  );
};

/**
 * @title Information Tooltip Component
 * @notice Component to display a tooltip with provided content.
 * @dev Component that combines various Tooltip components to display a tooltip with custom content.
 * @param content The content to display inside the tooltip.
 */
const Information: React.FC<TooltipInformationProps> = ({ content }) => {
  return (
    <React.Fragment>
      <Root delayDuration={50}>
        <Trigger>
          <HelpIcon className="fill-neutral-gray w-5 cursor-pointer" />
        </Trigger>
        <Portal>
          <Content>{content}</Content>
        </Portal>
      </Root>
    </React.Fragment>
  );
};

export { Content, Information, Portal, Provider, Root, Trigger };

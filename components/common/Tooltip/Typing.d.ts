import {
  TooltipArrowProps,
  TooltipContentProps,
  TooltipPortalProps,
  TooltipProps,
  TooltipProviderProps,
  TooltipTriggerProps,
} from "@radix-ui/react-tooltip";

interface ProviderProps extends TooltipProviderProps {}

interface RootProps extends TooltipProps {}

interface TriggerProps extends TooltipTriggerProps {}

interface PortalProps extends TooltipPortalProps {}

interface ContentProps extends TooltipContentProps {}

interface ArrowProps extends TooltipArrowProps {}

interface TooltipInformationProps {
  content: React.ReactNode;
}

export { ArrowProps, ContentProps, PortalProps, ProviderProps, RootProps, TooltipInformationProps, TriggerProps };

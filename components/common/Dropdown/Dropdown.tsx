"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilterOption } from "@/mock/dropdow_filter_options";
import { CaretDown } from "react-bootstrap-icons";
import { twMerge } from "tailwind-merge";
import { DropdownProps } from "./Typing";

import React from "react";

/**
 * @title Dropdown Component
 * @notice Creates a customizable dropdown menu component for selecting items.
 * @dev This component allows users to select an item from a dropdown menu. It can be customized with different styles and initial values.
 */
const Dropdown: React.FC<DropdownProps> = ({
  label,
  className,
  items,
  no_selected = false,
  custom_intial_value,
  selected: selected_value,
  onSelect,
  classNameTrigger,
}: DropdownProps) => {
  /**
   * @dev Determines the initial selected value based on props.
   * @dev If `no_selected` is true, there is no initial selection, otherwise it uses `selected_value` or the first item in `items`.
   */
  const initialSelected = no_selected ? null : selected_value || items[0].label;

  /** @dev State hook for managing the currently selected item. */
  const [selected, setSelected] = React.useState<string | null | undefined>(initialSelected);

  /** @dev Effect hook to update the `selected` state when `selected_value`  prop changes. */
  React.useEffect(() => {
    setSelected(selected_value);
  }, [selected_value]);

  return (
    <React.Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger className={twMerge("focus:outline-none", classNameTrigger)}>
          <div
            className={twMerge(
              "flex items-center justify-center py-2 px-4 text-sm rounded-full min-w-[200px] border-[1px] border-primary-main text-primary-main hover:scale-105 transition-all duration-200",
              className
            )}
          >
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-primary-main">{label}</span>
              <span className="text-sm font-semibold text-primary-main first-letter:uppercase">
                {selected !== undefined && selected !== null ? `${selected}` : ""}
              </span>
              <span className="text-sm font-semibold text-primary-main">{custom_intial_value}</span>
            </div>
            <CaretDown className="ml-2" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={twMerge("min-w-[200px]", className)}>
          {items.map((item: FilterOption) => (
            <React.Fragment key={item.id}>
              <DropdownMenuItem
                aria-valuetext={String(item.value)}
                onClick={(e) => {
                  const value = e.currentTarget.getAttribute("aria-valuetext");
                  setSelected(item.label);
                  onSelect && onSelect(value as string);
                }}
              >
                <DropdownMenuLabel>{item.label}</DropdownMenuLabel>
              </DropdownMenuItem>
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </React.Fragment>
  );
};

export { Dropdown };

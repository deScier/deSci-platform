"use client";

import * as React from "react";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { input } from "../Input/Input";

type Option = {
  id: string | number;
  value: string;
  label: React.ReactNode | string;
};

type ComboboxProps = {
  label: string;
  placeholder: string;
  not_found_message: string;
  search_placeholder: string;
  options: Option[];
  onValueChange: (value: { id: string | number; value: string; label: React.ReactNode }) => void;
};

const Combobox: React.FC<ComboboxProps> = ({
  label,
  placeholder,
  not_found_message,
  options,
  search_placeholder,
  onValueChange,
}: ComboboxProps) => {
  const btn_ref = React.useRef<HTMLButtonElement>(null);

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<{
    id: string | number;
    value: string;
    label: React.ReactNode | string;
  } | null>(null);

  const handleSelect = (currentValue: Option) => {
    setValue(currentValue === value ? null : currentValue);
    setOpen(false);
    onValueChange(currentValue);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex flex-col gap-2">
        <label className="text-sm text-black-primary font-semibold">{label}</label>
        <PopoverTrigger asChild>
          <button ref={btn_ref} className={cn(input(), "justify-between text-base")} aria-expanded={open}>
            {value ? value.label : <span className="text-neutral-light_gray text-base">{placeholder}</span>}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="p-0 w-full" style={{ width: btn_ref.current?.clientWidth, minWidth: "174px" }}>
        <Command>
          <CommandInput placeholder={search_placeholder} />
          <CommandEmpty>{not_found_message}</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                className="text-sm"
                onSelect={() => handleSelect(option)}
              >
                {option.label}
                <CheckIcon
                  className={cn("ml-auto h-4 w-4", value && value.value === option.value ? "opacity-100" : "opacity-0")}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export { Combobox };

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { home_routes } from "@/routes/home";
import { uniqueId } from "lodash";
import { usePathname, useRouter } from "next/navigation";
import { Clipboard, FileText, PlusCircle } from "react-bootstrap-icons";

import React from "react";

const SelectCreation: React.FC<SelectCreationProps> = ({ onValueChange }: SelectCreationProps) => {
  const router = useRouter();
  const currentPath = usePathname();

  const sidebar_items = [
    {
      id: uniqueId(),
      label: "New Article",
      icon: <Clipboard size={16} className="group-hover:text-primary-hover" />,
      route: home_routes.summary_routes.new_document,
    },
    {
      id: uniqueId(),
      label: "New Journal",
      icon: <FileText size={17} className="group-hover:text-primary-hover" />,
      route: home_routes.summary_routes.new_journal,
    },
  ];

  const [currentItem, setCurrentItem] = React.useState<string | undefined>(undefined);

  const findCurrentItem = () => {
    const currentItem = sidebar_items.find((item) => currentPath.includes(item.route));

    if (currentItem) {
      setCurrentItem(currentItem.route);
      return currentItem.route;
    }
    return setCurrentItem(undefined);
  };

  React.useEffect(() => {
    findCurrentItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath]);
  return (
    <React.Fragment>
      <Select
        value={currentItem}
        onValueChange={(value) => {
          router.push(value as string);
          onValueChange && onValueChange(value as string);
        }}
      >
        <SelectTrigger
          key={currentPath}
          hasIndicator={false}
          className="flex gap-2 items-center justify-center w-full rounded-md focus-visible:outline-none bg-primary-main hover:bg-primary-hover transition-all duration-200 hover:scale-[1.01] text-neutral-white mx-auto my-0 p-3 text-sm min-h-[48px] font-regular"
        >
          <SelectValue
            defaultValue={currentItem}
            placeholder={
              <React.Fragment>
                <div className="flex gap-2">
                  <span className="text-sm font-regular">Submit Article or Journal</span>
                  <PlusCircle size={18} />
                </div>
              </React.Fragment>
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {sidebar_items.map((item) => (
              <SelectItem
                hasItemIndicator={false}
                className="py-1.5 px-2 group focus:bg-[#DDA9FF] focus:bg-opacity-30 transition-all duration-200"
                value={item.route}
                key={item.id}
                onMouseEnter={() => router.prefetch(item.route as string)}
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="text-base mt-[2px] group-hover:text-primary-hover">{item.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </React.Fragment>
  );
};

type SelectCreationProps = {
  onValueChange?: (value: string) => void;
};

export { SelectCreation };

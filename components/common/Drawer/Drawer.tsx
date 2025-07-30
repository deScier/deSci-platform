import { DrawerContentProps, DrawerOverlayProps, DrawerRootProps } from "@components/common/Drawer/Typing";
import { usePathname } from "next/navigation";
import { twJoin, twMerge } from "tailwind-merge";

import React from "react";

/**
 * Overlay Component
 * @dev Component for creating an overlay for the drawer
 * @param {DrawerOverlayProps} props The properties passed to the Overlay component
 */
const Overlay: React.FC<DrawerOverlayProps> = ({ className, checked }: DrawerOverlayProps) => {
  return (
    <React.Fragment>
      <div
        className={twMerge(
          "fixed w-screen h-screen top-0 z-50 bg-black bg-opacity-0 opacity-0 backdrop-blur-[2px] backdrop-brightness-95 transition-opacity duration-500 pointer-events-none",
          className
        )}
        data-checked={checked}
      />
    </React.Fragment>
  );
};

/**
 * Root Component
 * @dev Root container for the drawer component, managing the open state.
 * @param {DrawerRootProps} props The properties passed to the Root component.
 */
const Root: React.FC<DrawerRootProps> = ({ children, className, open = false }: DrawerRootProps) => {
  const path = usePathname();

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);
  return (
    <React.Fragment>
      <div className="flex">
        <input type="checkbox" id="drawer-toggle" className="relative sr-only peer hidden" checked={open} readOnly />
        <label
          htmlFor={`drawer-toggle-${path}`}
          className="absolute top-0 left-0 p-4 transition-all duration-500 bg-transparent rounded-lg peer-checked:rotate-180 peer-checked:left-64 z-0 pointer-events-none hidden"
        />
        <Overlay className="peer-checked:opacity-100" checked={open} />
        {children}
      </div>
    </React.Fragment>
  );
};

/**
 * Content Component
 * @dev Component for the content area of the drawer.
 * @param {DrawerContentProps} props The properties passed to the Content component.
 */
const Content: React.FC<DrawerContentProps> = ({ children, className, position = "right" }: DrawerContentProps) => {
  return (
    <React.Fragment>
      <div
        className={twJoin(
          "fixed top-0 z-50 w-[80%] h-full transition-all duration-500 bg-white shadow-lg peer-checked:translate-x-0",
          `${position == "left" && "left-0 transform -translate-x-full"}`,
          `${position == "right" && "right-0 transform translate-x-full"}`,
          className
        )}
      >
        {children}
      </div>
    </React.Fragment>
  );
};

export { Content, Overlay, Root };

"use client";

import { cn } from "@/lib/utils";
import { BackProps, ButtonProps, LinkProps } from "@components/common/Button/Typing";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { useRouter } from "next/navigation";

import Spinner from "@components/common/Loading/Spinner";
import NextLink from "next/link";
import React from "react";

export const buttonVariants = cva(
  "inline-flex gap-2 w-full max-h-[42px] items-center justify-center px-4 py-3.5 rounded-md font-semibold select-none transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-primary-main text-neutral-white hover:bg-primary-hover",
        primary: "bg-primary-main text-neutral-white hover:bg-primary-hover",
        secondary: "bg-transparent text-neutral-white",
        outline: "border border-primary-main text-primary-main bg-transparent hover:bg-secundary-hover",
        warning: "bg-status-red text-white-main",
        warining_outline: "border bg-transparent text-status-red hover:bg-status-red_hover hover:text-status-red_hover",
        disabled:
          "bg-status-disable_bg text-status-disable_text cursor-not-allowed fill-status-disable_text pointer-events-none",
        destructive:
          "bg-red-500 text-neutral-white hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-white dark:hover:bg-red-900/90",
        ghost: "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-neutral-white",
        link: "text-slate-900 underline-offset-4 hover:underline dark:text-neutral-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * @title Button Component
 * @notice Renders a button with various styles and behaviors based on the provided props.
 * @dev Component to render a button with optional loading spinner and icon. Supports different variants like primary, outline, and disabled.
 * @param {ButtonProps} props - Properties for styling and behavior of the button.
 * @return React Functional Component rendering a styled button with optional loading spinner and icon.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps & { loading?: boolean; icon?: React.ReactNode }>(
  ({ className, variant, asChild = false, loading = false, icon, children, disabled, ...props }, ref) => {
    const hasDisabled = disabled || loading;
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        type={props.type || "button"}
        className={cn(
          buttonVariants({
            variant: hasDisabled ? "disabled" : variant,
          }),
          className
        )}
        {...props}
        disabled={hasDisabled}
      >
        {loading ? (
          <Spinner />
        ) : (
          <React.Fragment>
            {icon && <React.Fragment>{icon}</React.Fragment>}
            {children}
          </React.Fragment>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

/**
 * @title Link Component
 * @notice Renders either an internal or external link based on the provided 'href' prop.
 * @dev Component to render a link, which can be an internal Next.js link or an external link based on the URL pattern.
 * @param {LinkProps} props - Properties including 'href' for the URL and children for the link text.
 * @return React Functional Component rendering either an internal Next.js link or an external link.
 */
const Link: React.FC<LinkProps> = ({ children, href }: LinkProps) => {
  const isExternal = /^https?:\/\//.test(href);

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return <NextLink href={href}>{children}</NextLink>;
};

/**
 * @title Back Navigation Component
 * @notice Renders a button for navigating back in the browser history.
 * @dev Component to render a back button using Next.js router for navigating to the previous page.
 * @param {BackProps} props - Properties including 'text' for button label.
 * @return React Functional Component rendering a back navigation button.
 */
const Back: React.FC<BackProps> = ({ text }: BackProps) => {
  const router = useRouter();
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        className="w-fit p-2 bg-neutral-white border border-black-primary rounded-md"
        onClick={() => router.back()}
      >
        <svg viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4.33337 20.3334V18.3334H13.9667C15.5223 18.3334 16.8612 17.8167 17.9834 16.7834C19.1056 15.75 19.6667 14.4667 19.6667 12.9334C19.6667 11.4 19.1056 10.1167 17.9834 9.08337C16.8612 8.05004 15.5223 7.53337 13.9667 7.53337H4.13337L7.93337 11.3334L6.53337 12.7334L0.333374 6.53337L6.53337 0.333374L7.93337 1.73337L4.13337 5.53337H13.9334C16.0445 5.53337 17.8612 6.24449 19.3834 7.66671C20.9056 9.08893 21.6667 10.8445 21.6667 12.9334C21.6667 15.0223 20.9056 16.7778 19.3834 18.2C17.8612 19.6223 16.0445 20.3334 13.9334 20.3334H4.33337Z"
            fill="#6A6A6A"
            className="w-5"
          />
        </svg>
      </button>
      {text && <h3 className="text-2xl font-semibold">{text}</h3>}
    </div>
  );
};

export { Back, Button, Link };

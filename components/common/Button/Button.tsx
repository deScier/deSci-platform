'use client'

import { BackProps, ButtonProps, LinkProps } from '@components/common/Button/Typing'
import Spinner from '@components/common/Loading/Spinner'
import { motion } from 'framer-motion'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

const btn = tv({
   base: 'flex gap-2 items-center justify-center w-full max-h-[42px] px-4 py-3.5 rounded-md font-semibold focus-visible:outline-none',
   variants: {
      color: {
         primary: 'bg-primary-main hover:bg-primary-hover transition-all duration-200 hover:scale-[1.01] text-neutral-white',
         outline: 'border border-primary-main text-primary-main bg-transparent transition-all duration-200 hover:scale-[1.01] hover:bg-secundary-hover',
         disabled: 'bg-status-disable_bg text-status-disable_text cursor-not-allowed fill-status-disable_text'
      }
   }
})

/**
 * @title Button Component
 * @notice Renders a button with various styles and behaviors based on the provided props.
 * @dev Component to render a button with optional loading spinner and icon. Supports different variants like primary, outline, and disabled.
 * @param {ButtonProps} props - Properties for styling and behavior of the button.
 * @return React Functional Component rendering a styled button with optional loading spinner and icon.
 */
const Button: React.FC<ButtonProps> = ({ variant = 'primary', icon, children, loading, disabled, className, ...props }: ButtonProps) => {
   const hasDisabled = disabled || loading

   return (
      <motion.div whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.99 }}>
         <button type="button" disabled={hasDisabled} className={twMerge(btn({ color: hasDisabled ? 'disabled' : variant }), className)} {...props}>
            {loading ? (
               <Spinner />
            ) : (
               <React.Fragment>
                  {icon && <span>{icon}</span>}
                  {children}
               </React.Fragment>
            )}
         </button>
      </motion.div>
   )
}

/**
 * @title Link Component
 * @notice Renders either an internal or external link based on the provided 'href' prop.
 * @dev Component to render a link, which can be an internal Next.js link or an external link based on the URL pattern.
 * @param {LinkProps} props - Properties including 'href' for the URL and children for the link text.
 * @return React Functional Component rendering either an internal Next.js link or an external link.
 */
const Link: React.FC<LinkProps> = ({ children, href }: LinkProps) => {
   const isExternal = /^https?:\/\//.test(href)

   if (isExternal) {
      return (
         <a href={href} target="_blank" rel="noopener noreferrer">
            {children}
         </a>
      )
   }

   return <NextLink href={href}>{children}</NextLink>
}

/**
 * @title Back Navigation Component
 * @notice Renders a button for navigating back in the browser history.
 * @dev Component to render a back button using Next.js router for navigating to the previous page.
 * @param {BackProps} props - Properties including 'text' for button label.
 * @return React Functional Component rendering a back navigation button.
 */
const Back: React.FC<BackProps> = ({ text }: BackProps) => {
   const router = useRouter()
   return (
      <div className="flex items-center gap-4">
         <button type="button" className="w-fit p-2 bg-neutral-white border border-black-primary rounded-md" onClick={() => router.back()}>
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
   )
}

export { Back, Button, Link }

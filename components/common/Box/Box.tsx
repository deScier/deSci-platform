import { twMerge } from 'tailwind-merge'

import React from 'react'

/**
 * @title Box Component
 * @notice Box is a reusable React component designed for wrapping child
 * elements.
 * @dev Box styles its children with rounded corners, shadow, padding, and
 * background color, making it versatile for various design needs. It is part
 * of a React-based web application.
 * @param {React.ReactNode} children - Child elements to be rendered within the
 * box.
 * @param {string} [className] - Optional additional CSS classes to apply for custom styling.
 */
const Box: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }: { children: React.ReactNode; className?: string }) => {
   return (
      <React.Fragment>
         <div className={twMerge('inline-grid w-full box-border bg-[#FEFEFE] shadow-box py-4 px-6 rounded-lg ', className)}>{children}</div>
      </React.Fragment>
   )
}

export default Box

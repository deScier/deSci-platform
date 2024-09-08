import { TriggerProps } from '@components/common/Select/Typing'
import * as Select from '@radix-ui/react-select'
import '@styles/select.css'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

/** @dev Defines a set of styles for different types of select components */
const select = tv({
   variants: {
      type: {
         small: 'rounded-md bg-transparent shadow-sm py-1 px-4 border border-gray-stroke inline-flex items-center gap-2 data-[placeholder]:font-regular data-[placeholder]:text-sm focus:outline-none select-none text-sm font-regular text-gray-main',
         input: 'bg-transparent text-base shadow-sm border-b-[1px] p-2 pt-0 border-neutral-light_gray inline-flex items-center justify-between gap-2 data-[placeholder]:text-gray-light data-[placeholder]:text-base data-[placeholder]:text-base data-[placeholder]:text-start focus:outline-none focus:text-neutral-black select-none text-base font-regular text-black-primary w-full'
      }
   }
})

/**
 * @title Select Component Root
 * @dev Root component for the select, passing all props and children
 */
const Root: React.FC<Select.SelectProps> = ({ children, ...props }: Select.SelectProps) => {
   return <Select.Root {...props}>{children}</Select.Root>
}

/**
 * @title Select Component Icon
 * @dev Icon component for the select, passing className and children
 */
const Icon: React.FC<Select.SelectIconProps> = ({ children, className }: Select.SelectIconProps) => {
   return <Select.Icon className={twMerge('text-black-primary', className)}>{children}</Select.Icon>
}

/**
 * @title Select Component Trigger
 * @dev Trigger component for the select, allowing for custom variants
 * @param variant Variant of the select trigger
 */
const Trigger: React.FC<TriggerProps> = ({ children, className, variant = 'small', ...props }: TriggerProps) => {
   return (
      <Select.Trigger
         className={twMerge(
            select({ type: variant }),
            className,
            'data-[placeholder]:text-neutral-light_gray data-[placeholder]:font-regular data-[placeholder]:text-base'
         )}
         {...props}
      >
         {children}
      </Select.Trigger>
   )
}

/**
 * @title Select Component Content
 * @dev Content component for the select, rendering children with additional class names
 */
const Content: React.FC<Select.SelectContentProps> = ({ children, className, ...props }: Select.SelectContentProps) => {
   return (
      <Select.Content
         position="popper"
         className={twMerge('bg-neutral-white rounded-sm shadow-content overflow-hidden p-1 z-[9998] absolute', className)}
         {...props}
      >
         {children}
      </Select.Content>
   )
}

/**
 * @title Select Component Item
 * @dev Item component for the select, rendering children with additional class names
 */
const Item: React.FC<Select.SelectItemProps> = ({ children, className, ...props }: Select.SelectItemProps) => {
   return (
      <Select.Item
         className={twMerge(
            'text-black-primary select-none font-regular hover:text-white px-4 py-1 rounded-sm hover:outline-none focus:outline-none text-sm w-full relative cursor-pointer hover:bg-primary-main',
            className
         )}
         {...props}
      >
         {children}
      </Select.Item>
   )
}

/**
 * @title Select Component Item Text
 * @dev ItemText component for the select, rendering children with additional class names
 */
const ItemText: React.FC<Select.SelectItemTextProps> = ({ children, className, ...props }: Select.SelectItemTextProps) => {
   return (
      <Select.ItemText {...props} className={twMerge('text-sm text-black-primary select-none font-regular hover:bg-white-hover', className)}>
         {children}
      </Select.ItemText>
   )
}

/**
 * @title Select Component Value
 * @dev Value component for the select, rendering children with additional class names
 */
const Value: React.FC<Select.SelectValueProps> = ({ children, className, ...props }: Select.SelectValueProps) => {
   return (
      <Select.Value className={twMerge('text-black-primary select-none font-regular text-sm', className)} {...props}>
         {children}
      </Select.Value>
   )
}

/**
 * @title Select Component Viewport
 * @dev Viewport component for the select, rendering children with additional class names
 */
const Viewport: React.FC<Select.SelectViewportProps> = ({ children, className, ...props }: Select.SelectViewportProps) => {
   return (
      <Select.Viewport className={twMerge(className)} {...props}>
         {children}
      </Select.Viewport>
   )
}

/**
 * @title Select Component Portal
 * @dev Portal component for the select, rendering children with props
 */
const Portal: React.FC<Select.SelectPortalProps> = ({ children, ...props }: Select.SelectPortalProps) => {
   return <Select.Portal {...props}>{children}</Select.Portal>
}

/**
 * @title Select Component Group
 * @dev Group component for the select, rendering children with additional class names
 */
const Group: React.FC<Select.SelectGroupProps> = ({ children, className, ...props }) => {
   return (
      <Select.Group className={twMerge(className)} {...props}>
         {children}
      </Select.Group>
   )
}

export { Content, Group, Icon, Item, ItemText, Portal, Root, select, Trigger, Value, Viewport }

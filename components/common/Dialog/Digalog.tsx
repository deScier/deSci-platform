import { TitleProps } from '@/components/common/Dialog/Typing'
import * as Dialog from '@radix-ui/react-dialog'
import '@styles/dialog.css'
import React from 'react'
import { X } from 'react-bootstrap-icons'
import { twMerge } from 'tailwind-merge'

/**
 * @title Dialog Root Component
 * @dev This component serves as the root wrapper for the dialog component. Utilizes Radix UI's Dialog component.
 */
const Root: React.FC<Dialog.DialogProps> = ({ children, ...props }: Dialog.DialogProps) => {
   return (
      <React.Fragment>
         <Dialog.Root {...props}>{children}</Dialog.Root>
      </React.Fragment>
   )
}

/**
 * @title Dialog Overlay Component
 * @dev This component is the overlay part of the dialog, handling UI aspects like background dimming.
 * @param children - React node children of the component.
 * @param className - CSS class name for additional styling.
 */
const Overlay: React.FC<Dialog.DialogOverlayProps> = ({ children, className, ...props }: Dialog.DialogOverlayProps) => {
   return (
      <React.Fragment>
         <Dialog.Overlay className={twMerge('overlay', className)} {...props}>
            {children}
         </Dialog.Overlay>
      </React.Fragment>
   )
}

/**
 * @title Dialog Content Component
 * @dev This component represents the main content area of the dialog.
 * @param children - React node children of the component.
 * @param className - CSS class name for additional styling.
 */
const Content: React.FC<Dialog.DialogContentProps> = ({ children, className, ...props }: Dialog.DialogContentProps) => {
   return (
      <React.Fragment>
         <Dialog.Content
            className={twMerge('content', 'bg-background-primary w-[50%] p-6 max-h-[95%] transition-all duration-300', className)}
            {...props}
         >
            {children}
         </Dialog.Content>
      </React.Fragment>
   )
}

/**
 * @title Dialog Title Component
 * @dev Component for rendering the title of the dialog, along with optional clear and close functionality.
 * @param onClear - Function to execute when the clear filters option is clicked.
 * @param onClose - Function to close the dialog.
 * @param title - Title text of the dialog.
 */
const Title: React.FC<TitleProps> = ({ onClear, onClose, title }: TitleProps) => {
   return (
      <div className="flex justify-between items-center">
         <h2 className="text-1xl font-semibold mb-1">{title || 'Filtros'}</h2>
         <div className="flex items-center gap-4">
            {onClear && (
               <p className="text-lg text-status-blue font-semibold select-none cursor-pointer" onClick={onClear}>
                  Limpar Filtros
               </p>
            )}
            <X className="w-8 h-8 cursor-pointer transform duration-300 transition-transform hover:rotate-360 hover:scale-125" onClick={onClose} />
         </div>
      </div>
   )
}

export { Content, Overlay, Root, Title }

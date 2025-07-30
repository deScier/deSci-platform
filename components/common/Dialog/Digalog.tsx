import '@styles/dialog.css';

import * as Dialog from '@radix-ui/react-dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';

import { TitleProps } from '@/components/common/Dialog/Typing';
import { cn } from '@/lib/utils';
import { X } from 'react-bootstrap-icons';

import React from 'react';

/**
 * @title Dialog Root Component
 * @dev This component serves as the root wrapper for the dialog component. Utilizes Radix UI's Dialog component.
 */
const Root: React.FC<Dialog.DialogProps> = ({ children, ...props }: Dialog.DialogProps) => {
  return (
    <React.Fragment>
      <Dialog.Root {...props}>{children}</Dialog.Root>
    </React.Fragment>
  );
};

/**
 * @title Dialog Overlay Component
 * @dev This component is the overlay part of the dialog, handling UI aspects like background dimming.
 * @param children - React node children of the component.
 * @param className - CSS class name for additional styling.
 */
const Overlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:bg-slate-950/80',
      className
    )}
    {...props}
  />
));
Overlay.displayName = DialogPrimitive.Overlay.displayName;

const Portal = ({ ...props }: DialogPrimitive.DialogPortalProps) => <DialogPrimitive.Portal {...props} />;
Portal.displayName = DialogPrimitive.Portal.displayName;

const Content = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <Portal>
    <Overlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed top-auto left-auto right-0 bottom-0 translate-x-0 translate-y-0 z-50 grid w-full gap-4 bg-white p-6 shadow-lg duration-200 rounded-t-2xl rounded-bl-none rounded-br-none max-h-[85vh] overflow-y-auto',
        'md:left-[50%] md:top-[50%] md:bottom-auto md:right-auto md:translate-x-[-50%] md:translate-y-[-50%] md:max-w-5xl md:rounded-2xl pb-12 md:pb-0',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'md:data-[state=closed]:slide-out-to-left-1/2 md:data-[state=closed]:slide-out-to-top-[48%] md:data-[state=open]:slide-in-from-left-1/2 md:data-[state=open]:slide-in-from-top-[48%]',
        'dark:border-neutral-800 dark:bg-neutral-950',
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </Portal>
));

Content.displayName = DialogPrimitive.Content.displayName;

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
        <X
          className="w-8 h-8 cursor-pointer transform duration-300 transition-transform hover:rotate-360 hover:scale-125"
          onClick={onClose}
        />
      </div>
    </div>
  );
};

export { Content, Overlay, Root, Title };

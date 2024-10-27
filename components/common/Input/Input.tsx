import * as S from '@components/common/Select/Select'
import * as Tooltip from '@components/common/Tooltip/Tooltip'

import { ErrorProps, InputProps, LabelProps, SelectInputProps, TextAreaProps, WrapperInputProps } from '@components/common/Input/Typing'
import { CaretDown, Eye, EyeSlash, Search as SearchIcon } from 'react-bootstrap-icons'
import CurrencyInput, { CurrencyInputProps } from 'react-currency-input-field'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

import useDimension from '@/hooks/useWindowDimension'
import React from 'react'

/** @dev Tailwind CSS variant for standard input */
export const input = tv({
   base: 'flex items-center rounded-none border-b-[1px] border-neutral-light_gray p-2 pt-0 placeholder:text-gray-light placeholder:text-base focus:outline-none focus:text-neutral-black w-full placeholder-shown:text-neutral-black bg-transparent focus:border-b-primary-main',
   variants: {
      hasIcon: {
         start: 'data-[start=true]:px-11',
         end: 'data-[end=true]:px-11',
         none: ''
      },
      disabled: {
         true: 'bg-[#FEFEFE] text-[#6c6c6c] cursor-not-allowed',
         false: ''
      }
   }
})

/** @dev Tailwind CSS variant for text area input */
const textArea = tv({
   base: 'flex border-b-[1px] border-neutral-light_gray p-2 pt-0 placeholder:text-gray-light placeholder:text-base  focus:outline-none focus:text-neutral-black w-full placeholder-shown:text-neutral-black bg-transparent focus:border-neutral-black',
   variants: {
      hasIcon: {
         start: 'data-[start=true]:px-11',
         end: 'data-[end=true]:px-11',
         none: ''
      }
   }
})

/** @dev Tailwind CSS variant for password input */
const password = tv({
   base: 'flex items-center rounded-none border-b-[1px] border-neutral-light_gray p-2 pt-0 placeholder:text-gray-light placeholder:text-base focus:outline-none focus:text-neutral-black w-full placeholder-shown:text-neutral-black bg-transparent focus:border-b-primary-main'
})

/**
 * @dev Root component for wrapping input elements
 * @param {WrapperInputProps} props - Properties for the input wrapper component
 * @return JSX Element
 */
const Root: React.FC<WrapperInputProps> = ({ children }: WrapperInputProps) => {
   return <div className="grid items-end gap-2 w-full relative">{children}</div>
}

/**
 * @dev Label component for inputs
 * @param {LabelProps} props - Properties for the label component
 * @return JSX Element
 */
const Label: React.FC<LabelProps> = ({ children, optional, icon, tooltip_message, ...props }: LabelProps) => {
   return (
      <div className="flex items-center gap-2">
         <label className="text-base text-black-primary font-semibold" {...props}>
            {icon && (
               <span className={twMerge('material-symbols-outlined !text-2xl !font-regular !text-black-primary select-none text-center rounded-md')}>
                  {icon}
               </span>
            )}
            {children} {optional && <span className="text-gray-main font-regular">(Optional)</span>}
         </label>
         {tooltip_message && <Tooltip.Information content={tooltip_message} />}
      </div>
   )
}

/**
 * @dev Error display component for inputs
 * @param {ErrorProps} props - Properties for the error component
 * @return JSX Element
 */
const Error: React.FC<ErrorProps> = ({ children }: ErrorProps) => {
   return <React.Fragment>{children && <p className="text-red-500 text-sm">{children}</p>} </React.Fragment>
}

/**
 * @dev Text area input component
 * @param {TextAreaProps} props - Properties for the text area component
 * @param {LegacyRef<HTMLInputElement>} ref - Ref for the text area
 * @return JSX Element
 */
const TextArea = React.forwardRef<HTMLInputElement, TextAreaProps>(({ icon, start = icon ? true : false, end, className, ...props }, ref) => {
   /** @dev define if has icon */
   const hasIcon = icon !== undefined
   const iconPosition = start ? 'start' : end ? 'end' : 'none'

   return (
      <React.Fragment>
         <div className="relative h-fit">
            {hasIcon && (
               <div data-end={end} className="absolute left-0 top-3 bottom-0 flex items-start px-3 data-[end=true]:left-auto data-[end=true]:right-0">
                  {icon}
               </div>
            )}
            <textarea ref={ref as React.LegacyRef<HTMLTextAreaElement>} className={twMerge(textArea({ hasIcon: iconPosition }), className)} {...props} />
         </div>
      </React.Fragment>
   )
})

/**
 * @dev Password input component with visibility toggle
 * @param {InputProps} props - Properties for the password input component
 * @param {LegacyRef<HTMLInputElement>} ref - Ref for the input
 * @return JSX Element
 */
const Password = React.forwardRef<HTMLInputElement, InputProps>(({ ...props }, ref) => {
   const [isVisible, setIsVisible] = React.useState(false)

   return (
      <React.Fragment>
         <div className="relative">
            <input ref={ref} className={password()} type={isVisible ? 'text' : 'password'} {...props} />
            <div className="absolute right-0 top-0 bottom-0 flex items-center px-3">
               {isVisible ? (
                  <Eye className="cursor-pointer fill-neutral-gray" onClick={() => setIsVisible(!isVisible)} />
               ) : (
                  <EyeSlash className="cursor-pointer fill-neutral-gray" onClick={() => setIsVisible(!isVisible)} />
               )}
            </div>
         </div>
      </React.Fragment>
   )
})

/**
 * @dev Standard input component with optional icon
 * @param {InputProps} props - Properties for the input component
 * @param {LegacyRef<HTMLInputElement>} ref - Ref for the input
 * @return JSX Element
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ icon, start = icon ? true : false, end, disabled = false, className, ...props }, ref) => {
   /** @dev define if has icon */
   const hasIcon = icon !== undefined
   const iconPosition = start ? 'start' : end ? 'end' : 'none'
   const disabledStatus = disabled ? true : false

   return (
      <React.Fragment>
         <div className="relative h-fit">
            {hasIcon && (
               <div data-end={end} className="absolute left-0 top-0 bottom-0 flex items-center px-3 data-[end=true]:left-auto data-[end=true]:right-0">
                  {icon}
               </div>
            )}
            <input
               ref={ref}
               disabled={disabled}
               data-start={hasIcon && !end}
               className={twMerge(
                  input({
                     hasIcon: iconPosition,
                     disabled: disabledStatus
                  }),
                  className
               )}
               {...props}
            />
         </div>
      </React.Fragment>
   )
})

/**
 * @dev Search bar input component
 * @param {InputProps} props - Properties for the search input component
 * @param {LegacyRef<HTMLInputElement>} ref - Ref for the input
 * @return JSX Element
 */
const Search = React.forwardRef<HTMLInputElement, InputProps>(({ disabled = false, className, ...props }, ref) => {
   return (
      <Root>
         <Input
            ref={ref}
            disabled={disabled}
            className={twMerge('px-4 py-3 h-fit border-none bg-neutral-white shadow-search rounded-md text-sm', className)}
            {...props}
            icon={<SearchIcon className="text-neutral-gray w-[1.125rem] h-[1.125rem]" />}
         />
      </Root>
   )
})

/**
 * @dev Select input component with customizable options
 * @param {SelectInputProps} props - Properties for the select input component
 * @param {LegacyRef<HTMLInputElement>} ref - Ref for the input
 * @return JSX Element
 */
const Select = React.forwardRef<HTMLInputElement, SelectInputProps>(
   (
      {
         options,
         placeholder,
         label,
         className,
         value,
         defaultValue,
         onValueChange,
         variant = 'input',
         icon,
         start = icon ? true : false,
         end,
         required,
         name
      }: SelectInputProps,
      ref
   ) => {
      /** @dev define if has icon */
      const hasIcon = icon !== undefined

      const { windowDimension } = useDimension()

      /** @dev Get ref object to set width of content */
      const triggerRef = React.useRef<HTMLDivElement>(null)

      React.useEffect(() => {}, [windowDimension])

      return (
         <S.Root
            value={value}
            defaultValue={defaultValue}
            required={required}
            name="select"
            onValueChange={(value: string) => {
               onValueChange?.(value)
            }}
         >
            <div className="grid gap-2">
               {label && <label className="text-sm font-semibold">{label}</label>}
               <div className="relative h-fit">
                  {hasIcon && (
                     <div
                        data-end={end}
                        className="absolute left-0 top-0 bottom-0 flex items-center px-3 data-[end=true]:left-auto data-[end=true]:right-0"
                     >
                        {icon}
                     </div>
                  )}
                  <div className="w-full" ref={triggerRef}>
                     <S.Trigger variant={variant} aria-controls="select-trigger" name={name}>
                        <S.Value placeholder={placeholder} />
                        <S.Icon>
                           {hasIcon ? (
                              <CaretDown className="fill-black-primary mr-[5.5rem]" width={18} />
                           ) : (
                              <CaretDown className="fill-black-primary" width={18} />
                           )}
                        </S.Icon>
                     </S.Trigger>
                  </div>
               </div>
            </div>
            <S.Portal>
               <S.Content sideOffset={5} position="item-aligned" className={twMerge(className)} style={{ minWidth: triggerRef.current?.clientWidth }}>
                  <S.Viewport>
                     <S.Group>
                        {options?.map((option) => (
                           <S.Item className="text-md font-regular" key={option.id || option.value} value={option.value as string}>
                              <S.ItemText>{option.label}</S.ItemText>
                           </S.Item>
                        ))}
                     </S.Group>
                  </S.Viewport>
               </S.Content>
            </S.Portal>
         </S.Root>
      )
   }
)

/**
 * @dev Percentage input component using CurrencyInput
 * @param {CurrencyInputProps} props - Properties for the currency input component
 * @param {LegacyRef<HTMLInputElement>} ref - Ref for the input
 * @return JSX Element
 */
const Percentage = React.forwardRef<HTMLInputElement, CurrencyInputProps>(({ ...props }, ref) => {
   return (
      <CurrencyInput
         className={twMerge(input(), props.className)}
         decimalSeparator=","
         groupSeparator="."
         decimalsLimit={2}
         allowNegativeValue={false}
         suffix="%"
         onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value
            const number = parseFloat(value.replace(',', '.'))

            if (value === '-') event.target.value = ''
            if (number > 100) event.target.value = '100'
         }}
         ref={ref}
         {...props}
      />
   )
})

/** @dev Set display name for each component */
TextArea.displayName = 'TextArea'
Password.displayName = 'Password'
Input.displayName = 'Input'
Search.displayName = 'Search'
Select.displayName = 'Select'
Percentage.displayName = 'Percentage'

export { Error, Input, Label, Password, Percentage, Root, Search, Select, TextArea }

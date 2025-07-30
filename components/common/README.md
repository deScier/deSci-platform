# Common Components

The `Common` folder contains components that are widely reused in various parts of the application. These components are essential for consistency and efficiency in development, designed for maximum reuse and modularity.

## Component Structure

The components in this folder follow the composition pattern in React.js, providing flexibility and reusability. Each component is built with a modular approach, where specific functionalities are encapsulated in smaller subcomponents.

### Component Composition Example: Input

The `Input` component is an example of how we implement the composition pattern:

- **`Root`**: Container for the Input elements.

```jsx
const Root: React.FC<WrapperInputProps> = ({ children }: WrapperInputProps) => {
   return <div className="grid items-end gap-2 w-full relative">{children}</div>
}
```

- **`Label`**: Functional component to render a label, which can include an optional icon.

```jsx
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
```

- **`Error`**: Displays error messages.

```jsx
const Error: React.FC<ErrorProps> = ({ children }: ErrorProps) => {
   return <React.Fragment>{children && <p className="text-red-500 text-sm">{children}</p>} </React.Fragment>
}
```

- **`Input`**: The main component of the input field, with support for icons at the start or end.

```jsx
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ icon, start = icon ? true : false, end, disabled = false, className, ...props }, ref) => {
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

```

### Import

To use the `Input` component, import it as follows:

```jsx
import * as Input from '@components/common/Input/Input';
```

### Usage

```jsx
<Input.Root>
  <Input.Label className="flex gap-2 items-center">Title</Input.Label>
  <Input.Input placeholder="Title of the article" {...register('title')} />
  <Input.Error>{errors.title?.message}</Input.Error>
</Input.Root>
```

This import allows you to access all the subcomponents of Input, making it easy to use them flexibly and modularly in the project.

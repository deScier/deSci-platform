import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from '@/components/ui/select'
import { article_types_submit_article, articles_types_filter } from '@/mock/articles_types'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'
import { SelectArticleTypeProps } from './Typing'

import React from 'react'
import slug from 'slug'

/**
 * @title SelectArticleType Component
 * @notice This component renders a dropdown select for choosing an article type.
 * @dev Component for selecting an article type from a predefined list of options.
 */
export const SelectArticleType: React.FC<SelectArticleTypeProps> = ({
   variant = 'filter',
   onValueChange,
   selected: selected_value,
   no_selected,
   placeholder,
   items,
   className
}: SelectArticleTypeProps) => {
   /**
    * @dev Determines the initial selected value based on props.
    * @dev If `no_selected` is true, there is no initial selection, otherwise it uses `selected_value` or the first item in `items`.
    */
   const initialSelected = no_selected ? null : selected_value

   /** @dev State hook for managing the currently selected item. */
   const [selected, setSelected] = React.useState<string | null>(initialSelected)
   const [label, setLabel] = React.useState<string | null>(null)

   /** @dev Effect hook to update the `selected` state when `selected_value`  prop changes. */
   React.useEffect(() => {
      if (selected_value !== undefined) {
         setSelected(selected_value)
      }
   }, [selected_value])
   return (
      <React.Fragment>
         <Select
            onValueChange={(value) => {
               setSelected(value)

               const findLabelItem = article_types_submit_article.find((item) => item.type === 'label' && item.related?.includes(value))

               if (findLabelItem) {
                  const labelName = findLabelItem.label
                  setLabel(labelName)
                  onValueChange(value, slug(labelName, { lower: true, replacement: '-' }))
               } else {
                  onValueChange(value)
               }
            }}
         >
            <SelectTrigger
               className={twMerge(
                  `${
                     variant === 'filter' &&
                     'flex items-center gap-1 justify-center py-2 px-4 text-sm rounded-full min-w-[200px] w-fit border-[1px] border-primary-main text-primary-main hover:scale-105 transition-all duration- bg-transparent font-semibold'
                  }`,
                  `${variant === 'input' && input()}`,
                  `${variant === 'input' && 'border-t-0 border-l-0 border-r-0 h-[34px]'}`,
                  `${variant === 'input' && selected === null ? 'text-neutral-light_gray text-base' : 'text-black text-base'}`,
                  className
               )}
            >
               {items && selected === null ? (
                  <span className={twMerge(`${variant === 'filter' && 'text-sm font-semibold text-primary-main'}`)}>{placeholder}</span>
               ) : (
                  <span className={twMerge(`${variant === 'filter' && 'text-sm font-semibold text-primary-main'}`)}>
                     {articles_types_filter.find((item) => item.type === 'item' && item.value === selected)?.label}
                  </span>
               )}
            </SelectTrigger>
            <SelectContent>
               <SelectGroup>
                  {items ? (
                     <React.Fragment>
                        {items.map((item, index) => (
                           <React.Fragment key={item.id}>
                              {item.type === 'label' && (
                                 <React.Fragment>
                                    {index !== 0 && <DropdownMenuSeparator />}
                                    <SelectLabel className="px-4">{item.label}</SelectLabel>
                                 </React.Fragment>
                              )}
                              {item.type === 'item' && (
                                 <SelectItem
                                    value={item.value as string}
                                    className="px-4 text-sm font-semibold text-primary-main hover:text-primary-hover cursor-pointer"
                                    onMouseUp={() => setLabel(item.label)}
                                 >
                                    {item.label}
                                 </SelectItem>
                              )}
                           </React.Fragment>
                        ))}
                     </React.Fragment>
                  ) : (
                     <React.Fragment>
                        {articles_types_filter.map((item, index) => (
                           <React.Fragment key={item.id}>
                              {item.type === 'label' && (
                                 <React.Fragment>
                                    {index !== 0 && <DropdownMenuSeparator />}
                                    <SelectLabel className="px-4">{item.label}</SelectLabel>
                                 </React.Fragment>
                              )}
                              {item.type === 'item' && (
                                 <SelectItem
                                    value={item.value as string}
                                    className="px-4 text-sm font-semibold text-primary-main hover:text-primary-hover cursor-pointer"
                                    onMouseUp={() => setLabel(item.label)}
                                 >
                                    {item.label}
                                 </SelectItem>
                              )}
                           </React.Fragment>
                        ))}
                     </React.Fragment>
                  )}
               </SelectGroup>
            </SelectContent>
         </Select>
      </React.Fragment>
   )
}

const input = tv({
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

import { DocumentTypes } from '@/mock/document_types'
import { twMerge } from 'tailwind-merge'

import React from 'react'

/**
 * @title Pills Component
 * @notice This component represents a set of pills or buttons for user interaction.
 * @dev The Pills component is used to create a set of selectable buttons.
 *
 * @param items - An array of objects representing the pills with labels and values.
 * @param onSelect - A callback function that is called when a pill is selected.
 * @param selected - The currently selected pill's value.
 *
 * @return A set of pills with labels that can be clicked to select.
 */
export const Pills: React.FC<PillsProps> = ({ items, onSelect, selected }: PillsProps) => {
   /** @dev Initialize the active state to keep track of the currently active pill. */
   const [active, setActive] = React.useState<number>(0)
   return (
      <div className="grid grid-flow-col">
         {items.map((item, index) => (
            <React.Fragment key={item.id}>
               <button
                  type="button"
                  data-active={active === index}
                  className={twMerge(
                     'text-sm text-neutral-gray px-4 py-2 border border-neutral-gray hover:text-status-green hover:border-status-green transition-all duration-200 ease-out',
                     `${index === 0 && 'rounded-l-full'}`,
                     `${index === items.length - 1 && 'rounded-r-full'}`,
                     `${selected === item.value && 'text-status-green border-status-green'}`,
                     `${active === index && 'text-status-green border-status-green'}`
                  )}
                  onClick={() => {
                     setActive(index)
                     onSelect && onSelect(item)
                  }}
               >
                  {item.label}
               </button>
            </React.Fragment>
         ))}
      </div>
   )
}

type PillsProps = {
   items: DocumentTypes[]
   onSelect?: (value: DocumentTypes) => void
   selected?: string
}

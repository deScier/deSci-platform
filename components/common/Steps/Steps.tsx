import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Check } from 'react-bootstrap-icons'

import React from 'react'

const Root: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="flex items-center justify-between w-full">{children}</div>

const Indicator: React.FC<{ current: number; step: number; completed: number; last_item: boolean; total_items: number; all_completed: boolean }> = ({
   current,
   step,
   completed,
   last_item,
   total_items,
   all_completed
}) => {
   const is_completed = step < current || completed >= step
   const separator_color = all_completed ? 'bg-primary-main' : is_completed ? 'bg-primary-main' : 'bg-[#A9A9A9]'

   return (
      <div
         className={cn('flex items-center', {
            'w-full': !last_item
         })}
      >
         <div
            id={`step-${step} of ${total_items} is ${is_completed ? 'completed' : 'incomplete'}`}
            className={cn('flex items-center justify-center min-w-[28px] min-h-[28px] rounded-full', {
               'bg-white text-primary-main border-primary-main border-[2px]': step === current,
               'bg-[#A9A9A9] text-[#E5F2FF]': step > current,
               'bg-primary-main': is_completed
            })}
         >
            {is_completed ? <Check className="text-white" /> : <span className="text-xs font-medium">{step}</span>}
         </div>
         {!last_item && <Separator orientation="horizontal" className={cn('h-1 flex-grow flex', separator_color)} />}
      </div>
   )
}

export { Indicator, Root }

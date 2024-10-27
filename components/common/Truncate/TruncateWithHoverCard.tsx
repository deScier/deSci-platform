import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { cn } from '@/lib/utils'

import useDimension from '@/hooks/useWindowDimension'
import React from 'react'

type TruncateWithHoverCardProps = {
   text: string
   className?: string
   truncateLength?: number
}

const TruncateWithHoverCard: React.FC<TruncateWithHoverCardProps> = ({ text, className, truncateLength }: TruncateWithHoverCardProps) => {
   const { windowDimension } = useDimension()

   if (!windowDimension) return null

   return (
      <React.Fragment>
         <HoverCard>
            <HoverCardTrigger className="flex flex-col md:flex-row md:items-center gap-4 flex-1 min-w-0">
               <p
                  className={cn(
                     'hidden lg:block hover:underline transition-all duration-200 truncate',
                     className,
                     windowDimension > 1024 && windowDimension < 1080 ? `max-w-[${truncateLength ? truncateLength : 30}ch]` : ''
                  )}
               >
                  {text}
               </p>
               <p className={cn('block lg:hidden hover:underline transition-all duration-200 truncate', className)}>{text}</p>
            </HoverCardTrigger>
            <HoverCardContent align="center" side="top" className="w-fit max-w-[500px] py-1">
               <p className={cn('text-sm text-start font-semibold text-primary-main w-full', className)}>{text}</p>
            </HoverCardContent>
         </HoverCard>
      </React.Fragment>
   )
}

export { TruncateWithHoverCard }

import '@styles/sidebar.css'
import Link from 'next/link'
import React from 'react'

/**
 * @title Item Component
 * @notice This component renders an item with optional icons and text, supports active state, and can act as a link or a clickable item.
 * @dev Component to display a list item with icons and text. It can be used as a link or a clickable div. Supports active states and dividers.
 */
const Item: React.FC<ItemProps> = ({ icon, icon_end, text, active = false, href, divider, onClick }: ItemProps) => {
   return (
      <React.Fragment>
         {divider ? (
            <React.Fragment>
               <div className="divider-h my-4" />
            </React.Fragment>
         ) : (
            <React.Fragment>
               {href ? (
                  <Link href={href} target={href?.includes('http') ? '_blank' : undefined} onClick={onClick}>
                     <div
                        data-active={active}
                        className="relative hover:bg-[#F4E8FF] rounded-md hover:transition-colors duration-200 dark:hover:transition-colors"
                     >
                        {active && <div className="h-full w-1 bg-black-primary absolute" />}
                        <div className="flex w-full items-center gap-4 py-3 px-2 md:py-2 md:px-2 cursor-pointer min-h-[2.875rem] item-p">
                           <div data-active={active} className="w-6 first:fill-neutral-light_gray item">
                              {icon !== null && React.cloneElement(icon as React.ReactElement)}
                           </div>
                           <div className="flex items-center gap-2">
                              <p
                                 data-active={active}
                                 className="font-regular text-neutral-light_gray text-base data-[active=true]:font-semibold data-[active=true]:text-primary-main"
                              >
                                 {text}
                              </p>
                              {icon_end && (
                                 <div className="w-6 last:fill-neutral-light_gray item">{React.cloneElement(icon_end as React.ReactElement)}</div>
                              )}
                           </div>
                        </div>
                     </div>
                  </Link>
               ) : (
                  <div
                     data-active={active}
                     className="relative hover:bg-[#F4E8FF] rounded-md hover:transition-colors duration-200 dark:hover:transition-colors"
                     onClick={onClick}
                  >
                     {active && <div className="h-full w-1 bg-black-primary absolute" />}
                     <div className="flex w-full items-center gap-4 py-3 px-2 md:py-2 md:px-2 cursor-pointer min-h-[2.875rem] item-p">
                        <div data-active={active} className="w-6 first:fill-neutral-light_gray item">
                           {icon !== null && React.cloneElement(icon as React.ReactElement)}
                        </div>
                        <div className="flex items-center gap-2">
                           <p
                              data-active={active}
                              className="font-regular text-neutral-light_gray text-base data-[active=true]:font-semibold data-[active=true]:text-primary-main"
                           >
                              {text}
                           </p>
                           {icon_end && <div className="w-6 last:fill-neutral-light_gray item">{React.cloneElement(icon_end as React.ReactElement)}</div>}
                        </div>
                     </div>
                  </div>
               )}
            </React.Fragment>
         )}
      </React.Fragment>
   )
}

type ItemProps = {
   icon: React.ReactNode
   icon_end?: React.ReactNode
   text: string
   active?: boolean
   href: string | null
   divider?: boolean
   onClick?: () => void
}

export default Item

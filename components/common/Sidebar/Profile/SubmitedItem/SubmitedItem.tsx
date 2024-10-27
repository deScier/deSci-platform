import { BadgeProps, SubmitedItemProps } from '@components/common/Sidebar/Profile/Typing'

import React from 'react'

/**
 * @title SubmitedItem Functional Component
 * @notice Displays individual submitted item with title, date, and status badge.
 * @dev Renders a submitted item using the SubmitedItemProps interface.
 * @param {SubmitedItemProps} props - The properties passed to the component.
 */
const SubmitedItem: React.FC<SubmitedItemProps> = ({ id, title, date, status, onClick }: SubmitedItemProps) => {
   return (
      <React.Fragment>
         <p className="text-sm cursor-pointer hover:text-primary-hover hover:underline transition-all duration-200" onClick={onClick}>
            {title}
         </p>
         <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-light_gray">{date}</p>
            <Badge status={status} />
         </div>
      </React.Fragment>
   )
}

/**
 * @title Badge Functional Component
 * @notice Renders a badge indicating the status of a submission.
 * @dev Component to display status of submissions with different styles based on status value.
 * @param {BadgeProps} props - The properties passed to the Badge component.
 */
const Badge: React.FC<BadgeProps> = ({ status }: BadgeProps) => {
   /** @dev Capitalizes the first letter of the status for display. */
   const status_text = status.charAt(0).toUpperCase() + status.slice(1)

   return (
      <React.Fragment>
         {status === 'SUBMITTED' && (
            <div className="bg-[#ECF8E5] py-1 px-2 rounded-xs">
               <p className="font-[500] text-sm text-status-green select-none">Published</p>
            </div>
         )}
         {['PENDING', 'APPROVED', 'ADMIN_APPROVE'].includes(status) && (
            <div className="bg-[#FFF7E7] py-1 px-2 rounded-xs">
               <p className="font-[500] text-sm text-status-pending select-none">In review</p>
            </div>
         )}
      </React.Fragment>
   )
}

export default SubmitedItem

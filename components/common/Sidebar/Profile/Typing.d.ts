interface ProfileProps {
   className?: string
   onClose?: () => void
}

interface BadgeProps {
   status: string
}

interface SubmitedItemProps {
   id?: number
   title: string
   date: string
   status: string
   onClick: () => void
}

export { BadgeProps, ProfileProps, SubmitedItemProps }

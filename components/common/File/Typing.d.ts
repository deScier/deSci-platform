interface FileProps {
   file_name: string
   uploaded_at: string
   uploaded_by: string
   onDownload: () => void
   onDelete?: () => void
}

export { FileProps }

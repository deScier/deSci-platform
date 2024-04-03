import { getSession } from 'next-auth/react'

const API_URL = process.env.NEXT_PUBLIC_API_URL

type UploadFileProps = {
   documentId?: string
   journalId?: string
   fileLocalUrl: string
   filename: string
   mimetype: string
}

export const localUrlToFile = async (localUrl: string, filename: string): Promise<File> => {
   const request = await fetch(localUrl, {
      method: 'GET'
   })
   const blob = await request.blob()
   const file = new File([blob], filename)

   return file
}

export const uploadAvatarService = async (body: UploadFileProps): Promise<string> => {
   const session = await getSession()

   const file = await localUrlToFile(body.fileLocalUrl, body.filename)
   const formData = new FormData()
   formData.append('file', file)
   formData.append('mimetype', body.mimetype)

   const request = await fetch(`${API_URL}/users/avatar`, {
      method: 'PATCH',
      body: formData,
      headers: {
         Authorization: `Bearer ${session?.user?.token}`,
         'Access-Control-Allow-Origin': '*'
      }
   })

   const response = request.status === 201

   const data = await request.json()

   return data?.fileUrl
}

export const uploadJournalCoverService = async (body: UploadFileProps): Promise<boolean> => {
   const session = await getSession()

   const file = await localUrlToFile(body.fileLocalUrl, body.filename)
   const formData = new FormData()
   formData.append('file', file)
   formData.append('mimetype', body.mimetype)

   const request = await fetch(`${API_URL}/journals/upload/${body.journalId}`, {
      method: 'POST',
      body: formData,
      headers: {
         Authorization: `Bearer ${session?.user?.token}`,
         'Access-Control-Allow-Origin': '*'
      }
   })

   const response = request.status === 200

   return response
}

export const uploadDocumentFileService = async (body: UploadFileProps) => {
   const session = await getSession()
   console.log('body', body)
   const file = await localUrlToFile(body.fileLocalUrl, body.filename)
   const formData = new FormData()
   formData.append('file', file)
   formData.append('type', body.mimetype)

   const request = await fetch(`${API_URL}/documents/upload/${body.documentId}`, {
      method: 'POST',
      body: formData,
      headers: {
         Authorization: `Bearer ${session?.user?.token}`,
         'Access-Control-Allow-Origin': '*'
      }
   })

   const responseStatus = request.status === 200

   return responseStatus
}

'use client'

import * as Button from '@components/common/Button/Button'
import * as Dialog from '@components/common/Dialog/Digalog'
import * as Input from '@components/common/Input/Input'
import * as Tooltip from '@components/common/Tooltip/Tooltip'

import { StoredFile } from '@/components/common/Dropzone/Typing'
import { File } from '@/components/common/File/File'
import { SelectArticleType } from '@/components/common/Filters/SelectArticleType/SelectArticleType'
import { YouAre, YouAreAuthor } from '@/components/common/Flags/Author/AuthorFlags'
import { InviteLink } from '@/components/common/InviteLink/InviteLink'
import { AuthorsListDragabble } from '@/components/common/Lists/Authors/Authors'
import { EditorReviewList } from '@/components/common/Lists/EditorReview/EditorReview'
import { AddNewAuthor } from '@/components/modules/Summary/NewArticle/AddNewAuthor/AddNewAuthor'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetApprovals } from '@/hooks/useGetApprovals'
import { useLimitCharacters } from '@/hooks/useLimitCharacters'
import { access_type_options } from '@/mock/access_type'
import { header_editor_reviewer } from '@/mock/article_under_review'
import { article_types_submit_article } from '@/mock/articles_types'
import { Author, authors_headers, authors_mock, authorship_headers } from '@/mock/submit_new_document'
import { home_routes } from '@/routes/home'
import { AddCommentProps, addCommentSchema } from '@/schemas/comments'
import { UpdateDocumentProps, UpdateDocumentSchema } from '@/schemas/update_document'
import { downloadDocumentVersionService } from '@/services/document/download.service'
import { finalSubmitDocumentService } from '@/services/document/finalSubmit.service'
import { DocumentGetProps } from '@/services/document/getArticles'
import { useArticles } from '@/services/document/getArticles.service'
import { UpdateAuthor, updateDocumentService } from '@/services/document/update.service'
import { uploadDocumentFileService } from '@/services/file/file.service'
import { addCommentService } from '@/services/reviewer/addComment.service'
import { ApproveStatus, approveCommentService } from '@/services/reviewer/approveComment.service'
import { updateCommentService } from '@/services/reviewer/updateComment.service'
import { ActionComments, comments_initial_state, reducer_comments } from '@/states/reducer_comments'
import { extractFileName } from '@/utils/extract_file_name'
import { keywordsArray } from '@/utils/keywords_format'
import { zodResolver } from '@hookform/resolvers/zod'
import { isEqual, uniqueId } from 'lodash'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useReducer } from 'react'
import { ArrowLeft, FileEarmarkText, Pencil, PlusCircle, PlusCircleDotted, Trash, X } from 'react-bootstrap-icons'
import { CurrencyInput } from 'react-currency-mask'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { twMerge } from 'tailwind-merge'

import Box from '@/components/common/Box/Box'
import CommentItem from '@/components/common/Comment/Comment'
import DocumentApprovals from '@/components/common/DocumentApprovals/DocumentApprovals'
import Dropzone from '@/components/common/Dropzone/Dropzone'
import EditComment from '@/components/modules/deScier/Article/EditComment'
import Reasoning from '@/components/modules/deScier/Article/Reasoning'
import mermaid from 'mermaid'
import Link from 'next/link'

export default function ArticleInReviewPage({ params }: { params: { slug: string } }) {
   const router = useRouter()

   const { data } = useSession()
   const { fetch_article } = useArticles()
   const [state, dispatch] = useReducer(reducer_comments, comments_initial_state)

   const [article, setArticle] = React.useState<DocumentGetProps | null>(null)
   const [items, setItems] = React.useState(authors_mock)
   const [authors, setAuthors] = React.useState<Author[]>([])
   const [access_type, setAccessType] = React.useState('open-access')
   const [authorship_settings, setAuthorshipSettings] = React.useState<Author>()
   const [mermaid_error, setMermaidError] = React.useState('' as string | null)
   const [popover, setPopover] = React.useState({ copy_link: false })
   const [dialog, setDialog] = React.useState({ author: false, share_split: false, edit_author: false, reasoning: false, edit_comment: false })
   const [loading, setLoading] = React.useState(false)
   const [submitLoading, setSubmitLoading] = React.useState(false)
   const [saveLoading, setSaveLoading] = React.useState(false)
   const [is_author, setIsAuthor] = React.useState(false)
   const [documentSaved, setDocumentSaved] = React.useState(false)
   const [keywords_temp, setKeywordsTemp] = React.useState<string | undefined>()
   const [file, setFile] = React.useState<StoredFile | null>()
   const [buttonLoading, setButtonLoading] = React.useState({ comment: false })
   const [updateAuthors, setUpdateAuthors] = React.useState<UpdateAuthor[]>([])
   const [removeAuthors, setRemoveAuthors] = React.useState<string[]>([])
   const [edit_share_split, setEditShare] = React.useState<Author | null>()
   const [share, setShare] = React.useState('')
   const [wallet, setWallet] = React.useState('')

   const {
      register,
      watch,
      formState: { errors },
      setValue,
      trigger,
      getValues,
      control,
      setError
   } = useForm<UpdateDocumentProps>({
      resolver: zodResolver(UpdateDocumentSchema),
      defaultValues: {
         abstract: '',
         abstractChart: '',
         accessType: 'FREE',
         documentType: '',
         field: '',
         price: '',
         title: '',
         file: [],
         authors: [],
         keywords: [],
         category: '',
         cover: {}
      }
   })

   console.log('watch', watch())

   const {
      watch: watch_comment,
      setValue: setValue_comment,
      getValues: getValues_comment
   } = useForm<AddCommentProps>({
      resolver: zodResolver(addCommentSchema),
      values: {
         comment: '',
         documentId: article?.document?.id || ''
      }
   })

   const { getApprovals, editorApprovals, reviewerApprovals } = useGetApprovals()

   const { append, remove, fields: keywords } = useFieldArray({ name: 'keywords', control: control })

   const fetchSingleArticle = async (documentId: string) => {
      await fetch_article(documentId).then((res) => {
         console.log('res', res)
         setArticle(res as DocumentGetProps)
         const access = res?.document.accessType === 'FREE' ? 'open-access' : 'paid-access'
         setAccessType(access)
         const keywords = res?.document.keywords?.split(';')
         if (keywords) {
            setValue(
               'keywords',
               keywords.map((item) => ({ id: uniqueId('keywords'), name: item }))
            )
            trigger('keywords')
         }

         if (article?.document.documentVersions) {
            const documentFiles: StoredFile[] = article.document.documentVersions?.map((item) => ({
               lastModified: 0,
               lastModifiedDate: new Date(item.createdAt),
               name: item.fileName || '',
               path: item.link,
               preview: '',
               size: 0,
               type: item.fileName?.split('.')[1] || ''
            }))
            setValue('file', documentFiles)
            trigger('file')
         }

         getApprovals(res?.document.reviewersOnDocuments || [])

         if (res?.document?.documentComments && res?.document?.documentComments.length > 0) {
            const commentsPayload = res.document.documentComments.map((comment) => ({
               id: comment.id,
               comment_author: comment.user.name,
               comment_content: comment.comment,
               reason: comment.authorComment || '',
               status: comment.approvedByAuthor as 'PENDING' | 'APPROVED' | 'REJECTED',
               user_id: comment.userId
            }))
            dispatch({
               type: 'store_comments_from_api',
               payload: commentsPayload
            } as ActionComments)
         }

         if (res?.document?.authorsOnDocuments && res.document.authorsOnDocuments.length > 0) {
            const documentAuthors: Author[] = res.document.authorsOnDocuments.map((item) => {
               return {
                  email: item.authorEmail!,
                  id: item.id,
                  name: item.author?.name!,
                  title: item.author?.title!,
                  share: item.revenuePercent ? String(item.revenuePercent) : '',
                  wallet: item.author?.walletAddress
               }
            })

            setAuthors(documentAuthors)
         }
      })
   }

   React.useEffect(() => {
      if (params.slug !== undefined) {
         fetchSingleArticle(params.slug)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [params.slug, data?.user?.userInfo?.id])

   React.useEffect(() => {
      if (article) {
         setValue('title', article.document.title)
         setValue('field', article.document.field)
         setValue('abstract', article.document.abstract)
         setValue('abstractChart', article.document.abstractChart ? article.document.abstractChart : undefined)
         setValue('documentType', article.document.documentType)
         setValue('price', String(article.document.price))
         setValue(
            'authors',
            article?.document.authorsOnDocuments?.map((item) => ({
               email: item.authorEmail as string,
               id: item.id as string,
               name: item.author?.name as string,
               title: item.author?.title as string,
               revenuePercent: String(item.revenuePercent),
               walletAddress: item.author?.walletAddress as string
            })) || []
         )
         setValue(
            'keywords',
            keywordsArray(article.document.keywords || '').map((item) => ({ id: uniqueId('keywords'), name: item }))
         )
         setValue('accessType', article.document.accessType as 'FREE' | 'PAID')
         setValue(
            'file',
            article?.document.documentVersions?.map((item) => ({
               name: item.fileName as string,
               lastModified: 0,
               lastModifiedDate: new Date(item.createdAt),
               path: item.link,
               preview: item.link,
               size: 0,
               type: item.fileName?.split('.')[1] || ''
            })) || []
         )
         setValue('cover', {
            name: extractFileName(article.document.cover as string) || '',
            lastModified: 0,
            lastModifiedDate: new Date(),
            path: article.document.cover as string,
            preview: article.document.cover as string,
            size: 0,
            type: extractFileName(article.document.cover as string)?.split('.')[1] || ''
         })
         setValue('category', article.document.category)
      }
   }, [article, setValue])

   const onReorder = (newOrder: typeof items) => {
      console.log('new order', newOrder)
      setAuthors(newOrder)
      setValue('authors', newOrder)
      const updateNewOrder: UpdateAuthor[] = newOrder.map((item, index) => ({
         id: item.id,
         name: item.name,
         email: item.email,
         position: index + 1,
         revenuePercent: item.share ? Number(item.share) : 0,
         title: item.title,
         walletAddress: item.wallet || ''
      }))

      const removeNewAuthors = updateNewOrder.filter((item) => !item.id.includes('author'))

      setUpdateAuthors(removeNewAuthors)
   }

   const handleSubmitDocument = async () => {
      if (!article || !article.document) {
         toast.error('Article not found.')
         return
      }

      const documentFiles = article.document?.documentVersions || []
      const lastDocumentVersion = documentFiles[0]
      const isPdfFile = lastDocumentVersion?.fileName?.includes('pdf')

      if ((!file || !file.name.includes('pdf')) && !isPdfFile) {
         toast.error('Upload a pdf file to final submit.')
         return
      }

      setSubmitLoading(true)
      if (file && !isPdfFile) {
         const uploadFileResponse = await uploadDocumentFileService({
            fileLocalUrl: file.preview,
            filename: file.name,
            mimetype: file.type,
            documentId: article.document.id
         })
         if (!uploadFileResponse) {
            setSaveLoading(false)
            toast.error('Error in upload file.')
            return
         }
      }

      const response = await finalSubmitDocumentService({
         documentId: article.document.id
      })
      setSubmitLoading(false)

      if (!response.success) {
         toast.error(response.message)
         return
      }

      toast.success(response.message)
      router.push(home_routes.articles_under_review)
   }

   const createNewAuthors = () => {
      const documentAuthors = article?.document.authorsOnDocuments || []
      const newAuthors = getValues('authors')
         ?.map((item, index) => ({ ...item, position: index + 1, revenuePercent: Number(item.revenuePercent) || 0 }))
         .filter((item) => !documentAuthors.some((author) => author.authorEmail === item.email))

      return newAuthors || []
   }

   const handleSaveDocument = async () => {
      console.log('update')
      console.log('authors update', authors)

      console.log('update author', updateAuthors)

      if (!article) return
      setSaveLoading(true)
      console.log('access', access_type)
      const updateResponse = await updateDocumentService({
         documentId: article.document.id!,
         document: {
            abstract: getValues('abstract'),
            title: getValues('title'),
            abstractChart: getValues('abstractChart'),
            accessType: access_type === 'open-access' ? 'FREE' : 'PAID',
            authors: createNewAuthors(),
            category: getValues('category'),
            documentType: getValues('documentType'),
            field: getValues('field'),
            keywords: getValues('keywords')?.map((item) => item.name),
            price: Number(getValues('price')) || 0
         },
         authorsToRemove: removeAuthors,
         updateAuthors: updateAuthors
      })

      if (!updateResponse.success) {
         setSaveLoading(false)
         toast.error(updateResponse.message)
         return
      }

      if (file) {
         const response = await uploadDocumentFileService({
            fileLocalUrl: file.preview,
            filename: file.name,
            mimetype: file.type,
            documentId: article.document.id
         })

         if (!response) {
            setSaveLoading(false)
            toast.error('Error in upload file.')
            return
         }
      }
      if (getValues('cover')?.preview && getValues('cover')?.preview !== article?.document.cover) {
         const uploadCoverSuccess = await uploadDocumentFileService({
            documentId: article?.document.id!,
            fileLocalUrl: getValues('cover')?.preview!,
            filename: getValues('cover')?.name!,
            mimetype: getValues('cover')?.type!
         })

         if (!uploadCoverSuccess) {
            toast.warning('There was an error uploading your cover file. But you can upload later.')
         }
      }

      toast.success('Document updated successfully')
      setDocumentSaved(true)

      setSaveLoading(false)
      setUpdateAuthors([])
      setRemoveAuthors([])
      fetchSingleArticle(article.document.id)
   }

   const handleApproveDocument = async (status: ApproveStatus, commentId: string, answer?: string) => {
      const response = await approveCommentService({
         approvedStatus: status,
         commentId: commentId,
         answer: answer || ''
      })

      if (!response.success) {
         toast.error(response.message)
         return
      }
   }

   const handleDownloadDocument = async (fileId: string, filename: string) => {
      console.log('download...')
      const response = await downloadDocumentVersionService({
         documentId: article?.document.id!,
         fileId,
         userId: data?.user?.userInfo.id!
      })

      if (!response.success) {
         toast.error(response.message)
         return
      }

      const url = URL.createObjectURL(response.file!)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)

      toast.success('Download will start...')
   }

   React.useEffect(() => {
      setLoading(true)
      const isAuthor = () => {
         const author_id = typeof data?.user?.userInfo?.id === 'string' ? data.user.userInfo.id.trim() : ''
         const document_author_id = typeof article?.document.userId === 'string' ? article.document.userId.trim() : ''

         if (isEqual(author_id, document_author_id)) {
            setIsAuthor(true)
         } else {
            setIsAuthor(false)
         }
         setLoading(false)
      }

      if (article?.document?.userId && data?.user?.userInfo?.id) {
         isAuthor()
      }
   }, [article?.document?.userId, data?.user?.userInfo?.id])

   React.useEffect(() => {
      const runMermaid = async () => {
         mermaid.initialize({ startOnLoad: false, fontSize: 25 })
         await mermaid.run({ querySelector: '.mermaid' }).catch((err) => {
            setMermaidError(err.message)
         })
      }

      if (article?.document.abstractChart) {
         runMermaid()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [article?.document.abstractChart])

   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.keyCode === 13) {
         if (keywords_temp && keywords_temp.trim() !== '') {
            e.preventDefault()
            append({ id: uniqueId('key'), name: keywords_temp as string })
            setKeywordsTemp('')
         } else {
            setError('keywords', {
               type: 'manual',
               message: 'Keyword is required.'
            })
         }
      }
   }

   const handleAddComment = async () => {
      setButtonLoading({
         comment: true
      })

      const response = await addCommentService({
         documentId: article?.document.id as string,
         comment: getValues_comment('comment')
      })

      setButtonLoading({
         comment: false
      })

      if (!response.success) {
         toast.error(response.message)
         return
      }

      dispatch({
         type: 'add_new_comment',
         payload: {
            id: uniqueId(watch_comment('comment') + '_'),
            comment_author: data?.user?.name,
            comment_content: watch_comment('comment'),
            status: 'PENDING'
         }
      } as ActionComments)

      setValue_comment('comment', '')

      fetchSingleArticle(params.slug)
      router.refresh()
   }

   const handleEditComment = async (commentId: string, newComment: string) => {
      setButtonLoading({
         comment: true
      })
      const response = await updateCommentService({
         commentId: commentId,
         comment: newComment
      })

      setButtonLoading({
         comment: false
      })

      if (!response.success) {
         toast.error(response.message)
         return
      }

      dispatch({
         type: 'update_comment',
         payload: {
            id: commentId as string,
            comment_author: data?.user?.userInfo.name as string,
            status: 'PENDING' as 'PENDING' | 'APPROVED' | 'REJECTED',
            comment_content: newComment
         }
      } as ActionComments)

      setValue_comment('comment', '')
      router.refresh()
   }

   const [author_to_edit, setAuthorToEdit] = React.useState<Author | undefined>(undefined)

   const onSaveShareSettings = () => {
      if (edit_share_split && share) {
         const shareValue = parseInt(share.replace('%', ''))
         setDialog({ ...dialog, share_split: false, edit_author: false })
         setEditShare(null)
      }
   }

   const { characterLimit: fieldLimit, length: fieldLength } = useLimitCharacters(watch('field') || '')
   const { characterLimit: titleLimit, length: titleLenght } = useLimitCharacters(watch('title') || '')
   const { characterLimit: abstractLimit, length: abstractLenght } = useLimitCharacters(watch('abstract') || '')

   const [open_status, setOpenStatus] = React.useState(false)

   const handleCopy = (textToCopy: string) => {
      navigator.clipboard
         .writeText(textToCopy)
         .then(() => setOpenStatus(true))
         .catch((err) => {
            console.error('Error copying text: ', err)
         })
   }
   return (
      <React.Fragment>
         <Dialog.Root open={dialog.reasoning || dialog.edit_comment || dialog.author || dialog.edit_author || dialog.share_split}>
            <Dialog.Overlay />
            <Dialog.Content className={twMerge('md:px-16 md:py-14 pb-20')}>
               {dialog.reasoning && (
                  <Reasoning
                     message={state.comment_to_edit?.reason || ''}
                     documentAuthor={data?.user?.userInfo.name}
                     onClose={() => setDialog({ ...dialog, reasoning: false })}
                     onConfirm={(value) => {
                        console.log('state', state.comment_to_edit)
                        handleApproveDocument('REJECTED', state.comment_to_edit?.id!, value)
                        dispatch({
                           type: 'reject_comment',
                           payload: {
                              id: state.comment_to_edit?.id,
                              commentId: state.comment_to_edit?.id,
                              comment_content: state.comment_to_edit?.comment_content,
                              comment_author: state.comment_to_edit?.comment_author,
                              reason: value,
                              status: 'REJECTED',
                              user_id: state.comment_to_edit?.user_id
                           }
                        } as ActionComments)
                        setDialog({ ...dialog, reasoning: false })
                     }}
                  />
               )}
               {dialog.edit_comment && (
                  <EditComment
                     comment={state.comment_to_edit?.comment_content as string}
                     onConfirm={(value) => {
                        handleEditComment(state.comment_to_edit?.id!, value)

                        setDialog({ ...dialog, edit_comment: false })
                        dispatch({ type: 'comment_to_edit', payload: null })
                     }}
                     onClose={() => setDialog({ ...dialog, edit_comment: false })}
                  />
               )}
               {dialog.edit_author && (
                  <AddNewAuthor
                     onEditAuthor={author_to_edit}
                     onUpdateAuthor={(updatedAuthor) => {
                        setAuthors((prevItems) => {
                           return prevItems.map((item) => (item.id === author_to_edit?.id ? { ...item, ...updatedAuthor } : item))
                        })
                        if (!updatedAuthor.id.includes('author')) {
                           const authorIndex = updateAuthors.findIndex((item) => item.id === updatedAuthor.id)
                           if (authorIndex > 0) {
                              updateAuthors[authorIndex].revenuePercent = Number(share) || 0
                              updateAuthors[authorIndex].position = authorIndex + 1
                              setUpdateAuthors(updateAuthors)
                           } else {
                              setUpdateAuthors((prev) => [
                                 ...prev,
                                 { ...updatedAuthor, position: authorIndex + 1, revenuePercent: Number(updatedAuthor.revenuePercent || '0') }
                              ])
                           }
                        }
                     }}
                     onClose={() => setDialog({ ...dialog, edit_author: false })}
                  />
               )}
               {dialog.author && (
                  <AddNewAuthor
                     onAddAuthor={(value) => {
                        const newAuthor = {
                           id: value.id,
                           name: value.name,
                           title: value.title,
                           email: value.email,
                           revenuePercent: value.revenuePercent
                        }
                        setAuthors((prevItems) => [...prevItems, newAuthor])
                        setValue('authors', [...authors, newAuthor])
                        /// Update authorsOnDocuments
                        /// fetchSingleArticle(parms.slug)
                     }}
                     onClose={() => setDialog({ ...dialog, author: false })}
                  />
               )}
               {dialog.edit_author && (
                  <AddNewAuthor
                     onEditAuthor={author_to_edit}
                     onUpdateAuthor={(updatedAuthor) => {
                        setAuthors((prevItems) => {
                           return prevItems.map((item) => (item.id === author_to_edit?.id ? { ...item, ...updatedAuthor } : item))
                        })
                        if (!updatedAuthor.id.includes('author')) {
                           const authorIndex = updateAuthors.findIndex((item) => item.id === updatedAuthor.id)
                           if (authorIndex > 0) {
                              updateAuthors[authorIndex].revenuePercent = Number(share) || 0
                              setUpdateAuthors(updateAuthors)
                           } else {
                              setUpdateAuthors((prev) => [...prev, { ...updatedAuthor, revenuePercent: Number(updatedAuthor.revenuePercent || '0') }])
                           }
                        }
                     }}
                     onClose={() => setDialog({ ...dialog, edit_author: false })}
                  />
               )}
               {dialog.share_split && (
                  <React.Fragment>
                     <div className="grid gap-6">
                        <Dialog.Title title="Share split" onClose={() => setDialog({ ...dialog, share_split: false })} />
                        <div className="grid gap-6">
                           <div className="flex items-center gap-6">
                              <Input.Root>
                                 <Input.Label>Share</Input.Label>
                                 <Input.Percentage
                                    defaultValue={edit_share_split?.share?.replace('%', '') || undefined}
                                    placeholder="% of the revenue"
                                    onValueChange={(value) => {
                                       setShare(value as string)
                                    }}
                                 />
                              </Input.Root>
                              <Input.Root>
                                 <Input.Label optional>Wallet</Input.Label>
                                 <Input.Input
                                    defaultValue={edit_share_split?.wallet || undefined}
                                    placeholder="Crypto wallet adress to recieve the revenue"
                                    onChange={(e) => setWallet(e.target.value)}
                                 />
                              </Input.Root>
                           </div>
                           <Button.Button
                              variant="primary"
                              onClick={() => {
                                 if (!authorship_settings?.id) {
                                    console.error('Authorship settings does not have an ID!')
                                    return
                                 }

                                 const updatedAuthor: Author = {
                                    ...authorship_settings!,
                                    id: authorship_settings!.id,
                                    name: authorship_settings!.name,
                                    title: authorship_settings!.title,
                                    email: authorship_settings!.email,
                                    wallet: authorship_settings!.wallet,
                                    share: share.includes('%') ? share : share + '%'
                                 }

                                 console.log('authors update', authors)

                                 const authorIndex = authors.findIndex((author) => author.id === authorship_settings!.id)

                                 const updatedAuthors = [...authors]
                                 updatedAuthors[authorIndex].share = share.includes('%') ? share : share + '%'
                                 updatedAuthors[authorIndex].wallet = wallet
                                 setAuthors(updatedAuthors)

                                 if (!updatedAuthor.id.includes('author')) {
                                    console.log('updte', updateAuthors)
                                    const authorIndex = updateAuthors.findIndex((item) => item.email === updatedAuthor.email)
                                    console.log('index', authorIndex)
                                    if (authorIndex >= 0) {
                                       updateAuthors[authorIndex].revenuePercent = Number(share) || 0
                                       setUpdateAuthors(updateAuthors)
                                    } else {
                                       setUpdateAuthors((prev) => [
                                          ...prev,
                                          {
                                             id: updatedAuthor.id,
                                             email: updatedAuthor.email,
                                             name: updatedAuthor.email,
                                             revenuePercent: Number(share) || 0,
                                             walletAddress: wallet
                                          }
                                       ])
                                    }
                                 } else {
                                    const newAuthorsUpdate = updatedAuthors.map((item) => ({
                                       email: item.email,
                                       name: item.name,
                                       title: item.title,
                                       revenuePercent: share,
                                       walletAddress: item.wallet || ''
                                    }))

                                    setValue('authors', newAuthorsUpdate)
                                    trigger('authors')
                                 }

                                 onSaveShareSettings()
                              }}
                           >
                              Add share split
                           </Button.Button>
                        </div>
                     </div>
                  </React.Fragment>
               )}
            </Dialog.Content>
         </Dialog.Root>
         <div className="grid gap-8">
            <div className="flex items-center gap-4">
               <ArrowLeft size={32} className="hover:scale-110 transition-all cursor-pointer" onClick={() => router.back()} />
               <h1 className="text-1xl font-semibold">Article in review</h1>
            </div>
            <Box className="grid gap-8 h-fit px-4 py-6 md:px-8">
               {loading ? (
                  <Skeleton className="flex items-center gap-2 w-72 py-1 px-3 rounded-md h-7" />
               ) : (
                  <React.Fragment>
                     {is_author ? (
                        <YouAreAuthor />
                     ) : (
                        <React.Fragment>
                           {is_author ? (
                              <YouAreAuthor />
                           ) : (
                              <React.Fragment>
                                 {article?.document.reviewersOnDocuments?.find((item) => item.reviewerEmail === data?.user?.email) ? (
                                    <YouAre
                                       role={
                                          article?.document.reviewersOnDocuments?.find((item) => item.reviewerEmail === data?.user?.email)?.role as
                                             | 'editor'
                                             | 'reviewer'
                                       }
                                    />
                                 ) : null}
                              </React.Fragment>
                           )}
                        </React.Fragment>
                     )}
                  </React.Fragment>
               )}
               <div className="grid gap-x-6 gap-y-4">
                  <div className="grid md:grid-cols-2 items-start gap-6">
                     <Input.Root>
                        <Input.Label className="flex gap-2 items-center">
                           <span className="text-sm font-semibold">Title</span>
                           <span className="text-sm text-neutral-light_gray">{titleLenght}/100 characters</span>
                        </Input.Label>
                        <Input.Input
                           placeholder="Title of the article"
                           {...register('title')}
                           onInput={(e) => {
                              titleLimit({
                                 e: e as React.ChangeEvent<HTMLInputElement>,
                                 limit: 100,
                                 onInput: (value) => {
                                    setValue('title', value.currentTarget.value)
                                    trigger('title')
                                 }
                              })
                           }}
                        />
                        <Input.Error>{errors.title?.message}</Input.Error>
                     </Input.Root>
                     <Input.Root>
                        <Input.Label
                           className="text-sm font-semibold"
                           tooltip_message="Add up to 5 keywords that best describe the content and focus of your document. This helps others discover your work."
                        >
                           Add keywords
                        </Input.Label>
                        <Input.Input
                           placeholder="Type a keyword"
                           value={keywords_temp}
                           onKeyDown={(e) => handleKeyDown(e)}
                           onInput={(e) => setKeywordsTemp(e.currentTarget.value)}
                           end
                           icon={
                              <React.Fragment>
                                 <Button.Button
                                    type="button"
                                    variant="outline"
                                    className="px-2 py-0 border-neutral-light_gray hover:bg-neutral-light_gray hover:bg-opacity-10 flex items-center gap-1 rounded-sm"
                                    onClick={() => {
                                       append({ id: uniqueId('key'), name: keywords_temp as string })
                                       setKeywordsTemp('')
                                    }}
                                 >
                                    <PlusCircle className="w-3 fill-neutral-light_gray" />
                                    <span className="font-semibold text-xs text-neutral-light_gray">Add keyword</span>
                                 </Button.Button>
                              </React.Fragment>
                           }
                        />
                        <Input.Error>{errors.keywords?.message}</Input.Error>
                        <div className="flex flex-wrap gap-1">
                           {keywords.map((keyword, index) => (
                              <div
                                 className="border rounded-md border-neutral-stroke_light flex items-center px-1 sm:px-2 py-[2px] bg-white w-fit"
                                 key={keyword.id}
                              >
                                 <X
                                    className="w-5 fill-neutral-stroke_light hover:fill-status-error cursor-pointer transition-all duration-200 hover:scale-110"
                                    onClick={() => remove(index)}
                                 />
                                 <span className="text-xxs sm:text-xs text-primary-main">{keyword.name}</span>
                              </div>
                           ))}
                        </div>
                     </Input.Root>
                  </div>
                  <div className="grid md:grid-cols-2 items-start gap-6">
                     <Input.Root>
                        <Input.Label className="flex gap-2 items-center">
                           <span className="text-sm  font-semibold">Area of knowledge</span>
                           <span className="text-sm text-neutral-light_gray">{fieldLength}/300 characters</span>
                        </Input.Label>
                        <Input.Input
                           placeholder="Title of the field"
                           {...register('field')}
                           onInput={(e) => {
                              fieldLimit({
                                 e: e as React.ChangeEvent<HTMLInputElement>,
                                 limit: 300,
                                 onInput: (value) => {
                                    setValue('field', value.currentTarget.value)
                                    trigger('field')
                                 }
                              })
                           }}
                        />
                        <Input.Error>{errors.field?.message}</Input.Error>
                     </Input.Root>
                     <Input.Root>
                        <Input.Label className="flex gap-2 items-center">
                           <span className="text-sm  font-semibold">Article type</span>
                        </Input.Label>
                        <SelectArticleType
                           variant="input"
                           placeholder="Select the article type"
                           selected={watch('documentType') as string}
                           items={article_types_submit_article}
                           onValueChange={(value, name) => {
                              setValue('documentType', value), trigger('documentType')
                              setValue('category', name as string), trigger('category')
                           }}
                        />
                     </Input.Root>
                  </div>
               </div>
               <Input.Root>
                  <Input.Label className="flex gap-2 items-center">
                     <span className="text-sm font-semibold">Abstract</span>
                     <span className="text-sm text-neutral-light_gray">{abstractLenght}/1000 characters</span>
                     <span className="text-sm text-neutral-light_gray italic">Optional</span>
                     <Tooltip.Information content="Abstract might change after revision, so don't worry too much." />
                  </Input.Label>
                  <Input.TextArea
                     {...register('abstract')}
                     rows={4}
                     defaultValue={article?.document.abstract}
                     placeholder="Type your abstract"
                     onInput={(e) => {
                        abstractLimit({
                           e: e,
                           limit: 1000,
                           onInput: (value) => {
                              setValue('abstract', value.currentTarget.value)
                              trigger('abstract')
                           }
                        })
                     }}
                  />
                  <Input.Error>{errors.abstract?.message}</Input.Error>
               </Input.Root>
               <div className="grid gap-4">
                  <p className="text-sm font-semibold">Cover</p>
                  <Dropzone
                     thumbnail
                     accept="images"
                     placeholder="Upload cover picture (.png, .jpg)"
                     setSelectedFile={(file) => {
                        setValue('cover', file as StoredFile)
                        trigger('cover')
                     }}
                     defaultCover={{
                        lastModified: getValues('cover')?.lastModified || 0,
                        lastModifiedDate: getValues('cover')?.lastModifiedDate || new Date(),
                        name: getValues('cover')?.name || '',
                        path: getValues('cover')?.path || '',
                        preview: getValues('cover')?.preview || '',
                        size: getValues('cover')?.size || 0,
                        type: getValues('cover')?.type || ''
                     }}
                  />
               </div>
            </Box>
            <Box className="grid gap-8 h-fit px-4 py-6 md:px-8">
               <div className="grid gap-6">
                  <h3 className="text-lg md:text-xl text-primary-main font-semibold">Document file</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                     <Dropzone
                        thumbnail={false}
                        setSelectedFile={(file) => setFile(file)}
                        placeholder="Upload a new document version (.docx, .pdf)"
                        accept="documents"
                     />
                     <ScrollArea className="h-[200px] pr-2">
                        <div className="grid gap-4">
                           {article?.document?.documentVersions && article?.document?.documentVersions?.length > 0 ? (
                              article?.document?.documentVersions?.map((file) => (
                                 <File
                                    key={file.id}
                                    file_name={file.fileName || 'file.docx'}
                                    onDownload={() => {
                                       handleDownloadDocument(file.id, file.fileName!)
                                    }}
                                    uploaded_at={new Date(file.createdAt)?.toLocaleDateString('pt-BR')}
                                    uploaded_by={data?.user?.userInfo.name || ''}
                                 />
                              ))
                           ) : (
                              <p className="text-center col-span-2 text-gray-500 mt-8">There are no files inserted into this document.</p>
                           )}
                        </div>
                     </ScrollArea>
                  </div>
               </div>
            </Box>
            <Box className="grid gap-6 h-fit px-4 py-6 md:px-8">
               <h3 className="text-xl text-primary-main font-semibold lg:text-lg 2xl:text-xl">Document links</h3>
               <div className="grid md:grid-cols-2 items-start gap-6">
                  <Input.Root>
                     <Input.Label className="flex gap-2 items-center">
                        <span className="text-sm font-semibold">NFT hash</span>
                     </Input.Label>
                     {article?.document.nftHash !== null && article?.document.nftHash !== undefined ? (
                        <div
                           className="truncate hover:underline hover:text-blue-600 cursor-copy"
                           onClick={() => {
                              if (article.document.nftHash) {
                                 handleCopy(article?.document.nftHash)
                                 toast.success('NFT hash copied to clipboard!')
                              }
                           }}
                        >
                           {article?.document.nftHash}
                        </div>
                     ) : (
                        <p className="text-base text-neutral-gray">The NFT hash is not available yet.</p>
                     )}
                  </Input.Root>
                  <Input.Root>
                     <Input.Label className="flex gap-2 items-center">
                        <span className="text-sm font-semibold">NFT link</span>
                     </Input.Label>
                     {article?.document.nftLink !== null && article?.document.nftLink !== undefined ? (
                        <Link href={article?.document.nftLink} target="_blank" rel="noreferrer" className="truncate hover:underline hover:text-blue-600">
                           {article?.document.nftLink}
                        </Link>
                     ) : (
                        <p className="text-base text-neutral-gray">The NFT link is not available yet.</p>
                     )}
                  </Input.Root>
               </div>
            </Box>
            <Box className="grid gap-6 h-fit px-4 py-6 md:px-8">
               <div className="grid gap-2">
                  <h3 className="text-lg md:text-xl text-primary-main font-semibold">Comments</h3>
                  <p className="text-sm">The reviewing team may write comments and suggest editions on your document here.</p>
               </div>
               <div className="grid gap-6">
                  <div className="border rounded-md p-4">
                     <ScrollArea className={twMerge('h-[342px]', `${state.comments && state.comments.length == 0 && 'h-full'}`)}>
                        <div className="grid gap-4 h-full">
                           {state.comments && state.comments.length > 0 ? (
                              state.comments?.map((comment) => (
                                 <React.Fragment key={comment.id}>
                                    <CommentItem
                                       comment_author={comment.comment_author}
                                       comment_content={comment.comment_content}
                                       status={comment.status as 'PENDING' | 'APPROVED' | 'REJECTED'}
                                       onApprove={() => {
                                          handleApproveDocument('APPROVED', comment.id as string)
                                          dispatch({
                                             type: 'approve_comment',
                                             payload: {
                                                id: comment.id,
                                                comment_content: comment.comment_content,
                                                comment_author: comment.comment_author,
                                                status: 'APPROVED'
                                             }
                                          } as ActionComments)
                                       }}
                                       onReject={() => {
                                          dispatch({
                                             type: 'comment_to_edit',
                                             payload: {
                                                id: comment.id,
                                                comment_author: comment.comment_author,
                                                comment_content: comment.comment_content,
                                                reason: comment.reason,
                                                status: 'PENDING'
                                             }
                                          } as ActionComments)
                                          setDialog({
                                             ...dialog,
                                             reasoning: true
                                          })
                                       }}
                                       user_id={comment.user_id}
                                       onSeeReasoning={() => {
                                          dispatch({
                                             type: 'comment_to_edit',
                                             payload: {
                                                id: comment.id,
                                                comment_author: comment.comment_author,
                                                comment_content: comment.comment_content,
                                                reason: comment.reason,
                                                status: 'REJECTED'
                                             }
                                          } as ActionComments)
                                          setDialog({ ...dialog, reasoning: true })
                                       }}
                                    />
                                    <hr className="divider-h mt-1" />
                                 </React.Fragment>
                              ))
                           ) : (
                              <p className="text-center flex justify-center h-full row-span-2 col-span-2 text-gray-500 items-center">
                                 There are no comments on this document.
                              </p>
                           )}
                        </div>
                     </ScrollArea>
                  </div>
                  {/* <div className="flex items-center gap-4">
                     <div className="flex-grow">
                        <Input.Root>
                           <Input.Input
                              className="border p-2 rounded-md focus:border-primary-main"
                              placeholder="Type your comment"
                              {...register_comment('comment')}
                           />
                        </Input.Root>
                     </div>
                     <Button.Button className="px-4 py-2 h-[43px]" onClick={handleAddComment} loading={buttonLoading.comment}>
                        Add comments
                     </Button.Button>
                  </div> */}
               </div>
            </Box>
            <Box className="grid gap-8 h-fit px-4 py-6 md:px-8">
               <div className="grid gap-2">
                  <div className="grid ">
                     <h3 className="text-lg md:text-xl text-terciary-main font-semibold">Authors</h3>
                  </div>
                  <Button.Button
                     type="button"
                     variant="outline"
                     className="px-4 py-3 w-full text-sm"
                     onClick={() => setDialog({ ...dialog, author: true })}
                  >
                     Add authors for this paper
                     <PlusCircle className="w-4 fill-primary-main" />
                  </Button.Button>
                  <div className="grid gap-6">
                     <p className="text-sm">Drag to reorder.</p>
                     <div className="grid gap-2">
                        <div className="hidden md:grid grid-cols-3">
                           {authors_headers.map((header, index) => (
                              <React.Fragment key={index}>
                                 <p className="text-sm font-semibold">{header.label}</p>
                              </React.Fragment>
                           ))}
                        </div>
                        <AuthorsListDragabble
                           article={null}
                           authors={authors}
                           onReorder={onReorder}
                           onDelete={(item) => {
                              const new_list = authors.filter((author) => author.id !== item.id)
                              setAuthors(new_list)
                              setValue('authors', new_list)
                              const authorToRemove = authors.find((author) => author.id === item.id)
                              if (!authorToRemove?.id.includes('author') && authorToRemove) {
                                 setRemoveAuthors((prev) => [...prev, authorToRemove.id])
                              }
                           }}
                           onEdit={(item) => {
                              setAuthorToEdit(item)
                              setDialog({ ...dialog, edit_author: true })
                           }}
                        />
                     </div>
                  </div>
               </div>
            </Box>
            <Box className="grid gap-8 h-fit px-4 py-6 md:px-8">
               <div className="grid gap-4">
                  <div className="grid gap-2">
                     <h3 className="text-lg md:text-xl text-primary-main font-semibold">Editors / Reviewers</h3>
                     <p className="text-sm">
                        At least 1 editor and 1 reviewers’ approval are required to publish the paper. The editors and reviewers cannot be authors in the
                        project. Invite them to the platform through the link:
                     </p>
                  </div>
                  <InviteLink
                     article={article}
                     onClick={() => {
                        setPopover({ ...popover, copy_link: true })
                        setTimeout(() => {
                           setPopover({ ...popover, copy_link: false })
                        }, 2000)
                     }}
                     open_status={popover.copy_link}
                  />
               </div>
               <div>
                  <div className="hidden md:grid grid-cols-5">
                     {header_editor_reviewer.map((header, index) => (
                        <React.Fragment key={index}>
                           <p className="text-sm font-semibold">{header.label}</p>
                        </React.Fragment>
                     ))}
                  </div>
                  <EditorReviewList article={article} />
               </div>
            </Box>
            <Box className="grid gap-8 h-fit px-4 py-6 md:px-8">
               <div className="grid gap-2">
                  <h3 className="text-lg md:text-xl text-status-green font-semibold">Authorship</h3>
                  <p className="text-sm">
                     Decide if the project is <span className="text-[#53AA22] font-semibold">Open Access</span> or{' '}
                     <span className="text-[#AE66E6] font-semibold">Paid Access</span>
                  </p>
               </div>
               <div className="grid md:grid-cols-2 items-start gap-6">
                  <Input.Root>
                     <Input.Select
                        label={'Type of access'}
                        placeholder="Select the type of access"
                        onValueChange={(value) => setAccessType(value)}
                        value={access_type}
                        options={access_type_options}
                     />
                  </Input.Root>
                  {access_type == 'open-access' && (
                     <Input.Root>
                        <Input.Label className="text-neutral-gray text-sm font-semibold pl-2">Price</Input.Label>
                        <Input.Input disabled placeholder="R$" />
                     </Input.Root>
                  )}
                  {access_type == 'paid-access' && (
                     <React.Fragment>
                        <Input.Root>
                           <Input.Label>Price</Input.Label>
                           <CurrencyInput
                              currency="USD"
                              defaultValue={article?.document.price}
                              onChangeValue={(event, originalValue, maskedValue) => {
                                 setValue('price', originalValue.toString())
                                 trigger('price')
                              }}
                              InputElement={<Input.Input placeholder="USD" />}
                           />
                        </Input.Root>
                     </React.Fragment>
                  )}
               </div>
               {access_type == 'paid-access' && (
                  <React.Fragment>
                     <div className="grid gap-2">
                        <p className="text-sm font-semibold">Authorship settings</p>
                        <p className="text-sm font-regular">The total added up authorship value must be 100%</p>
                     </div>
                     <div className="grid gap-2">
                        <div className="grid grid-cols-3">
                           {authorship_headers.map((header, index) => (
                              <React.Fragment key={index}>
                                 <p className="text-sm font-semibold">{header.label}</p>
                              </React.Fragment>
                           ))}
                        </div>
                        <div>
                           <div>
                              {authors.map((author, index) => (
                                 <React.Fragment key={index}>
                                    <div className="grid grid-cols-3 items-center py-3">
                                       <div>
                                          <p className="text-sm text-secundary_blue-main">{author.name}</p>
                                       </div>
                                       <div>
                                          {author.share ? (
                                             <div className="flex gap-2 px-4 py-1 border rounded-md border-terciary-main w-fit">
                                                <p className="text-sm text-center text-terciary-main w-8">
                                                   {author.share.includes('%') ? author.share : author.share + '%'}
                                                </p>
                                                <p className="text-sm text-terciary-main">Authorship</p>
                                             </div>
                                          ) : (
                                             <Button.Button
                                                variant="outline"
                                                className="px-4 py-2 w-fit text-sm"
                                                onClick={() => {
                                                   setDialog({ ...dialog, share_split: true })
                                                   console.log(author)
                                                   setAuthorshipSettings(author)
                                                   setEditShare(author)
                                                }}
                                             >
                                                Add authorship settings
                                                <PlusCircleDotted size={18} className="fill-primary-main" />
                                             </Button.Button>
                                          )}
                                       </div>
                                       <div className="w-full flex items-center justify-between">
                                          <p className="text-base text-center text-black w-8">{author.wallet || '-'}</p>
                                          <div className="flex items-center gap-2">
                                             <Trash
                                                size={20}
                                                className=" fill-status-error hover:scale-110 transition-all duration-200 cursor-pointer"
                                                onClick={() => {
                                                   const author_whitout_share = authors.filter((item) => item.id !== author.id)
                                                   const author_updated: Author = {
                                                      id: author.id,
                                                      email: author.email,
                                                      name: author.name,
                                                      title: author.title,
                                                      share: '0',
                                                      wallet: author.wallet || ''
                                                   }

                                                   setAuthors((prevItems) => [...author_whitout_share, author_updated])
                                                   if (!author.id.includes('author')) {
                                                      const author_updated: UpdateAuthor = {
                                                         id: author.id,
                                                         email: author.email,
                                                         name: author.name,
                                                         title: author.title,
                                                         revenuePercent: 0,
                                                         walletAddress: author.wallet || ''
                                                      }
                                                      const authorIndex = updateAuthors.findIndex((item) => item.id === author_updated.id)
                                                      if (authorIndex >= 0) {
                                                         updateAuthors[authorIndex].revenuePercent = 0
                                                         setUpdateAuthors(updateAuthors)
                                                      } else {
                                                         setUpdateAuthors((prevItems) => [...prevItems, author_updated])
                                                      }
                                                   }
                                                }}
                                             />
                                             <Pencil
                                                size={20}
                                                className=" fill-primary-main hover:scale-110 transition-all duration-200 cursor-pointer"
                                                onClick={() => {
                                                   setEditShare(author)
                                                   setAuthorshipSettings(author)
                                                   setDialog({ ...dialog, share_split: true })
                                                }}
                                             />
                                          </div>
                                       </div>
                                    </div>
                                    <hr className="divider-h" />
                                 </React.Fragment>
                              ))}
                              <div className="grid md:grid-flow-col justify-start gap-4 md:grid-cols-3 mt-4">
                                 <p className="text-sm font-regular">Total authorship</p>
                                 {authors.length > 0 && (
                                    <React.Fragment>
                                       {(() => {
                                          const totalShare = authors.reduce((acc, author) => {
                                             return acc + (author.share ? parseFloat(author.share.replace('%', '')) : 0)
                                          }, 0)

                                          return (
                                             <div className="col-span-2 grid gap-1">
                                                <p className="text-sm font-regular">{totalShare}%</p>
                                                {totalShare < 100 && (
                                                   <p className="text-sm text-status-error">The total ownership cannot be less than 100%!</p>
                                                )}
                                             </div>
                                          )
                                       })()}
                                    </React.Fragment>
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>
                  </React.Fragment>
               )}
            </Box>
            <Box className="grid gap-4 h-fit px-4 py-6 md:px-8">
               <h3 className="text-lg font-semibold">Document status:</h3>
               <p className="text-md">
                  The current status of this document reflects the collective input and consensus from our panel of expert reviewers and editors.
               </p>
               <DocumentApprovals editorApprovals={editorApprovals} reviewerApprovals={reviewerApprovals} />
               {['PENDING', 'APPROVED'].includes(article?.document.status!) && (
                  <React.Fragment>
                     <Button.Button variant="primary" className="flex items-center" onClick={handleSubmitDocument} loading={submitLoading}>
                        <FileEarmarkText className="w-5 h-5" />
                        Resubmit for review
                     </Button.Button>
                     <Button.Button variant="outline" className="flex items-center" onClick={handleSaveDocument} loading={saveLoading}>
                        Save
                     </Button.Button>
                  </React.Fragment>
               )}
               {article?.document.status === 'ADMIN_APPROVE' && (
                  <Button.Button
                     variant="disabled"
                     className="flex items-center bg-status-disable_bg text-status-disable_text"
                     onClick={handleSubmitDocument}
                     loading={submitLoading}
                  >
                     <FileEarmarkText className="w-5 h-5" />
                     Waiting admin approval
                  </Button.Button>
               )}

               {article?.document.status === 'SUBMITTED' && (
                  <Button.Button
                     variant="disabled"
                     className="flex items-center bg-status-disable_bg text-status-disable_text"
                     onClick={handleSubmitDocument}
                     loading={submitLoading}
                  >
                     <FileEarmarkText className="w-5 h-5" />
                     Document was submitted
                  </Button.Button>
               )}

               {article?.document.status === 'REJECTED' && (
                  <Button.Button
                     variant="disabled"
                     className="flex items-center bg-status-disable_bg text-status-disable_text"
                     onClick={handleSubmitDocument}
                     loading={submitLoading}
                  >
                     <FileEarmarkText className="w-5 h-5" />
                     Document was rejected
                  </Button.Button>
               )}

               {documentSaved && <p className="text-base text-center text-status-green select-none"> Changes saved successfully! </p>}
            </Box>
         </div>
      </React.Fragment>
   )
}

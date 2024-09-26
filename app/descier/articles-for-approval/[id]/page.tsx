'use client'

import * as Button from '@components/common/Button/Button'
import * as Dialog from '@components/common/Dialog/Digalog'
import * as Input from '@components/common/Input/Input'
import * as Tooltip from '@components/common/Tooltip/Tooltip'

import { StoredFile } from '@/components/common/Dropzone/Typing'
import { EditorsAndReviewers } from '@/components/common/EditorsAndReviwers/EditorAndReviwer'
import { File } from '@/components/common/File/File'
import { AuthorsListDragabble } from '@/components/common/Lists/Authors/Authors'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useGetApprovals } from '@/hooks/useGetApprovals'
import { useLimitCharacters } from '@/hooks/useLimitCharacters'
import { cn } from '@/lib/utils'
import { header_editor_reviewer } from '@/mock/article_under_review'
import { article_types_submit_article } from '@/mock/articles_types'
import { authors_headers, authors_mock, authorship_headers } from '@/mock/submit_new_document'
import { home_routes } from '@/routes/home'
import { approveByAdminService } from '@/services/admin/approve.service'
import { useFetchAdminArticles } from '@/services/admin/fetchDocuments.service'
import { downloadDocumentVersionService } from '@/services/document/download.service'
import { DocumentComment, DocumentGetProps } from '@/services/document/getArticles'
import { updateDocumentService } from '@/services/document/update.service'
import { uploadDocumentFileService } from '@/services/file/file.service'
import { formatFileName } from '@/utils/format_file_name'
import { zodResolver } from '@hookform/resolvers/zod'
import { uniqueId } from 'lodash'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, PlusCircle, X } from 'react-bootstrap-icons'
import { CurrencyInput } from 'react-currency-mask'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { twMerge } from 'tailwind-merge'

import Box from '@/components/common/Box/Box'
import CommentItem from '@/components/common/Comment/Comment'
import DocumentApprovals from '@/components/common/DocumentApprovals/DocumentApprovals'
import Dropzone from '@/components/common/Dropzone/Dropzone'
import Reasoning from '@/components/modules/deScier/Article/Reasoning'
import { Skeleton } from '@/components/ui/skeleton'
import { CreateDocumentProps, CreateDocumentSchema } from '@/schemas/create_document'
import React from 'react'
import slug from 'slug'

export default function ArticleForApprovalPage({ params }: { params: { id: string } }) {
   const router = useRouter()

   const { data: session } = useSession()
   const { fetch_article } = useFetchAdminArticles()

   const [article, setArticle] = React.useState<DocumentGetProps | null>(null)
   const [items, setItems] = React.useState(authors_mock)
   const [access_type, setAccessType] = React.useState('open-access')
   const [dialog, setDialog] = React.useState({ author: false, share_split: false, edit_author: false, reasoning: false })
   const [loading, setLoading] = React.useState({ approve: false, reject: false })
   const [nftData, setNftData] = React.useState({ nftLink: '', nftHash: '' })
   const [updateNftDataLoading, setUpdateNftLoading] = React.useState<boolean>(false)
   const [uploadFileLoading, setUploadFileLoading] = React.useState<boolean>(false)
   const [file, setFile] = React.useState<StoredFile>()

   const { editorApprovals, getApprovals, reviewerApprovals } = useGetApprovals()

   const onReorder = (newOrder: typeof items) => setItems((prevItems) => [...newOrder])

   const {
      register,
      handleSubmit,
      watch,
      formState: { errors, isDirty },
      setValue,
      trigger,
      getValues,
      control,
      setError,
      clearErrors,
      unregister,
      reset,
      resetField
   } = useForm<CreateDocumentProps>({
      resolver: zodResolver(CreateDocumentSchema),
      defaultValues: {
         abstract: '',
         abstractChart: '',
         accessType: 'FREE',
         documentType: '',
         field: '',
         price: '',
         journalId: '',
         title: '',
         file: {
            lastModified: 0,
            lastModifiedDate: new Date(),
            name: '',
            path: '',
            preview: '',
            size: 0,
            type: ''
         },
         cover: {
            lastModified: 0,
            lastModifiedDate: new Date(),
            name: '',
            path: '',
            preview: '',
            size: 0,
            type: ''
         },
         category: '',
         authors: [],
         keywords: []
      }
   })
   console.log('watch', watch())

   const { append, remove, fields: keywords } = useFieldArray({ name: 'keywords', control: control })

   const fetchSingleArticle = async (documentId: string) => {
      await fetch_article(documentId).then((res) => {
         setArticle(res as DocumentGetProps)
         setNftData({
            nftHash: res?.document.nftHash || '',
            nftLink: res?.document.nftLink || ''
         })
         const access = res?.document.accessType === 'FREE' ? 'open-access' : 'paid-access'
         setAccessType(access)
         getApprovals(res?.document.reviewersOnDocuments || [])

         setValue('title', res?.document.title || '')
         setValue('abstract', res?.document.abstract || '')
         setValue('field', res?.document.field || '')
         setValue('documentType', res?.document.documentType || '')
         setDocumentType(res?.document.documentType || '')
         setValue('accessType', (res?.document.accessType || 'FREE') as 'PAID' | 'FREE')
         setValue('price', res?.document.price?.toString() || '')
         setValue('journalId', res?.document.id || '')
         setValue('category', res?.document.category || '')
         setValue('cover', {
            lastModified: 0,
            lastModifiedDate: new Date(),
            name: res?.document.cover || '',
            path: res?.document.cover || '',
            preview: res?.document.cover || '',
            size: 0,
            type: ''
         })
         setValue('file', {
            lastModified: 0,
            lastModifiedDate: new Date(),
            name: res?.document.documentVersions?.[0]?.fileName || '',
            path: '',
            preview: '',
            size: 0,
            type: ''
         })

         const keywordsArray =
            res?.document.keywords?.split(';').map((keyword) => ({
               id: uniqueId('key'),
               name: keyword.trim()
            })) || []
         setValue('keywords', keywordsArray)

         const authorsArray =
            res?.document.authorsOnDocuments?.map((author) => ({
               id: author.id,
               name: author.author?.name || '',
               email: author.author?.email || '',
               title: author.author?.title || '',
               revenuePercent: author.revenuePercent?.toString() || '0',
               walletAddress: author.author?.walletAddress || ''
            })) || []
         setValue('authors', authorsArray)

         trigger()
      })
   }

   const handleApproveDocument = async (approve: boolean) => {
      setLoading({ ...loading, approve: true })
      const response = await approveByAdminService({
         documentId: article?.document.id!,
         approve: approve
      })

      setLoading({ ...loading, approve: false })

      if (!response.success) {
         toast.error(response.message)
         return
      }

      const status = approve ? 'approved' : 'rejected'
      toast.success(`Document ${status} successfully!`)

      router.push(home_routes.descier.index)
   }

   const handleUpdateNftData = async () => {
      setUpdateNftLoading(true)
      const response = await updateDocumentService({
         documentId: params.id,
         document: {
            ...nftData
         }
      })

      setUpdateNftLoading(false)

      if (!response.success) {
         toast.error(response.message)
         return
      }

      toast.success('Document updated successfully.')
   }

   const handleUpdateArticleFile = async () => {
      setUploadFileLoading(true)
      if (!file) return
      const uploadDocumentSuccess = await uploadDocumentFileService({
         documentId: params.id,
         fileLocalUrl: file.preview,
         filename: file.name,
         mimetype: file.type
      })
      setUploadFileLoading(false)

      if (!uploadDocumentSuccess) {
         toast.error('There was an error uploading your file.')
         return
      }

      fetchSingleArticle(params.id)
      toast.success('File uploaded successfully!')
   }

   const handleDownloadDocument = async (fileId: string, filename: string) => {
      const response = await downloadDocumentVersionService({
         documentId: article?.document.id!,
         fileId,
         userId: session?.user?.userInfo.id!
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
      if (params.id !== undefined) {
         fetchSingleArticle(params.id)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [params.id, session?.user?.userInfo?.id])

   const { characterLimit: fieldLimit, length: fieldLength } = useLimitCharacters(watch('field') || '')
   const { characterLimit: titleLimit, length: titleLenght } = useLimitCharacters(watch('title') || '')
   const { characterLimit: abstractLimit, length: abstractLenght } = useLimitCharacters(watch('abstract') || '')

   const [keywords_temp, setKeywordsTemp] = React.useState<string | undefined>()

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

   const [documentType, setDocumentType] = React.useState<string | null>(null)
   console.log('documentType', documentType)

   return (
      <React.Fragment>
         <Dialog.Root open={dialog.reasoning}>
            <Dialog.Content className="py-14 px-16 max-w-[600px]">
               <Reasoning
                  message={''}
                  documentAuthor={article?.document.user?.name!}
                  onClose={() => setDialog({ ...dialog, reasoning: false })}
                  onConfirm={(value) => {
                     setDialog({ ...dialog, reasoning: false })
                     handleApproveDocument(false)
                  }}
               />
            </Dialog.Content>
         </Dialog.Root>
         <div className="grid gap-8">
            <div className="flex items-center gap-4">
               <ArrowLeft size={32} className="hover:scale-110 transition-all cursor-pointer" onClick={() => router.back()} />
               <h1 className="text-1xl font-semibold">Article in review</h1>
            </div>
            <Box className="grid gap-8 h-fit py-6 px-8">
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
                        <Select
                           value={documentType || undefined}
                           onValueChange={(value) => {
                              setDocumentType(value)

                              const findLabelItem = article_types_submit_article.find((item) => item.type === 'label' && item.related?.includes(value))

                              if (findLabelItem) {
                                 const labelName = findLabelItem.label
                                 setValue('category', slug(labelName, { lower: true, replacement: '-' }))
                                 trigger('category')
                              }

                              setValue('documentType', value)
                              trigger('documentType')
                           }}
                        >
                           <SelectTrigger
                              className={cn(
                                 'justify-between border disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 dark:placeholder:text-slate-400 outline-none false flex items-center rounded-none border-b-[1px] border-neutral-light_gray p-2 pt-0 placeholder:text-gray-light placeholder:text-base focus:outline-none w-full placeholder-shown:text-neutral-black bg-transparent focus:border-b-primary-main border-t-0 border-l-0 border-r-0 h-[34px] text-base text-neutral-light_gray',
                                 {
                                    'text-black': documentType
                                 }
                              )}
                           >
                              <SelectValue asChild placeholder="Select the article type">
                                 <span>{article_types_submit_article.find((item) => item.value === documentType)?.label || null}</span>
                              </SelectValue>
                           </SelectTrigger>
                           <SelectContent>
                              <React.Fragment>
                                 {article_types_submit_article.map((item, index) => (
                                    <React.Fragment key={item.id}>
                                       {item.type === 'label' && (
                                          <React.Fragment>
                                             <p className="px-8 py-1.5 pl-8 pr-2 text-sm font-semibold pt-2">{item.label}</p>
                                             <Separator />
                                          </React.Fragment>
                                       )}
                                       {item.type === 'item' && (
                                          <SelectItem
                                             value={item.value as string}
                                             className="px-8 text-sm font-semibold text-primary-main hover:text-primary-hover cursor-pointer"
                                             onMouseUp={() => setDocumentType(item.value)}
                                          >
                                             {item.label}
                                          </SelectItem>
                                       )}
                                    </React.Fragment>
                                 ))}
                              </React.Fragment>
                           </SelectContent>
                        </Select>
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
                  {/* <Dropzone
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
                  /> */}
                  <div className="grid gap-4 min-h-[140px]">
                     {article?.document?.cover ? (
                        <React.Fragment>
                           {/* eslint-disable-next-line @next/next/no-img-element */}
                           <img src={article?.document.cover} alt="cover" className="w-full h-44 object-cover rounded-md brightness-50" loading="lazy" />
                        </React.Fragment>
                     ) : (
                        <Skeleton className="w-full h-44 rounded-md" />
                     )}
                  </div>
               </div>
            </Box>
            <Box className="grid gap-8 h-fit py-6 px-8">
               <div className="grid gap-6">
                  <h3 className="text-xl text-primary-main font-semibold lg:text-lg 2xl:text-xl">Document file</h3>
                  <div>
                     <ScrollArea className="h-[200px] w-full pr-2">
                        <div className="grid gap-4">
                           {article?.document.documentVersions && article.document.documentVersions.length > 0 ? (
                              article?.document.documentVersions?.map((file) => (
                                 <File
                                    key={file.id}
                                    file_name={formatFileName(file.fileName as string) || 'file.docx'}
                                    onDownload={() => {
                                       handleDownloadDocument(file.id, file.fileName!)
                                    }}
                                    uploaded_at={new Date(file.createdAt).toLocaleDateString('pt-BR')}
                                    uploaded_by={article.document.user?.name || ''}
                                 />
                              ))
                           ) : (
                              <p className="text-center col-span-2 text-gray-500 mt-8">There are no files inserted into this document.</p>
                           )}
                        </div>
                     </ScrollArea>
                  </div>
                  <Dropzone
                     accept="documents"
                     placeholder="Update document file (.pdf)"
                     thumbnail={false}
                     setSelectedFile={(file) => {
                        setFile(file as StoredFile)
                     }}
                  />
                  <Button.Button variant="primary" className="flex items-center" onClick={handleUpdateArticleFile} loading={uploadFileLoading}>
                     Update file
                  </Button.Button>
               </div>
            </Box>
            <Box className="grid gap-8 h-fit py-6 px-8">
               <h3 className="text-xl text-primary-main font-semibold lg:text-lg 2xl:text-xl">Document links</h3>
               <div className="grid md:grid-cols-2 items-start gap-6">
                  <Input.Root>
                     <Input.Label className="flex gap-2 items-center">
                        <span className="text-sm font-semibold">NFT hash</span>
                     </Input.Label>
                     <Input.Input
                        placeholder="Ex: 0x495f9472767...0045cb7b5e"
                        value={nftData.nftHash}
                        onChange={(e) => setNftData({ ...nftData, nftHash: e.target.value })}
                     />
                  </Input.Root>
                  <Input.Root>
                     <Input.Label className="flex gap-2 items-center">
                        <span className="text-sm font-semibold">NFT link</span>
                     </Input.Label>
                     <Input.Input
                        placeholder="Ex: https://opensea.io/assets/ethereum/0x495..."
                        value={nftData.nftLink}
                        onChange={(e) => setNftData({ ...nftData, nftLink: e.target.value })}
                     />
                  </Input.Root>
               </div>
               <Button.Button variant="primary" className="flex items-center" onClick={handleUpdateNftData} loading={updateNftDataLoading}>
                  Save
               </Button.Button>
            </Box>
            <Box className="grid gap-4 md:gap-8 h-fit py-6 px-8">
               <div className="grid gap-2">
                  <h3 className="text-xl text-primary-main font-semibold lg:text-lg 2xl:text-xl">Comments</h3>
                  <p className="text-sm">The reviewing team can publish comments, suggesting updates on your document.</p>
               </div>
               <div className="border rounded-md p-4">
                  <ScrollArea
                     className={twMerge(
                        'h-[342px]',
                        `${article?.document.documentComments && article?.document?.documentComments?.length == 0 && 'h-full'}`
                     )}
                  >
                     <div className="grid gap-4">
                        {article?.document.documentComments && article?.document?.documentComments?.length > 0 ? (
                           article?.document.documentComments?.map((comment: DocumentComment) => (
                              <React.Fragment key={comment.id}>
                                 <CommentItem
                                    comment_author={comment.user.name}
                                    comment_content={comment.comment}
                                    status={comment.approvedByAuthor as 'APPROVED' | 'REJECTED' | 'PENDING'}
                                    user_id={comment.userId}
                                 />
                              </React.Fragment>
                           ))
                        ) : (
                           <p className="text-sm md:text-base text-center col-span-2 text-gray-500">There are no comments inserted into this document.</p>
                        )}
                     </div>
                  </ScrollArea>
               </div>
            </Box>
            <Box className="grid gap-8 h-fit py-6 px-8">
               <div className="grid gap-6">
                  <div className="grid gap-2">
                     <h3 className="text-xl text-terciary-main font-semibold lg:text-lg 2xl:text-xl">Authors</h3>
                     <p className="text-sm">Drag to reorder.</p>
                  </div>
                  <div className="grid gap-2">
                     <div className="hidden md:grid md:grid-cols-3">
                        {authors_headers.map((header, index) => (
                           <React.Fragment key={index}>
                              <p className="text-sm font-semibold">{header.label}</p>
                           </React.Fragment>
                        ))}
                     </div>
                     <AuthorsListDragabble is_admin authors={[]} article={article} onReorder={onReorder} />
                  </div>
               </div>
            </Box>
            <Box className="grid gap-2 md:gap-8 h-fit py-6 px-8">
               <div className="grid gap-4">
                  <div className="grid gap-2">
                     <h3 className="text-lg md:text-xl text-primary-main font-semibold">Editors / Reviewers</h3>
                     <p className="text-sm">
                        At least 1 editor and 1 reviewers’ approval are required to publish the paper. The editors and reviewers cannot be authors in the
                        project. Invite them to the platform through the link:
                     </p>
                  </div>
               </div>
               <div>
                  <div className="hidden md:grid md:grid-cols-5">
                     {header_editor_reviewer.map((header, index) => (
                        <React.Fragment key={index}>
                           <p className="text-sm font-semibold">{header.label}</p>
                        </React.Fragment>
                     ))}
                  </div>
                  <EditorsAndReviewers article={article} />
               </div>
            </Box>
            <Box className="grid gap-8 h-fit py-6 px-8">
               <div className="grid gap-2">
                  <h3 className="text-lg md:text-xl text-status-green font-semibold">Authorship</h3>
                  <p className="text-sm">
                     Decide if the project is <span className="text-terciary-main font-semibold">Open Access</span>,{' '}
                     <span className="text-[#EFB521] font-semibold">Paid Access</span>
                  </p>
               </div>
               <div className="grid md:grid-cols-2 items-start gap-6">
                  <Input.Root>
                     <Input.Label>Type of access</Input.Label>
                     <Input.Input disabled defaultValue={access_type === 'open-access' ? 'Open access' : 'Paid access'} />
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
                              onChangeValue={(event, originalValue, maskedValue) => console.log(event, originalValue, maskedValue)}
                              InputElement={<Input.Input placeholder="USD" disabled />}
                           />
                        </Input.Root>
                     </React.Fragment>
                  )}
               </div>
               {access_type == 'paid-access' && (
                  <React.Fragment>
                     <div className="grid md:gap-2">
                        <p className="text-sm font-semibold">Authorship settings</p>
                        <p className="text-sm font-regular">The total added up authorship value must be 100%</p>
                     </div>
                     <div className="md:grid md:gap-2">
                        <div className="hidden md:grid md:grid-cols-3">
                           {authorship_headers.map((header, index) => (
                              <React.Fragment key={index}>
                                 <p className="text-sm font-semibold">{header.label}</p>
                              </React.Fragment>
                           ))}
                        </div>
                        <div>
                           <div>
                              {article?.document.authorsOnDocuments?.map((author, index) => (
                                 <React.Fragment key={index}>
                                    <div className="grid grid-cols-3 items-center py-3">
                                       <div>
                                          <p className="text-sm text-secundary_blue-main">{author.author?.name}</p>
                                       </div>
                                       <div>
                                          {author.revenuePercent && (
                                             <div className="flex gap-2 px-4 py-1 border rounded-md border-terciary-main w-fit">
                                                <p className="text-sm text-center text-terciary-main w-8">{author.revenuePercent}%</p>
                                                <p className="text-sm text-terciary-main">Authorship</p>
                                             </div>
                                          )}
                                       </div>
                                       <div className="w-fit">
                                          <p className="text-sm text-center text-black w-8">{author.author?.walletAddress || '-'}</p>
                                       </div>
                                    </div>
                                    <hr className="divider-h" />
                                 </React.Fragment>
                              ))}
                           </div>
                        </div>
                     </div>
                  </React.Fragment>
               )}
            </Box>
            <Box className="grid gap-4 h-fit py-6 px-8">
               {article?.document.adminApproval === 0 && (
                  <h3 className="text-lg font-semibold text-status-pending flex justify-center">Your approval is still pending</h3>
               )}

               <DocumentApprovals editorApprovals={editorApprovals} reviewerApprovals={reviewerApprovals} />
               {article?.document.status !== 'SUBMITTED' && (
                  <>
                     <Button.Button variant="primary" className="flex items-center" onClick={() => handleApproveDocument(true)} loading={loading.approve}>
                        <Check className="w-5 h-5" />
                        Approve article
                     </Button.Button>
                     <Button.Button
                        variant="outline"
                        className="flex items-center"
                        onClick={() => setDialog({ ...dialog, reasoning: true })}
                        loading={loading.reject}
                     >
                        Reject article
                     </Button.Button>
                  </>
               )}
               {article?.document.status === 'REJECTED' && (
                  <p className="text-lg text-center text-status-error font-semibold select-none">Article rejected</p>
               )}
               {article?.document.status === 'APPROVED' && (
                  <p className="text-lg text-center text-status-green font-semibold select-none">Article approved</p>
               )}
            </Box>
         </div>
      </React.Fragment>
   )
}

const ArticleStatus: React.FC<{ status: string }> = ({ status }: { status: string }) => {
   return (
      <React.Fragment>
         <div className="flex items-center gap-2 border border-neutral-stroke_light w-fit py-1 px-4 rounded-md">
            {status === 'ADMIN_APPROVE' && <p className="text-sm text-status-pending font-semibold select-none">Final approve pending</p>}
            {status === 'REJECTED' && <p className="text-sm text-status-pending font-semibold select-none">Rejected</p>}
            {status === 'APPROVED' && <p className="text-sm text-status-pending font-semibold select-none">Approved</p>}
            {status === 'SUBMITTED' && <p className="text-sm text-status-pending font-semibold select-none">Published</p>}
         </div>
      </React.Fragment>
   )
}

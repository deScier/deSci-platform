'use client'

import { AuthorsListDragabble } from '@/components/common/AuthorsListDraggable/AuthorsListDraggable'
import Box from '@/components/common/Box/Box'
import CommentItem from '@/components/common/Comment/Comment'
import DocumentApprovals from '@/components/common/DocumentApprovals/DocumentApprovals'
import { EditorsAndReviewers } from '@/components/common/EditorsAndReviwers/EditorAndReviwer'
import { File } from '@/components/common/File/File'
import Reasoning from '@/components/modules/deScier/Article/Reasoning'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useGetApprovals } from '@/hooks/useGetApprovals'
import { header_editor_reviewer } from '@/mock/article_under_review'
import { Author, authors_headers, authors_mock, authorship_headers } from '@/mock/submit_new_document'
import { home_routes } from '@/routes/home'
import { approveByAdminService } from '@/services/admin/approve.service'
import { useFetchAdminArticles } from '@/services/admin/fetchDocuments.service'
import { downloadDocumentVersionService } from '@/services/document/download.service'
import { DocumentComment, DocumentGetProps } from '@/services/document/getArticles'
import { getArticleTypeLabel } from '@/utils/generate_labels'
import { keywordsArray } from '@/utils/keywords_format'
import * as Button from '@components/common/Button/Button'
import * as Dialog from '@components/common/Dialog/Digalog'
import * as Input from '@components/common/Input/Input'
import { format } from 'date-fns'
import mermaid from 'mermaid'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { ArrowLeft, Check } from 'react-bootstrap-icons'
import { CurrencyInput } from 'react-currency-mask'
import { toast } from 'react-toastify'

export default function ArticleForApprovalPage({ params }: { params: { slug: string } }) {
   const { data: session } = useSession()
   const router = useRouter()

   const { fetch_article } = useFetchAdminArticles()

   const [article, setArticle] = React.useState<DocumentGetProps | null>(null)
   const [items, setItems] = React.useState(authors_mock)
   const [share, setShare] = React.useState('')
   const [authors, setAuthors] = React.useState<Author[]>([])
   const [access_type, setAccessType] = React.useState('open-access')
   const [authorship_settings, setAuthorshipSettings] = React.useState<Author>()
   const [dialog, setDialog] = React.useState({ author: false, share_split: false, edit_author: false, reasoning: false })
   const [loading, setLoading] = React.useState({
      approve: false,
      reject: false
   })
   const [chartError, setChartError] = React.useState<boolean>(false)

   const { editorApprovals, getApprovals, reviewerApprovals } = useGetApprovals()

   const onReorder = (newOrder: typeof items) => setItems((prevItems) => [...newOrder])

   const fetchSingleArticle = async (documentId: string) => {
      await fetch_article(documentId).then((res) => {
         setArticle(res as DocumentGetProps)
         const access = res?.document.accessType === 'FREE' ? 'open-access' : 'paid-access'
         setAccessType(access)
         getApprovals(res?.document.reviewersOnDocuments || [])
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

   const handleDownloadDocument = async (fileId: string, filename: string) => {
      console.log('download...')
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
      fetchSingleArticle(params.slug)
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [params.slug])

   React.useEffect(() => {
      const runMermaid = async () => {
         try {
            mermaid.initialize({ startOnLoad: false })
            await mermaid.run({ querySelector: '.mermaid' }).catch((error) => {
               console.log('Erro ao renderizar o Mermaid: ', error)
               setChartError(true)
            })
         } catch (error) {
            console.error('Erro ao renderizar o Mermaid: ', error)
            setChartError(true)
         }
      }

      if (article?.document.abstractChart) {
         runMermaid()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [article?.document.abstractChart])

   return (
      <React.Fragment>
         <Dialog.Root open={dialog.reasoning}>
            <Dialog.Overlay />
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
               <ArticleStatus status={article?.document.status || 'PENDING'} />
               <div className="grid grid-cols-2 gap-6">
                  <div className="grid grid-cols-1">
                     <span className="text-sm font-semibold">Title</span>
                     <span className="text-sm">{article?.document?.title}</span>
                  </div>
                  <div className="grid gap-2">
                     <p className="text-sm font-semibold">Add keywords</p>
                     <div className="flex flex-wrap gap-1 sm:gap-2">
                        {keywordsArray(article?.document.keywords as string)?.length > 0 ? (
                           <React.Fragment>
                              {keywordsArray(article?.document.keywords as string).map((tag, index) => (
                                 <div
                                    className="border rounded-md border-neutral-stroke_light flex items-center px-1 sm:px-2 py-[2px] bg-white"
                                    key={index}
                                 >
                                    <span className="text-xxs sm:text-xs text-primary-main">{tag}</span>
                                 </div>
                              ))}
                           </React.Fragment>
                        ) : (
                           <p className="text-sm text-gray-500 mt-8">There are no keywords inserted into this document.</p>
                        )}
                     </div>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-6">
                  <div className="grid grid-cols-1">
                     <span className="text-sm font-semibold">Field</span>
                     <span className="text-sm">{article?.document?.field}</span>
                  </div>
               </div>
               <div className="grid gap-2">
                  <h3 className="text-sm font-semibold">Document type</h3>
                  <p className="text-sm font-regular first-letter:uppercase lowercase">{getArticleTypeLabel(article?.document.documentType as string)}</p>
               </div>

               <div className="grid gap-2">
                  <h3 className="text-sm font-semibold">Abstract</h3>
                  <p className="text-sm font-regular">{article?.document.abstract}</p>
               </div>
               <div className="grid gap-4">
                  <p className="text-sm font-semibold">Cover</p>
                  <div className="w-full h-56 rounded-md overflow-hidden relative">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img
                        loading="lazy"
                        src={article?.document.cover || '/images/4fa38f086cfa1a2289fabfdd7337c09d.jpeg'}
                        alt="cover-preview"
                        className="absolute w-full h-full object-cover"
                     />
                  </div>
                  {article?.document.updatedAt && (
                     <p className="text-sm font-regular">
                        Last updated on {format(new Date(article?.document.updatedAt as unknown as string), 'dd/MM/yyyy - HH:mm')}
                     </p>
                  )}
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
                                    file_name={file.fileName || 'file.docx'}
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
               </div>
            </Box>
            <Box className="grid gap-8 h-fit py-6 px-8">
               <div className="grid gap-2">
                  <h3 className="text-xl text-primary-main font-semibold lg:text-lg 2xl:text-xl">Comments</h3>
                  <p className="text-sm">The reviewing team can publish comments, suggesting updates on your document.</p>
               </div>
               <div className="border rounded-md p-4">
                  <ScrollArea className="lg:h-[300px] pr-2">
                     <div className="grid gap-4">
                        {article?.document.documentComments && article?.document?.documentComments?.length > 0 ? (
                           article?.document.documentComments?.map((comment: DocumentComment) => (
                              <React.Fragment key={comment.id}>
                                 <CommentItem
                                    comment_author={comment.user.name}
                                    comment_content={comment.comment}
                                    status={comment.approvedByAuthor as 'APPROVED' | 'REJECTED' | 'PENDING'}
                                 />
                              </React.Fragment>
                           ))
                        ) : (
                           <p className="text-center col-span-2 text-gray-500 mt-8">There are no comments inserted into this document.</p>
                        )}
                     </div>
                  </ScrollArea>
               </div>
            </Box>
            <Box className="grid gap-8 h-fit py-6 px-8">
               <div className="grid gap-6">
                  <div className="grid gap-2">
                     <h3 className="text-xl text-terciary-main font-semibold lg:text-lg 2xl:text-xl">Authors</h3>
                     <p className="text-sm">Drag the Authors to reorder the list.</p>
                  </div>
                  <div className="grid gap-2">
                     <div className="grid grid-cols-3">
                        {authors_headers.map((header, index) => (
                           <React.Fragment key={index}>
                              <p className="text-sm font-semibold">{header.label}</p>
                           </React.Fragment>
                        ))}
                     </div>
                     <AuthorsListDragabble authors={[]} article={article} onReorder={onReorder} onDelete={(item) => {}} onEdit={(item) => {}} />
                  </div>
               </div>
            </Box>
            <Box className="grid gap-8 h-fit py-6 px-8">
               <div className="grid gap-4">
                  <div className="grid gap-2">
                     <h3 className="text-lg md:text-xl text-primary-main font-semibold">Editors / Reviewers</h3>
                     <p className="text-sm">
                        At least 1 editor and 2 reviewers’ approval are required to publish the paper. The editors and reviewers cannot be authors in the
                        project. Invite them to the platform through the link:
                     </p>
                  </div>
               </div>
               <div>
                  <div className="grid grid-cols-5">
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
               <div className="grid grid-cols-2 items-start gap-6">
                  <Input.Root>
                     <Input.Label>Type of access</Input.Label>
                     <Input.Input disabled defaultValue={access_type === 'open-access' ? 'Open access' : 'Paid access'} />
                  </Input.Root>
                  {access_type == 'open-access' && (
                     <Input.Root>
                        <Input.Label className="text-neutral-gray text-sm font-semibold pl-2">Valor total</Input.Label>
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
                              onChangeValue={(event, originalValue, maskedValue) => console.log(maskedValue)}
                              InputElement={<Input.Input placeholder="USD" disabled />}
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
               {article?.document.status === 'ADMIN_APPROVE' && (
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

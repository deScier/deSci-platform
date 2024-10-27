'use client'

import * as Button from '@components/common/Button/Button'
import * as Dialog from '@components/common/Dialog/Digalog'
import * as Input from '@components/common/Input/Input'

import { StoredFile } from '@/components/common/Dropzone/Typing'
import { EditorsAndReviewers } from '@/components/common/EditorsAndReviwers/EditorAndReviwer'
import { File } from '@/components/common/File/File'
import { AuthorsListDragabble } from '@/components/common/Lists/Authors/Authors'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useGetApprovals } from '@/hooks/useGetApprovals'
import { header_editor_reviewer } from '@/mock/article_under_review'
import { authors_headers, authors_mock, authorship_headers } from '@/mock/submit_new_document'
import { home_routes } from '@/routes/home'
import { useFetchAdminArticles } from '@/services/admin/fetchDocuments.service'
import { downloadDocumentVersionService } from '@/services/document/download.service'
import { DocumentComment, DocumentGetProps } from '@/services/document/getArticles'
import { ApproveArticleForJournal } from '@/services/journal/approveArticle.service'
import { formatFileName } from '@/utils/format_file_name'
import { getArticleTypeLabel } from '@/utils/generate_labels'
import { keywordsArray } from '@/utils/keywords_format'
import { format } from 'date-fns'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check } from 'react-bootstrap-icons'
import { CurrencyInput } from 'react-currency-mask'
import { toast } from 'react-toastify'
import { twMerge } from 'tailwind-merge'

import Box from '@/components/common/Box/Box'
import CommentItem from '@/components/common/Comment/Comment'
import DocumentApprovals from '@/components/common/DocumentApprovals/DocumentApprovals'
import Reasoning from '@/components/modules/deScier/Article/Reasoning'
import React from 'react'

export default function ArticleForApprovalPage({ params }: { params: { slug: string } }) {
   const router = useRouter()

   const { data: session } = useSession()
   const { fetch_article } = useFetchAdminArticles()
   const { editorApprovals, getApprovals, reviewerApprovals } = useGetApprovals()

   const [article, setArticle] = React.useState<DocumentGetProps | null>(null)
   const [items, setItems] = React.useState(authors_mock)
   const [access_type, setAccessType] = React.useState('open-access')
   const [dialog, setDialog] = React.useState({ author: false, share_split: false, edit_author: false, reasoning: false })
   const [loading, setLoading] = React.useState({ approve: false, reject: false })
   const [nftData, setNftData] = React.useState({ nftLink: '', nftHash: '' })
   const [updateNftDataLoading, setUpdateNftLoading] = React.useState<boolean>(false)
   const [uploadFileLoading, setUploadFileLoading] = React.useState<boolean>(false)
   const [file, setFile] = React.useState<StoredFile>()

   const onReorder = (newOrder: typeof items) => setItems((prevItems) => [...newOrder])

   const fetchSingleArticle = async (documentId: string) => {
      await fetch_article(documentId).then((res) => {
         setArticle(res as DocumentGetProps)
         setNftData({
            nftHash: res?.document?.nftHash || '',
            nftLink: res?.document?.nftLink || ''
         })
         const access = res?.document?.accessType === 'FREE' ? 'open-access' : 'paid-access'
         setAccessType(access)
         getApprovals(res?.document?.reviewersOnDocuments || [])
      })
   }

   const handleApproveDocument = async (approve: boolean) => {
      setLoading({ ...loading, approve: true })
      const response = await ApproveArticleForJournal({
         documentId: article?.document?.id!,
         approve: approve
      })

      setLoading({ ...loading, approve: false })

      if (!response.success) {
         toast.error(response.message)
         return
      }

      const status = approve ? 'approved' : 'rejected'
      toast.success(`Document ${status} successfully!`)

      router.push(home_routes.articles_for_approval)
   }

   const handleDownloadDocument = async (fileId: string, filename: string) => {
      const response = await downloadDocumentVersionService({
         documentId: article?.document?.id!,
         fileId,
         userId: session?.user?.userInfo.id!
      })

      if (!response.success) {
         toast.error(response.message)
         return
      }

      const url = URL.createObjectURL(response.file!)
      const link = document?.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)

      toast.success('Download will start...')
   }

   React.useEffect(() => {
      if (params.slug !== undefined) {
         fetchSingleArticle(params.slug)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [params.slug, session?.user?.userInfo?.id])

   return (
      <React.Fragment>
         <div className="grid gap-8">
            <div className="flex items-center gap-4">
               <ArrowLeft size={32} className="hover:scale-110 transition-all cursor-pointer" onClick={() => router.back()} />
               <h1 className="text-1xl font-semibold">Article in review</h1>
            </div>
            <Box className="grid gap-8 h-fit py-6 px-8">
               <div className="grid md:grid-cols-2 gap-6">
                  <div className="grid grid-cols-1">
                     <span className="text-sm font-semibold">Title</span>
                     <span className="text-sm">{article?.document?.title || '-'}</span>
                  </div>
                  <div className="grid gap-2">
                     <p className="text-sm font-semibold">Add keywords</p>
                     <div className="flex flex-wrap gap-1 sm:gap-2">
                        {keywordsArray(article?.document?.keywords as string)?.length > 0 ? (
                           <React.Fragment>
                              {keywordsArray(article?.document?.keywords as string).map((tag, index) => (
                                 <div
                                    className="border rounded-md border-neutral-stroke_light flex items-center px-1 sm:px-2 py-[2px] bg-white"
                                    key={index}
                                 >
                                    <span className="text-xxs sm:text-xs text-primary-main">{tag || '-'}</span>
                                 </div>
                              ))}
                           </React.Fragment>
                        ) : (
                           <p className="text-sm text-gray-500 mt-8">There are no keywords inserted into this document.</p>
                        )}
                     </div>
                  </div>
               </div>
               <div className="grid md:grid-cols-2 gap-6">
                  <div className="grid grid-cols-1">
                     <span className="text-sm font-semibold">Area of knowledge</span>
                     <span className="text-sm">{article?.document?.field || '-'}</span>
                  </div>
               </div>
               <div className="grid gap-2">
                  <h3 className="text-sm font-semibold">Document type</h3>
                  <p className="text-sm font-regular first-letter:uppercase lowercase">
                     {getArticleTypeLabel(article?.document?.documentType as string) || '-'}
                  </p>
               </div>
               <div className="grid gap-2">
                  <h3 className="text-sm font-semibold">Abstract</h3>
                  <p className="text-sm font-regular">{article?.document?.abstract || '-'}</p>
               </div>
               {article?.document?.cover && (
                  <div className="grid gap-4">
                     <p className="text-sm font-semibold">Cover</p>
                     <div className="w-full h-56 rounded-md overflow-hidden relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                           loading="lazy"
                           src={article?.document?.cover || '/images/4fa38f086cfa1a2289fabfdd7337c09d.jpeg'}
                           alt="cover-preview"
                           className="absolute w-full h-full object-cover"
                        />
                     </div>
                     {article?.document?.updatedAt && (
                        <p className="text-sm font-regular">
                           Last updated on {format(new Date(article?.document?.updatedAt as unknown as string), 'dd/MM/yyyy - HH:mm')}
                        </p>
                     )}
                  </div>
               )}
            </Box>
            <Box className="grid gap-8 h-fit py-6 px-8">
               <div className="grid gap-6">
                  <h3 className="text-xl text-primary-main font-semibold lg:text-lg 2xl:text-xl">Document file</h3>
                  <div>
                     <ScrollArea className="h-[200px] w-full pr-2">
                        <div className="grid gap-4">
                           {article?.document?.documentVersions && article?.document?.documentVersions.length > 0 ? (
                              article?.document?.documentVersions?.map((file) => (
                                 <File
                                    key={file.id}
                                    file_name={formatFileName(file.fileName as string) || 'file.docx'}
                                    onDownload={() => {
                                       handleDownloadDocument(file.id, file.fileName!)
                                    }}
                                    uploaded_at={new Date(file.createdAt).toLocaleDateString('pt-BR')}
                                    uploaded_by={article.document?.user?.name || ''}
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
            {article?.document?.nftHash && article?.document?.nftLink && (
               <Box className="grid gap-8 h-fit py-6 px-8">
                  <h3 className="text-xl text-primary-main font-semibold lg:text-lg 2xl:text-xl">Document links</h3>
                  <div className="grid md:grid-cols-2 items-start gap-6">
                     <Input.Root>
                        <Input.Label className="flex gap-2 items-center">
                           <span className="text-sm font-semibold">NFT hash</span>
                        </Input.Label>
                        <Input.Input
                           disabled
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
                           disabled
                           placeholder="Ex: https://opensea.io/assets/ethereum/0x495..."
                           value={nftData.nftLink}
                           onChange={(e) => setNftData({ ...nftData, nftLink: e.target.value })}
                        />
                     </Input.Root>
                  </div>
               </Box>
            )}
            <Box className="grid gap-4 md:gap-8 h-fit py-6 px-8">
               <div className="grid gap-2">
                  <h3 className="text-xl text-primary-main font-semibold lg:text-lg 2xl:text-xl">Comments</h3>
                  <p className="text-sm">The reviewing team can publish comments, suggesting updates on your document.</p>
               </div>
               <div className="border rounded-md p-4">
                  <ScrollArea
                     className={twMerge(
                        'h-[342px]',
                        `${article?.document?.documentComments && article?.document?.documentComments?.length == 0 && 'h-full'}`
                     )}
                  >
                     <div className="grid gap-4">
                        {article?.document?.documentComments && article?.document?.documentComments?.length > 0 ? (
                           article?.document?.documentComments?.map((comment: DocumentComment) => (
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
                     <AuthorsListDragabble read_only is_admin authors={[]} article={article} onReorder={onReorder} />
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
                              defaultValue={article?.document?.price}
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
                              {article?.document?.authorsOnDocuments?.map((author, index) => (
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
               {article?.document?.reviewersOnDocuments && article?.document?.reviewersOnDocuments?.length > 0 && (
                  <DocumentApprovals editorApprovals={editorApprovals} reviewerApprovals={reviewerApprovals} />
               )}
               {article?.document?.status === 'PENDING' && (
                  <p className="text-lg text-center text-status-pending font-semibold select-none">
                     This article is awaiting approval from editors and reviewers before it can be approved or rejected
                  </p>
               )}
               {article?.document?.status === 'ADMIN_APPROVE' && (
                  <React.Fragment>
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
                  </React.Fragment>
               )}
               {article?.document?.status === 'REJECTED' && (
                  <p className="text-lg text-center text-status-error font-semibold select-none">Article rejected</p>
               )}
               {article?.document?.status === 'APPROVED' ||
                  (article?.document?.status === 'SUBMITTED' && (
                     <p className="text-lg text-center text-status-green font-semibold select-none">Article approved</p>
                  ))}
            </Box>
         </div>
         <Dialog.Root open={dialog.reasoning}>
            <Dialog.Content className="py-14 px-16 max-w-[600px]">
               <Reasoning
                  message={''}
                  documentAuthor={article?.document?.user?.name!}
                  onClose={() => setDialog({ ...dialog, reasoning: false })}
                  onConfirm={(value) => {
                     setDialog({ ...dialog, reasoning: false })
                     handleApproveDocument(false)
                  }}
               />
            </Dialog.Content>
         </Dialog.Root>
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

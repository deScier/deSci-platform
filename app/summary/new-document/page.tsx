'use client'

import Box from '@/components/common/Box/Box'
import { StoredFile } from '@/components/common/Dropzone/Typing'
import { SelectArticleType } from '@/components/common/Filters/SelectArticleType/SelectArticleType'
import { AuthorsListDragabble } from '@/components/common/Lists/Authors/Authors'
import { NewAuthor } from '@/components/modules/Summary/NewArticle/Authors/NewAuthor'
import { useLimitCharacters } from '@/hooks/useLimitCharacters'
import { access_type_options } from '@/mock/access_type'
import { article_types_submit_article } from '@/mock/articles_types'
import { Author, authors_headers, authorship_headers } from '@/mock/submit_new_document'
import { home_routes } from '@/routes/home'
import { AuthorProps, CreateDocumentProps, CreateDocumentSchema } from '@/schemas/create_document'
import { submitNewDocumentService } from '@/services/document/submit.service'
import { uploadDocumentFileService } from '@/services/file/file.service'
import { ErrorMessage } from '@/utils/error_message'
import { truncate } from '@/utils/truncate'
import * as Button from '@components/common/Button/Button'
import * as Dialog from '@components/common/Dialog/Digalog'
import * as Input from '@components/common/Input/Input'
import * as Title from '@components/common/Title/Page'
import * as Tooltip from '@components/common/Tooltip/Tooltip'
import { zodResolver } from '@hookform/resolvers/zod'
import { uniqueId } from 'lodash'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import NProgress from 'nprogress'
import React, { useEffect, useState } from 'react'
import { Clipboard, Pencil, PlusCircle, PlusCircleDotted, Trash, X } from 'react-bootstrap-icons'
import { CurrencyInput } from 'react-currency-mask'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { twMerge } from 'tailwind-merge'

const Dropzone = dynamic(() => import('@/components/common/Dropzone/Dropzone'), { ssr: false })

export default function SubmitNewPaperPage() {
   /** @dev Initialize router for navigation and session hook for user session management */
   const router = useRouter()
   const { data: session, update: updateSession } = useSession()

   /** @dev Initialize states for loading indicators, dialog settings, and various form inputs */
   const [loading, setLoading] = useState(false)
   const [dialog, setDialog] = useState({ author: false, share_split: false, edit_author: false, edit_share_split: false, warning_on_change_page: false })
   const [access_type, setAccessType] = useState('open-access')
   const [share, setShare] = useState('')
   const [wallet, setWallet] = useState('')
   const [authors, setAuthors] = useState<Author[]>([])
   const [edit_share_split, setEditShare] = useState<Author | null>()
   const [authorship_settings, setAuthorshipSettings] = useState<Author>()
   const [author_to_edit, setAuthorToEdit] = useState<Author | undefined>(undefined)
   const [keywords_temp, setKeywordsTemp] = useState<string | undefined>()
   const [abstractChart, setAbstractChart] = useState<string>('')
   const [documentType, setDocumentType] = React.useState<string | null>(null)

   /**
    * @dev Using `useForm` hook from React Hook Form for form state management and validation
    * @return The useForm hook returns several methods and states for form management
    */
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

   console.log('errors', errors)

   /** @dev Using `useFieldArray` to manage dynamic keyword fields */
   const { append, remove, fields: keywords } = useFieldArray({ name: 'keywords', control: control })

   /**
    * @dev Function to handle reordering of authors
    * @param newOrder The new order of authors
    */
   const onReorder = (newOrder: typeof authors) => {
      setAuthors(newOrder)
      setValue('authors', newOrder)
   }

   /**
    * @dev Async function to handle document submission
    * @param data The form data for document submission
    */
   const handleSubmitDocument: SubmitHandler<CreateDocumentProps> = async (data) => {
      setLoading(true)
      const requestData = {
         abstract: data.abstract,
         accessType: access_type === 'open-access' ? 'FREE' : 'PAID',
         documentType: data.documentType,
         field: data.field,
         price: access_type === 'open-access' ? 0 : Number(data.price),
         title: data.title,
         abstractChart: abstractChart,
         keywords: data.keywords.map((item) => item.name),
         category: data.category
      }

      const documentAuthors = authors.map((item, index) => ({
         email: item.email,
         name: item.name,
         position: index + 1,
         revenuePercent: access_type === 'open-access' ? 0 : Number(item.share?.substring(0, item.share.length - 1)) || 0,
         title: item.title,
         walletAddress: item.wallet || ''
      }))

      const response = await submitNewDocumentService({
         ...requestData,
         abstract: data.abstract || '',
         authors: documentAuthors
      })

      if (!response.success) {
         toast.error(response.message)
         setLoading(false)
         return
      }

      const uploadDocumentSuccess = await uploadDocumentFileService({
         documentId: response.documentId,
         fileLocalUrl: watch('file').preview,
         filename: watch('file').name,
         mimetype: watch('file').type
      })

      if (!uploadDocumentSuccess) {
         toast.warning('There was an error uploading your file. But you can upload later.')
      }

      const uploadCoverSuccess = await uploadDocumentFileService({
         documentId: response.documentId,
         fileLocalUrl: watch('cover').preview,
         filename: watch('cover').name,
         mimetype: watch('cover').type
      })

      if (!uploadCoverSuccess) {
         toast.warning('There was an error uploading your cover file. But you can upload later.')
      }

      if (response.success) {
         toast.success(response.message)
         router.push(home_routes.articles_under_review)
         setLoading(false)
      }
   }

   /**
    * @dev Function to handle keyword addition on enter key press
    * @param e The keyboard event
    */
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

   /**
    * @dev useEffect hook to set initial author details from session
    */
   useEffect(() => {
      if (session?.user) {
         const author = {
            id: session.user.userInfo.id,
            email: session?.user?.email,
            name: session?.user?.userInfo.name,
            revenuePercent: '0',
            title: session?.user?.userInfo.title || '',
            walletAddress: session?.user?.userInfo.walletAddress || ''
         }
         if (!authors.length) {
            setAuthors([author])
         }
         if (!getValues('authors').length) {
            setValue('authors', [author])
         }
      }
   }, [session?.user, authors, setValue, getValues])

   /**
    * @title Save Share Settings Function
    * @notice Handles the logic for saving the share settings of authors.
    * @dev This function updates the share percentage of an author in a list of authors. It ensures the total share does not exceed 100%.
    */
   const onSaveShareSettings = () => {
      /**
       * @dev Check if 'edit_share_split' and 'share' are truthy. If not, log an error.
       */
      if (edit_share_split && share) {
         /**
          * @dev Convert the 'share' value from a string to a float and remove the '%' character.
          */
         let shareValue = parseFloat(share.replace('%', ''))

         /**
          * @dev Calculate the total share percentage of authors excluding the current one being edited.
          */
         const totalOtherShares = authors.reduce((acc, author) => {
            /**
             * @dev Accumulate the share of each author, excluding the author being edited.
             */
            return author.id !== edit_share_split.id && author.share ? acc + parseFloat(author.share.replace('%', '')) : acc
         }, 0)

         /**
          * @dev Calculate the maximum allowed share for the current author by subtracting others' shares from 100%.
          */
         const maxAllowedShare = 100 - totalOtherShares

         /**
          * @dev If the calculated share value exceeds the maximum allowed, set it to the maximum.
          */
         if (shareValue > maxAllowedShare) {
            shareValue = maxAllowedShare
         }

         /**
          * @dev Update the 'authors' array with the new share value for the edited author.
          */
         const updatedAuthors = authors.map((author) => {
            /**
             * @dev For the author being edited, update their share value.
             */
            if (author.id === edit_share_split.id) {
               return { ...author, share: `${shareValue}%` }
            }
            return author
         })

         /**
          * @dev Set the 'authors' state with the updated authors array.
          */
         setAuthors(updatedAuthors)
      } else {
         /**
          * @dev Log an error if the function is called without valid 'edit_share_split' and 'share' values.
          */
         console.error('Share value cannot be more than 100%')
      }

      /**
       * @dev Update the 'dialog' state to close the share split and edit author dialogs, and reset the 'editShare' state.
       */
      setDialog({ ...dialog, share_split: false, edit_author: false })
      setEditShare(null)
   }

   const { characterLimit: fieldLimit, length: fieldLength } = useLimitCharacters()
   const { characterLimit: titleLimit, length: titleLenght } = useLimitCharacters()
   const { characterLimit: abstractLimit, length: abstractLenght } = useLimitCharacters()

   const [targetUrl, setTargetUrl] = useState('')

   useEffect(() => {
      if (typeof window === 'undefined') {
         return
      }

      const handleAnchorClick = (event: MouseEvent) => {
         if (isDirty) {
            const url = (event.currentTarget as HTMLAnchorElement).href
            if (url.startsWith(window.location.origin) && url !== window.location.href) {
               setTargetUrl(url)
               setDialog({ ...dialog, warning_on_change_page: true })
               event.preventDefault()
               NProgress.done()
            }
         }
      }

      const handleMutation: MutationCallback = (mutationsList, observer) => {
         const anchorElements = document.querySelectorAll('a')
         anchorElements.forEach((anchor) => anchor.addEventListener('click', handleAnchorClick))
      }

      const mutationObserver = new MutationObserver(handleMutation)
      mutationObserver.observe(document, { childList: true, subtree: true })

      const originalPushState = window.history.pushState

      return () => {
         mutationObserver.disconnect()
         window.history.pushState = originalPushState
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isDirty])

   const handleLeave = () => {
      router.push(targetUrl)
   }

   const handleClose = () => {
      setDialog({ ...dialog, warning_on_change_page: false })
   }

   return (
      <React.Fragment>
         <Dialog.Root open={dialog.author || dialog.share_split || dialog.edit_author || dialog.edit_share_split || dialog.warning_on_change_page}>
            <Dialog.Overlay />
            <Dialog.Content className={twMerge('md:px-16 md:py-14 pb-20', `${dialog.warning_on_change_page && 'max-w-[564px]'}`)}>
               {dialog.author && (
                  <NewAuthor
                     onAddAuthor={(value) => {
                        const newAuthor: AuthorProps = {
                           id: value.id,
                           name: value.name,
                           title: value.title,
                           email: value.email,
                           revenuePercent: value.revenuePercent
                        }
                        setAuthors((prevItems) => [...prevItems, newAuthor])
                        setValue('authors', [...authors, newAuthor])
                     }}
                     onClose={() => setDialog({ ...dialog, author: false })}
                  />
               )}
               {dialog.edit_author && (
                  <NewAuthor
                     onEditAuthor={author_to_edit}
                     onUpdateAuthor={(updatedAuthor) => {
                        setAuthors((prevItems) => {
                           return prevItems.map((item) => (item.id === author_to_edit?.id ? { ...item, ...updatedAuthor } : item))
                        })
                     }}
                     onClose={() => setDialog({ ...dialog, edit_author: false })}
                  />
               )}
               {dialog.share_split && (
                  <React.Fragment>
                     <div className="grid gap-6">
                        <Dialog.Title
                           title="Share split"
                           onClose={() => {
                              setDialog({ ...dialog, share_split: false })
                              setEditShare(null)
                              setAuthorshipSettings(undefined)
                           }}
                        />
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
                                    placeholder="Crypto wallet address to receive $"
                                    onChange={(e) => setWallet(e.target.value)}
                                 />
                              </Input.Root>
                           </div>
                           <Button.Button
                              variant="primary"
                              onClick={() => {
                                 if (!authorship_settings!.id) {
                                    console.error('Authorship settings does not have an ID!')
                                    return
                                 }

                                 const authorIndex = authors.findIndex((author) => author.id === authorship_settings!.id)

                                 const updatedAuthors = [...authors]
                                 updatedAuthors[authorIndex].share = share.includes('%') ? share : share + '%'
                                 updatedAuthors[authorIndex].wallet = wallet
                                 setAuthors(updatedAuthors)

                                 onSaveShareSettings()
                              }}
                           >
                              Add share split
                           </Button.Button>
                        </div>
                     </div>
                  </React.Fragment>
               )}
               {dialog.warning_on_change_page && (
                  <React.Fragment>
                     <Dialog.Title
                        title="Submission not completed!"
                        onClose={() => {
                           setDialog({ ...dialog, share_split: false, warning_on_change_page: false })
                        }}
                     />
                     <p className="text-base">Your document submission is not complete yet. If you leave the page, all your progress will be lost!</p>
                     <Button.Button variant="primary" onClick={handleClose}>
                        Cancel
                     </Button.Button>
                     <Button.Button variant="outline" onClick={handleLeave}>
                        Leave without finishing
                     </Button.Button>
                  </React.Fragment>
               )}
            </Dialog.Content>
         </Dialog.Root>
         <Title.Root>
            <Title.Title>Submit new article</Title.Title>
         </Title.Root>
         <form onSubmit={handleSubmit(handleSubmitDocument)} className="grid gap-6 pb-14">
            <Box className="grid gap-8 h-fit px-4 py-6 md:px-8">
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
                           selected={documentType}
                           items={article_types_submit_article}
                           onValueChange={(value, name) => {
                              setDocumentType(value)

                              setValue('documentType', value), trigger('documentType')
                              setValue('category', name as string), trigger('category')
                           }}
                        />
                     </Input.Root>
                  </div>
               </div>
               <div className="flex flex-col gap-2">
                  <Dropzone
                     accept="documents"
                     placeholder="Upload document file (.docx)"
                     thumbnail={false}
                     setSelectedFile={(file) => {
                        setValue('file', file as StoredFile)
                        trigger('file')
                        clearErrors('file')
                     }}
                  />
                  <div className="flex w-full justify-center">
                     <Input.Error>
                        {ErrorMessage({
                           error: errors.file?.name?.type,
                           message: 'File is required.'
                        })}
                     </Input.Error>
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
                     accept="images"
                     placeholder="Upload cover picture (.png, .jpg)"
                     setSelectedFile={(file) => {
                        setValue('cover', file as StoredFile)
                        trigger('cover')
                        clearErrors('cover')
                     }}
                  />
                  <div className="flex justify-center w-full">
                     <Input.Error>
                        {ErrorMessage({
                           error: errors.cover?.type,
                           message: 'Cover is required.'
                        })}
                     </Input.Error>
                  </div>
               </div>
            </Box>
            <Box className="grid gap-8 h-fit px-4 py-6 md:px-8">
               <div className="grid gap-2">
                  <div className="grid">
                     <h3 className="text-lg md:text-xl text-terciary-main font-semibold">Authorship</h3>
                  </div>
                  <div className="grid gap-6">
                     <Button.Button
                        type="button"
                        variant="outline"
                        className="px-4 py-3 w-full text-sm"
                        onClick={() => {
                           setDialog({ ...dialog, author: true })
                        }}
                     >
                        Add authors for this paper
                        <PlusCircle className="w-4 fill-primary-main" />
                     </Button.Button>
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
                           }}
                           onEdit={(item) => {
                              setAuthorToEdit(item as AuthorProps)
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
                        At least 1 editor and 1 reviewers approval are required to publish the paper. The editors and reviewers cannot be authors in the
                        project.
                     </p>
                  </div>
                  <div>
                     <p className="text-sm font-semibold">Invite Link</p>
                     <p className="text-sm font-semibold text-neutral-gray">The link will be created after submitting for review.</p>
                  </div>
               </div>
            </Box>
            <Box className="grid gap-8 h-fit px-4 py-6 md:px-8">
               <div className="grid gap-2">
                  <h3 className="text-lg md:text-xl text-status-green font-semibold">Access type</h3>
                  <p className="text-sm">
                     Decide if the project is <span className="text-[#53AA22] font-semibold">Open Access</span> or{' '}
                     <span className="text-[#AE66E6] font-semibold">Paid Access</span>
                  </p>
               </div>
               <div className="grid md:grid-cols-2 items-start gap-6">
                  <Input.Root>
                     <Input.Select
                        label={'Type of access'}
                        placeholder="Select if Open or Paid Acess"
                        onValueChange={(value) => {
                           const value_access = value as unknown as CreateDocumentProps['accessType']

                           if (value_access === 'FREE') {
                              setAccessType(value)
                              setAuthorshipSettings(undefined)
                              setAuthors(authors.map((author) => ({ ...author, share: '0%' })))
                              setValue('price', '0')
                           } else {
                              setAccessType(value)
                              setValue('price', '')
                           }
                        }}
                        value={access_type}
                        options={access_type_options}
                     />
                  </Input.Root>
                  {access_type == 'open-access' && (
                     <Input.Root>
                        <Input.Label className="text-neutral-gray text-sm font-semibold pl-2">Total value</Input.Label>
                        <Input.Input disabled placeholder="R$" />
                     </Input.Root>
                  )}
                  {access_type == 'paid-access' && (
                     <React.Fragment>
                        <Input.Root>
                           <Input.Label className="text-sm font-semibold">Price</Input.Label>
                           <CurrencyInput
                              currency="USD"
                              onChangeValue={(event, originalValue, maskedValue) => {
                                 setValue('price', originalValue.toString())
                                 trigger('price')
                              }}
                              InputElement={<Input.Input placeholder="$10" />}
                           />
                           <Input.Error>{errors.price?.message}</Input.Error>
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
                              <div className="hidden md:flex items-center justify-start gap-2" key={index}>
                                 <p className="text-sm font-semibold">{header.label}</p>
                                 {header.tooltip && <Tooltip.Information content={header.tooltip} />}
                              </div>
                           ))}
                        </div>
                        <div className="grid gap-4">
                           <div>
                              {authors.map((author, index) => (
                                 <React.Fragment key={index}>
                                    <div className="grid gap-2 md:gap-0 md:grid-cols-3 items-center py-3">
                                       <div>
                                          <p className="text-sm font-semibold md:font-regular text-secundary_blue-main">{author.name}</p>
                                       </div>
                                       <div>
                                          {author.share ? (
                                             <div className="flex gap-2 px-4 py-1 border rounded-md border-terciary-main justify-center md:justify-normal w-full md:w-fit">
                                                <p className="text-sm text-center text-terciary-main">{author.share}</p>
                                                <p className="text-sm text-terciary-main">Authorship</p>
                                             </div>
                                          ) : (
                                             <Button.Button
                                                variant="outline"
                                                className="px-4 py-2 w-fit text-sm"
                                                onClick={() => {
                                                   setDialog({ ...dialog, share_split: true })
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
                                          <div className="flex items-center gap-1">
                                             <p className="text-sm md:hidden text-center text-black font-semibold">Wallet:</p>
                                             <p className="text-sm md:text-base text-center text-black w-8">
                                                {truncate(author.wallet as string, 24, false) || '-'}
                                             </p>
                                          </div>
                                          <div className="flex items-center gap-2">
                                             {author.id !== session?.user?.userInfo.id && (
                                                <Trash
                                                   size={20}
                                                   className=" fill-status-error hover:scale-110 transition-all duration-200 cursor-pointer"
                                                   onClick={() => {
                                                      const author_whitout_share = authors.filter((item) => item.id !== author.id)

                                                      const author_updated: AuthorProps = {
                                                         email: author.email,
                                                         id: author.id,
                                                         name: author.name,
                                                         title: author.title,
                                                         revenuePercent: '0',
                                                         walletAddress: author.wallet || ''
                                                      }

                                                      setAuthors(() => [...author_whitout_share, author_updated])
                                                   }}
                                                />
                                             )}
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
                           </div>
                           <div className="grid md:grid-flow-col justify-start gap-4 md:grid-cols-3">
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
                  </React.Fragment>
               )}
            </Box>
            <Button.Button type="submit" variant="primary" loading={loading}>
               Submit article for review
               <Clipboard className="w-5" />
            </Button.Button>
         </form>
      </React.Fragment>
   )
}

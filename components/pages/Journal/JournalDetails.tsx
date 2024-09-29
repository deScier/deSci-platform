'use client'

import * as Button from '@components/common/Button/Button'
import * as Dialog from '@components/common/Dialog/Digalog'
import * as Input from '@components/common/Input/Input'
import * as Title from '@components/common/Title/Page'
import * as Tooltip from '@components/common/Tooltip/Tooltip'

import { Option } from '@/components/common/Input/Typing'
import { MembersListDragabble } from '@/components/common/Lists/Members/Members'
import { WarningOnChangePage } from '@/components/common/Warning/WarningOnChangePage'
import { ArticleItem } from '@/components/modules/Home/Search/ArticleItem/ArticleItem'
import { AddNewMember } from '@/components/modules/Summary/NewJournal/AddNewMember/AddNewMember'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useLimitCharacters } from '@/hooks/useLimitCharacters'
import { cn } from '@/lib/utils'
import { home_routes } from '@/routes/home'
import { CreateJournalDTO, CreateJournalSchema, MembersDTO } from '@/schemas/create_new_journal'
import { approveJournalByAdminService } from '@/services/admin/approveJournal.service'
import { JournalProps } from '@/services/journal/getJournals.service'
import { keywordsArray } from '@/utils/keywords_format'
import { slugfy } from '@/utils/slugfy'
import { zodResolver } from '@hookform/resolvers/zod'
import { uniqueId } from 'lodash'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Check, PlusCircle, X } from 'react-bootstrap-icons'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import Box from '@/components/common/Box/Box'
import NProgress from 'nprogress'
import React from 'react'

export default function JournalDetails({ params }: { params: { journal: JournalProps } }) {
   const journal = params.journal
   const router = useRouter()

   const { data: session } = useSession()

   const [keywords_temp, setKeywordsTemp] = React.useState<string | undefined>()
   const [members_temp, setMembersTemp] = React.useState<MembersDTO | undefined>()
   const [dialog, setDialog] = React.useState({ members: false, warning_on_change_page: false, add_new_member: false, edit_member: false })
   const [members, setMembers] = React.useState<MembersDTO[]>(journal.journalOnMembers || [])
   const [loading, setLoading] = React.useState({
      approve_journal: false,
      reject_journal: false
   })

   const [journalStatus, setJournalStatus] = React.useState<string>(journal.status)

   const {
      register,
      watch,
      formState: { errors, isDirty },
      setValue,
      trigger,
      control,
      setError,
      clearErrors,
      getValues
   } = useForm<CreateJournalDTO>({
      resolver: zodResolver(CreateJournalSchema),
      defaultValues: {
         name: journal.name,
         field: journal.field,
         rationale: journal.rationale,
         originatesFrom: journal.originatesFrom,
         cover: {
            lastModified: 0,
            lastModifiedDate: new Date(),
            name: '',
            path: '',
            preview: journal.cover,
            size: 0,
            type: ''
         },
         keywords: keywordsArray(journal.keywords).map((keyword) => ({ id: uniqueId('key'), name: keyword })),
         members: journal.journalOnMembers
      }
   })

   const { append: append_member } = useFieldArray({ control, name: 'members' })

   const onReorder = (newMembers: MembersDTO[]) => {
      setMembers(newMembers)
      setValue('members', newMembers)
   }

   const { append: append_keyword, fields: keywords } = useFieldArray({
      control,
      name: 'keywords'
   })

   const [targetUrl, setTargetUrl] = React.useState('')

   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.keyCode === 13) {
         if (keywords_temp && keywords_temp.trim() !== '') {
            e.preventDefault()
            append_keyword({ id: uniqueId('key'), name: keywords_temp as string })
            setKeywordsTemp('')
         } else {
            setError('keywords', {
               type: 'manual',
               message: 'Keyword is required.'
            })
         }
      }
   }

   const handleApproveJournal = async (status: 'APPROVED' | 'REJECTED') => {
      setLoading({
         approve_journal: status === 'APPROVED',
         reject_journal: status === 'REJECTED'
      })
      const response = await approveJournalByAdminService({
         journalId: journal.id,
         status
      })
      setLoading({
         approve_journal: false,
         reject_journal: false
      })

      if (!response.success) {
         toast.error(response.message)
         return
      }

      setJournalStatus(status)

      toast.success(response.message)
      router.push(home_routes.descier.journals_for_approval)
   }

   React.useEffect(() => {
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

   const handleLeave = () => router.push(targetUrl)

   const handleClose = () => {
      setDialog({ ...dialog, warning_on_change_page: false })
   }

   const { characterLimit: fieldLimit, length: fieldLength } = useLimitCharacters()
   const { characterLimit: titleLimit, length: titleLenght } = useLimitCharacters()
   const { characterLimit: rationaleLimit, length: abstractLenght } = useLimitCharacters()

   return (
      <React.Fragment>
         <Dialog.Root open={dialog.add_new_member || dialog.edit_member || dialog.members || dialog.warning_on_change_page}>
            <Dialog.Content className={cn('md:px-16 md:py-14 pb-20', `${dialog.warning_on_change_page && 'max-w-[564px] w-[564px]'}`)}>
               {dialog.add_new_member && (
                  <AddNewMember
                     onClose={() => setDialog({ ...dialog, add_new_member: false })}
                     onAddMember={(member) => {
                        append_member(member)
                        setMembers((prev) => [...prev, member])
                        setDialog({ ...dialog, add_new_member: false })
                     }}
                     onEditMember={members_temp}
                     onUpdateMember={(updatedMember) => {
                        setMembers((prevItems) => {
                           return prevItems.map((item) => (item.id === members_temp?.id ? { ...item, ...updatedMember } : item))
                        })
                        setDialog({ ...dialog, add_new_member: false })
                     }}
                  />
               )}
               {dialog.warning_on_change_page && (
                  <React.Fragment>
                     <WarningOnChangePage handleClose={handleClose} handleLeave={handleLeave} />
                  </React.Fragment>
               )}
            </Dialog.Content>
         </Dialog.Root>
         <Title.Root>
            <Title.Title>Submit new Journal</Title.Title>
         </Title.Root>
         <form className="grid gap-6 pb-14">
            <Box className="grid gap-8 h-fit px-4 py-6 md:px-8">
               <div className="grid gap-6">
                  <div className="grid md:grid-cols-2 items-start gap-6">
                     <Input.Root>
                        <Input.Label className="flex gap-2 items-center">
                           <span className="text-sm font-semibold">Name</span>
                           <span className="text-sm text-neutral-light_gray">{titleLenght}/100 characters</span>
                        </Input.Label>
                        <Input.Input
                           placeholder="Title of the Journal"
                           className="pointer-events-none"
                           {...register('name')}
                           onInput={(e) => {
                              titleLimit({
                                 e: e as React.ChangeEvent<HTMLInputElement>,
                                 limit: 100,
                                 onInput: (value) => {
                                    setValue('name', value.currentTarget.value)
                                    trigger('name')
                                 }
                              })
                           }}
                        />
                        <Input.Error>{errors.name?.message}</Input.Error>
                     </Input.Root>
                     <Input.Root>
                        <Input.Label className="flex gap-2 items-center">
                           <span className="text-sm font-semibold">Field</span>
                           <span className="text-sm text-neutral-light_gray">{fieldLength}/100 characters</span>
                        </Input.Label>
                        <Input.Input
                           placeholder="Area of knowledge"
                           className="pointer-events-none"
                           {...register('field')}
                           onInput={(e) => {
                              fieldLimit({
                                 e: e as React.ChangeEvent<HTMLInputElement>,
                                 limit: 100,
                                 onInput: (value) => {
                                    setValue('field', value.currentTarget.value)
                                    trigger('field')
                                 }
                              })
                           }}
                        />
                        <Input.Error>{errors.field?.message}</Input.Error>
                     </Input.Root>
                  </div>
                  <div className="grid md:grid-cols-2 items-start gap-6">
                     <Input.Root>
                        <Input.Label
                           className="text-sm font-semibold"
                           tooltip_message="Add up to 5 keywords that best describe the content and focus of your document. This helps others discover your work."
                        >
                           Add keywords
                        </Input.Label>
                        <Input.Input
                           className="pointer-events-none"
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
                                    onClick={() => {}}
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
                                    onClick={() => {}}
                                 />
                                 <span className="text-xxs sm:text-xs text-primary-main">{keyword.name}</span>
                              </div>
                           ))}
                        </div>
                     </Input.Root>
                     <Input.Root>
                        <Input.Label className="flex gap-2 items-center">
                           <span className="text-sm  font-semibold">The Journal originates from</span>
                        </Input.Label>
                        <div className="pointer-events-none">
                           <Input.Select
                              options={journal_originate_from}
                              placeholder="Select"
                              onValueChange={(value) => {
                                 const value_access = value as string
                                 setValue('originatesFrom', value_access)
                                 trigger('originatesFrom')
                              }}
                              value={watch('originatesFrom')}
                           />
                        </div>
                        <Input.Error>{errors.field?.message}</Input.Error>
                     </Input.Root>
                  </div>
               </div>
               <Input.Root>
                  <Input.Label className="flex gap-2 items-center">
                     <span className="text-sm font-semibold">Rationale</span>
                     <span className="text-sm text-neutral-light_gray">{abstractLenght}/1000 characters</span>
                     <span className="text-sm text-neutral-light_gray italic">Optional</span>
                     <Tooltip.Information content="Give a brief reason for create a new Journal." />
                  </Input.Label>
                  <Input.TextArea
                     disabled
                     {...register('rationale')}
                     rows={4}
                     placeholder="Provide a brief reason for creating a new journal"
                     onInput={(e) => {
                        rationaleLimit({
                           e: e,
                           limit: 1000,
                           onInput: (value) => {
                              setValue('rationale', value.currentTarget.value)
                              trigger('rationale')
                           }
                        })
                     }}
                  />
                  <Input.Error>{errors.rationale?.message}</Input.Error>
               </Input.Root>
               <div className="grid gap-4">
                  <p className="text-sm font-semibold">Journal cover</p>
                  <div
                     className={cn(
                        'grid rounded-lg p-4 transition duration-300 ease-in-out items-center bg-[#F1FFFF] py-6 min-h-[140px]',
                        'h-44 w-full p-0'
                     )}
                  >
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img src={getValues('cover')?.preview} alt="cover" className="w-full h-44 object-cover rounded-md brightness-50" loading="lazy" />
                  </div>
               </div>
               <div className="space-y-4">
                  <h4 className="text-sm font-medium leading-none">
                     Articles in this Journal <span className="text-xs text-neutral-light_gray">({journal.documents?.length || 0})</span>
                  </h4>
                  <ScrollArea className={cn('h-72 w-full rounded-md border')}>
                     <div className={cn('p-4 space-y-4', journal.documents && journal.documents.length == 0 ? 'h-72' : '')}>
                        {journal.documents && journal.documents.length > 0 ? (
                           journal.documents.map((document) => (
                              <React.Fragment key={document.id}>
                                 <ArticleItem
                                    title={document.title}
                                    access_type={document.accessType === 'PAID' ? 'paid' : 'open'}
                                    authors={
                                       document.authorsOnDocuments?.map((item) => ({
                                          id: item.id || uniqueId('author'),
                                          name: item.author?.name || ''
                                       })) || []
                                    }
                                    id={document.id}
                                    className="border rounded-md"
                                    image={document.cover || ''}
                                    likes={document.likes || 0}
                                    published_date={document.createdAt as unknown as string}
                                    tags={document.keywords.split(';')?.map((item) => ({ id: uniqueId('keyword'), name: item })) || []}
                                    views={document.views || 0}
                                    document_type={document.documentType}
                                    journal={{ id: journal.id, name: journal.name }}
                                 />
                              </React.Fragment>
                           ))
                        ) : (
                           <div className="text-sm lg:text-base text-center flex h-full items-center justify-center text-neutral-gray">
                              This journal does not have any published articles yet.
                           </div>
                        )}
                     </div>
                  </ScrollArea>
               </div>
            </Box>
            <Box className="grid gap-8 h-fit px-4 py-6 md:px-8">
               <div className="grid gap-2">
                  <div className="grid">
                     <h3 className="text-lg md:text-xl text-black font-semibold">Editor-in-Chief</h3>
                  </div>
                  <div className="grid gap-6">
                     <Button.Button
                        type="button"
                        disabled
                        variant="outline"
                        className="px-4 py-3 w-full text-sm"
                        onClick={() => setDialog({ ...dialog, add_new_member: true })}
                     >
                        Add Editorial Board Members, if already available
                        <PlusCircle className="w-4 fill-primary-main" />
                     </Button.Button>
                     <p className="text-sm">Drag to reorder.</p>
                     <div className="grid gap-2">
                        <div className="hidden md:grid grid-cols-3">
                           {editors_in_chief.map((header, index) => (
                              <React.Fragment key={index}>
                                 <p className="text-sm font-semibold">{header.label}</p>
                              </React.Fragment>
                           ))}
                        </div>
                        <MembersListDragabble members={members} onReorder={(newMember) => {}} />
                     </div>
                  </div>
               </div>
            </Box>
            <Box className="grid gap-4 h-fit py-6 px-8">
               {session?.user?.userInfo.role === 'ADMIN' && journalStatus !== 'APPROVED' ? (
                  <React.Fragment>
                     <Button.Button
                        variant="primary"
                        className="flex items-center"
                        loading={loading.approve_journal}
                        disabled={loading.reject_journal}
                        onClick={() => handleApproveJournal('APPROVED')}
                     >
                        <Check className="w-5 h-5" />
                        Approve journal
                     </Button.Button>
                     <Button.Button
                        variant="outline"
                        className="flex items-center"
                        loading={loading.reject_journal}
                        disabled={loading.approve_journal}
                        onClick={() => handleApproveJournal('REJECTED')}
                     >
                        <X className="w-5 h-5" />
                        Reject journal
                     </Button.Button>
                  </React.Fragment>
               ) : (
                  journalStatus === 'PENDING' && (
                     <h3 className="text-lg font-semibold text-status-pending flex justify-center">Awaiting admin approval</h3>
                  )
               )}
               {journalStatus === 'REJECTED' && <p className="text-lg text-center text-status-error font-semibold select-none">Journal rejected</p>}
               {journalStatus === 'APPROVED' && <p className="text-lg text-center text-status-green font-semibold select-none">Journal approved</p>}
            </Box>
         </form>
      </React.Fragment>
   )
}

const editors_in_chief = [
   {
      id: 1,
      label: 'Name'
   },
   {
      id: 1,
      label: 'Role'
   },
   {
      id: 1,
      label: 'E-mail'
   }
]

const journal_originate_from: Option[] = [
   { id: uniqueId(), label: 'New Area of Knowledge', value: slugfy('New Area of Knowledge') },
   { id: uniqueId(), label: 'Community', value: slugfy('Community') },
   { id: uniqueId(), label: 'University', value: slugfy('University') },
   { id: uniqueId(), label: 'Faculty', value: slugfy('Faculty') },
   { id: uniqueId(), label: 'Conference', value: slugfy('Conference') },
   { id: uniqueId(), label: 'Event', value: slugfy('Event') },
   { id: uniqueId(), label: 'Association', value: slugfy('Association') },
   { id: uniqueId(), label: 'Other', value: slugfy('Other') }
]

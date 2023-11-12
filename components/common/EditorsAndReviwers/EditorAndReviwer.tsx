import { DocumentGetProps } from '@/services/document/getArticles'
import { truncate } from '@/utils/format_texts'
import React from 'react'
import { twMerge } from 'tailwind-merge'

export const EditorsAndReviewers: React.FC<EditorAndReviewerProps> = ({ article }: EditorAndReviewerProps) => {
   return (
      <React.Fragment>
         <div>
            {article?.document.reviewersOnDocuments && article?.document.reviewersOnDocuments.length > 0 ? (
               article?.document.reviewersOnDocuments?.map((item, index) => (
                  <div key={item.id}>
                     <div className="grid md:grid-cols-5  items-center px-0 py-3 rounded-md">
                        <div className="flex items-center gap-4">
                           <div>
                              <p className="text-sm text-secundary_blue-main font-regular">{item.reviewer.name}</p>
                           </div>
                        </div>
                        <div>
                           <p className="text-sm text-secundary_blue-main">{item.reviewer.title}</p>
                        </div>
                        <div>
                           <p className="text-sm text-secundary_blue-main">{truncate(item.reviewer.email, 16)}</p>
                        </div>
                        <div>
                           <p
                              className={twMerge(
                                 'text-sm text-secundary_blue-main first-letter:uppercase font-semibold lowercase',
                                 `${item.role == 'reviewer' && 'text-[#B07F03]'}`,
                                 `${item.role == 'editor' && 'text-terciary-main'}`
                              )}
                           >
                              {item.role}
                           </p>
                        </div>
                        <div>
                           <p
                              className={twMerge(
                                 'text-sm text-secundary_blue-main font-semibold border py-[2px] px-1 text-center rounded-md md:border-none md:py-0 md:px-0 md:rounded-none md:text-start first-letter:uppercase lowercase',
                                 `${item.inviteStatus == 'PENDING' && 'text-status-pending'}`,
                                 `${item.inviteStatus == 'ACCEPTED' && 'text-status-green'}`
                              )}
                           >
                              {item.inviteStatus}
                           </p>
                        </div>
                     </div>
                  </div>
               ))
            ) : (
               <p className="text-sm w-full text-center mt-4 text-neutral-gray">There is no editor or reviewer for this article.</p>
            )}
         </div>
      </React.Fragment>
   )
}

interface EditorAndReviewerProps {
   article: DocumentGetProps | null
}

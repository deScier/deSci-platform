import React from 'react'
import { uniqueId } from 'lodash'
import { Check, Clock, X } from 'react-bootstrap-icons'

type DocumentApprovalsProps = {
   reviewerApprovals: string[]
   editorApprovals: string[]
}

const DocumentApprovals: React.FC<DocumentApprovalsProps> = ({ editorApprovals, reviewerApprovals }: DocumentApprovalsProps) => {
   return (
      <React.Fragment>
         <div className="grid items-center md:justify-start">
            <div className="flex items-center gap-2">
               <h2 className="text-status-yellow font-semibold text-lg">Reviewer</h2>
               {reviewerApprovals?.map((item) => (
                  <>
                     {item === 'APPROVED' && (
                        <Check
                           key={uniqueId('reviewer-approval')}
                           className="w-8 h-8 hover:scale-125 transition-all duration-200 fill-status-green cursor-pointer"
                        />
                     )}

                     {item === 'REJECTED' && (
                        <X
                           key={uniqueId('reviewer-approval')}
                           className="w-8 h-8 hover:scale-125 transition-all duration-200 fill-status-error cursor-pointer"
                        />
                     )}

                     {item === 'PENDING' && (
                        <Clock
                           key={uniqueId('reviewer-approval')}
                           className="w-6 h-6 hover:scale-125 transition-all duration-200 fill-status-pending cursor-pointer"
                        />
                     )}
                  </>
               ))}
            </div>
            <div className="flex items-center gap-2">
               <h2 className="text-terciary-main font-semibold text-lg">Editor</h2>
               {editorApprovals?.map((item) => (
                  <>
                     {item === 'APPROVED' && (
                        <Check
                           key={uniqueId('reviewer-approval')}
                           className="w-8 h-8 hover:scale-125 transition-all duration-200 fill-status-green cursor-pointer"
                        />
                     )}

                     {item === 'REJECTED' && (
                        <X
                           key={uniqueId('reviewer-approval')}
                           className="w-8 h-8 hover:scale-125 transition-all duration-200 fill-status-error cursor-pointer"
                        />
                     )}

                     {item === 'PENDING' && (
                        <Clock
                           key={uniqueId('reviewer-approval')}
                           className="w-6 h-6 hover:scale-125 transition-all duration-200 fill-status-pending cursor-pointer"
                        />
                     )}
                  </>
               ))}
            </div>
         </div>
      </React.Fragment>
   )
}

export default DocumentApprovals

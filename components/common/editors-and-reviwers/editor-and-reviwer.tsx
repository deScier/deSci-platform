export { EditorsAndReviewers };
export type { EditorAndReviewerProps };

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { truncate } from '@/utils/format_texts';
import { twMerge } from 'tailwind-merge';
import { DocumentGetProps } from '@/services/document/getArticles';

import React from 'react';
/**
 * @title Editors and Reviewers Component
 * @notice This component displays the editors and reviewers associated with an article.
 * @dev The EditorsAndReviewers component receives article data and renders information about its editors and reviewers.
 */
const EditorsAndReviewers: React.FC<EditorAndReviewerProps> = ({ article }: EditorAndReviewerProps) => {
  return (
    <React.Fragment>
      <div>
        {article?.document?.reviewersOnDocuments && article?.document?.reviewersOnDocuments.length > 0 ? (
          article?.document?.reviewersOnDocuments?.map((item, index) => (
            <div key={item.id}>
              <div className="grid md:grid-cols-5  items-center px-0 py-3 rounded-md">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-secundary_blue-main font-semibold md:font-regular first-letter:uppercase">
                      {item.reviewer.name}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-secundary_blue-main first-letter:uppercase">{item.reviewer.title}</p>
                </div>
                <div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <p className="text-sm text-secundary_blue-main">{truncate(item.reviewer.email, 16)}</p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm text-secundary_blue-main">{item.reviewer.email}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
                    {item.inviteStatus == 'ACCEPTED' ? 'Invite accepted' : item.inviteStatus}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm w-full text-center mt-4 text-neutral-gray">
            There is no editor or reviewer for this article.
          </p>
        )}
      </div>
    </React.Fragment>
  );
};

interface EditorAndReviewerProps {
  article: DocumentGetProps | null;
}

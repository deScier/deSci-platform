import { truncate } from '@/utils/format_texts';
import { EditorReviewListProps } from '@components/common/Lists/EditorReview/Typing';
import { Check, Clock } from 'react-bootstrap-icons';
import { twMerge } from 'tailwind-merge';

import React from 'react';
/**
 * @title Editor Review List Component
 * @notice This component displays a list of reviewers for a given article, including their names, titles, email addresses, roles, and approval status.
 * @dev The `EditorReviewList` component is a functional React component that accepts `article` props. It uses a map function to iterate over `reviewersOnDocuments` and render individual reviewer details.
 */
export const EditorReviewList: React.FC<EditorReviewListProps> = ({ article }: EditorReviewListProps) => {
  return (
    <React.Fragment>
      <div>
        {article?.document.reviewersOnDocuments?.map((item, index) => (
          <div key={item.id}>
            <div className="grid md:grid-cols-5 items-center px-0 py-3 rounded-md">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-semibold md:font-regular text-secundary_blue-main">{item.reviewer.name}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-secundary_blue-main">{item.reviewer.title}</p>
              </div>
              <div>
                <p className="text-sm text-secundary_blue-main">{truncate(item.reviewerEmail, 16)}</p>
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
                    'hidden md:grid text-sm text-secundary_blue-main font-semibold border py-[2px] px-1 text-center rounded-md md:border-none md:py-0 md:px-0 md:rounded-none md:text-start first-letter:uppercase lowercase'
                  )}
                >
                  {item.approvedStatus === 'APPROVED' ? (
                    <Check size={24} className="fill-status-green" />
                  ) : (
                    <Clock size={24} className="fill-status-pending" />
                  )}
                </p>
                <div className="md:hidden border py-[2px] px-1 text-center rounded-md md:border-none md:py-0 md:px-0 md:rounded-none md:text-start first-letter:uppercase lowercase">
                  <p>
                    {item.approvedStatus === 'APPROVED' ? (
                      <p className="text-status-green font-semibold text-sm first-letter:uppercase">Approved</p>
                    ) : (
                      <p className="text-status-pending font-semibold text-sm first-letter:uppercase">Pending</p>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

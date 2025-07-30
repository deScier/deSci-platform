import PaginationComponent from '@/components/common/Pagination/Pagination';
import { InReviewItem } from '@/components/common/Publication/Item/InReview';
import { PublicationItem } from '@/components/common/Publication/Item/Published';
import { DocumentBasicProps } from '@/services/document/getStatistics.service';
import { addNumberSuffix } from '@/utils/format_number';
import React from 'react';
import { PublicationsProps } from './Typing';

/**
 * @title Publications Component
 * @notice This component displays a list of published and under review articles with pagination.
 */
const Publications: React.FC<PublicationsProps> = ({ pendingDocuments, publishedDocuments }: PublicationsProps) => {
  /** @dev States to toggle between published articles and articles under review */
  const [underReview, setUnderReview] = React.useState(false);
  const [publications, setPublications] = React.useState(true);

  /** @dev Constant for the number of items per page */
  const per_page = 3;

  /** @dev Pagination states for published and under review articles */
  const [page, setPage] = React.useState(1);
  const [pageReview, setPageReview] = React.useState(1);

  /** @dev States to store current page results */
  const [results, setResults] = React.useState<DocumentBasicProps[]>(publishedDocuments);
  const [resultsReview, setResultsReview] = React.useState<DocumentBasicProps[]>(pendingDocuments);

  /** @dev States for total pages in pagination */
  const [totalPages, setTotalPages] = React.useState(Math.ceil(results.length / per_page));
  const [totalPagesReview, setTotalPagesReview] = React.useState(Math.ceil(resultsReview.length / per_page));

  return (
    <React.Fragment>
      <div className="flex flex-col gap-4 h-full">
        <div className="grid md:grid-cols-2 items-start w-full h-fit">
          <button
            data-active={publications}
            className="py-2 px-4 font-semibold text-base text-[#009EAB] rounded-[32px] w-full data-[active='true']:bg-[#F1FFFF] transition-all duration-200 data-[active='false']:text-neutral-light_gray data-[active='false']:font-regular lg:text-sm 2xl:text-base select-none truncate"
            onClick={() => {
              setPublications(true);
              setUnderReview(false);
              setPage(1);
              setResults(publishedDocuments);
              setTotalPages(Math.ceil(publishedDocuments.length / per_page));
            }}
          >
            Published articles
          </button>
          <button
            data-active={underReview}
            className="py-2 px-4 font-semibold text-base text-[#FA9963] rounded-[32px] w-full data-[active='true']:bg-[#FFF4DE] transition-all duration-200 data-[active='false']:text-neutral-light_gray data-[active='false']:font-regular lg:text-sm 2xl:text-base select-none truncate"
            onClick={() => {
              setPublications(false);
              setUnderReview(true);
              setPageReview(1);
              setResultsReview(pendingDocuments);
              setTotalPagesReview(Math.ceil(pendingDocuments.length / per_page));
            }}
          >
            Under review
          </button>
        </div>
        {publications && (
          <div className="bg-[#F1FFFF] rounded-md transition-all duration-200 p-3 md:p-4 min-h-[456px] flex flex-col justify-between gap-4">
            <div className="flex-grow relative">
              {publishedDocuments?.length === 0 ? (
                <div className="flex items-center justify-center absolute top-0 left-0 w-full h-full">
                  <p className="text-neutral-gray text-center">No published articles found.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {publishedDocuments?.slice((page - 1) * per_page, page * per_page).map((item) => (
                    <React.Fragment key={item.id}>
                      <PublicationItem
                        key={item.id}
                        date={new Date(item.createdAt).toLocaleDateString('pt-BR')}
                        link={''}
                        likes={addNumberSuffix(item.likes)}
                        title={item.title}
                        views={addNumberSuffix(item.views)}
                        image={item.cover || ''}
                      />
                      <hr className="divider-h" />
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
            <div className="mx-auto my-0">
              <PaginationComponent
                key={totalPages}
                current={page}
                perPage={per_page}
                total={publishedDocuments?.length || 1}
                handleFirstPage={() => setPage(1)}
                handleNextPage={() => setPage(page + 1)}
                handlePreviousPage={() => setPage(page - 1)}
                handleLastPage={() => setPage(totalPages)}
              />
            </div>
          </div>
        )}
        {underReview && (
          <div className="bg-[#FFF4DE] rounded-md transition-all duration-200 p-3 md:p-4 min-h-[456px] flex flex-col justify-between gap-4">
            <div className="flex-grow relative">
              {pendingDocuments?.length === 0 ? (
                <div className="flex items-center justify-center absolute top-0 left-0 w-full h-full">
                  <p className="text-neutral-gray text-center">No articles under review found.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {pendingDocuments?.slice((pageReview - 1) * per_page, pageReview * per_page).map((item) => (
                    <React.Fragment key={item.id}>
                      <InReviewItem
                        key={item.id}
                        date={new Date(item.createdAt).toLocaleDateString('pt-BR')}
                        link={''}
                        title={item.title}
                        image={item.cover || ''}
                        status_editor={item.editorsApprovals >= 1 ? 'approved' : 'pending'}
                        status_reviewer={item.reviewerApprovals >= 1 ? 'approved' : 'pending'}
                        ready_to_publish={item.editorsApprovals >= 1 && item.reviewerApprovals >= 1 ? true : false}
                      />
                      <hr className="divider-h" />
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
            <div className="mx-auto my-0">
              <PaginationComponent
                perPage={per_page}
                current={pageReview}
                key={totalPagesReview}
                total={pendingDocuments?.length || 1}
                handlePreviousPage={() => setPageReview(pageReview - 1)}
                handleFirstPage={() => setPageReview(1)}
                handleLastPage={() => setPageReview(totalPagesReview)}
                handleNextPage={() => setPageReview(pageReview + 1)}
              />
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default Publications;

import { home_routes } from '@/routes/home';
import * as Button from '@components/common/Button/Button';
import '@styles/home.css';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import IllustrationBannerFooter from 'public/svgs/modules/home/banner-footer/illustrations-banner.svg';
import React from 'react';

/** @title BannerStartPublishing Component
 *  @notice This component displays a banner with options to start publishing. It includes modals for login, registration, and password recovery.
 */
export const BannerStartPublishing: React.FC<BannerStartPublishingModalProps> = ({
  onPublishNow,
}: BannerStartPublishingModalProps) => {
  /** @dev Initialize router and session status */
  const router = useRouter();
  const { status } = useSession();

  return (
    <React.Fragment>
      <div className="bg-secundary_blue-main p-6 lg:py-6 lg:px-12 flex justify-center rounded-md">
        <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-20">
          <IllustrationBannerFooter className="w-48 lg:w-60 shrink-0 mb-4 md:mb-0" />
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <p className="text-base md:text-lg font-semibold text-white">
                Want to publish a paper? Want to create a Journal?
              </p>
              <p className="text-sm md:text-base font-regular text-white">
                Publishing with DeSci Reviews is affordable, fast and easy, with rigorous peer-review and 100%
                author-owned copyright. A variety of research genres are welcome for publication; from breakthrough
                studies to interdisciplinary work. Choose DeSci Reviews, where your research meets{' '}
                <strong>blockchain-backed tech</strong>, ownership and recognition. Your ideas, your terms, your future.
              </p>
            </div>
            <div className="lg:flex space-y-4 lg:space-y-0 lg:gap-4 lg:justify-end">
              <Button.Button
                className="py-3 lg:min-w-[300px] px-10 lg:w-fit w-full text-sm lg:text-base"
                onClick={() => {
                  if (status === 'unauthenticated') {
                    onPublishNow();
                  } else {
                    router.push(home_routes.summary_routes.new_document);
                  }
                }}
              >
                Publish a paper
              </Button.Button>
              <Button.Button
                variant="outline"
                className="py-3 px-10 lg:w-fit w-full text-sm lg:text-base lg:min-w-[300px] bg-secundary-hover"
                onClick={() => {
                  if (status === 'unauthenticated') {
                    onPublishNow();
                  } else {
                    router.push(home_routes.summary_routes.new_journal);
                  }
                }}
              >
                Create a Journal
              </Button.Button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

type BannerStartPublishingModalProps = {
  onPublishNow: () => void;
};

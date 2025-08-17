import '@styles/home.css';

import { home_routes } from '@/routes/home';
import { PublicJournalsProps } from '@/services/journal/getJournals.service';
import { formatName } from '@/utils/format_texts';
import { keywordsArray } from '@/utils/keywords_format';
import { EmblaOptionsType } from 'embla-carousel';
import { motion } from 'framer-motion';
import { uniqueId } from 'lodash';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'react-bootstrap-icons';
import { DotButton, useDotButton } from './EmblaDotsButton';

import useDimension from '@/hooks/useWindowDimension';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import React from 'react';

const OurJournals: React.FC<OurJournalsProps> = ({ journals }: OurJournalsProps) => {
  const { windowDimension } = useDimension();

  const router = useRouter();

  const [hovered_curator_id, setHoveredCuratorId] = React.useState<string | null>(null);

  const OPTIONS: EmblaOptionsType = {
    loop: true,
    containScroll: 'trimSnaps',
  };

  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);

  React.useEffect(() => {
    if (windowDimension == null) return;

    if (windowDimension > 1024 && hovered_curator_id !== null) {
      setHoveredCuratorId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowDimension]);

  const [journalsCarousel, setJournalsCarousel] = React.useState<JournalForCarousel[] | undefined>(undefined);

  React.useEffect(() => {
    if (journals === undefined) return;

    let journal_for_carroussel: JournalForCarousel[] = [];

    if (windowDimension && windowDimension < 1024) {
      journal_for_carroussel = journals?.map((journal, index) => ({
        ...journal,
        id_carroussel: uniqueId(`${journal.id}_`),
      }));
    } else {
      if (journals.length >= 4) {
        journal_for_carroussel = journals
          ? journals.concat(journals).map((journal, index) => ({
              ...journal,
              id_carroussel: uniqueId(`${journal.id}_`),
            }))
          : ([] as JournalForCarousel[]);
      } else {
        journal_for_carroussel = journals.map((journal, index) => ({
          ...journal,
          id_carroussel: uniqueId(`${journal.id}_`),
        }));
      }
    }

    setJournalsCarousel(journal_for_carroussel);
  }, [journals, windowDimension]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

  if (journals?.length == 0) {
    return (
      <React.Fragment>
        <div>
          <p className="text-center text-base font-medium text-neutral-gray">There are no journals published yet.</p>
        </div>
      </React.Fragment>
    );
  }

  const handleNext = () => {
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  };

  const handlePrev = () => {
    if (emblaApi) {
      emblaApi.scrollPrev();
    }
  };

  return (
    <React.Fragment>
      <div className="flex items-center justify-between px-4 lg:px-20 2xl:px-52">
        <h3 className="text-1xl lg:text-3xl font-semibold bg-purple bg-clip-text text-transparent">Our Journals</h3>
        <div className="flex gap-4">
          <div
            className="flex w-fit items-center rounded-[32px] border border-primary-main p-2 cursor-pointer"
            onClick={() => handlePrev()}
          >
            <ChevronRight className="transform rotate-180 w-4 h-4 cursor-pointer fill-primary-main" />
          </div>
          <div
            className="flex w-fit items-center rounded-[32px] border border-primary-main p-2 cursor-pointer"
            onClick={() => handleNext()}
          >
            <ChevronRight className="w-4 h-4 cursor-pointer fill-primary-main" />
          </div>
        </div>
      </div>
      <div className="px-4 lg:px-0">
        <div className="embla">
          <div className="relative lg:w-screen" ref={emblaRef}>
            <div className="embla__container">
              {journalsCarousel &&
                journalsCarousel.map((journal) => (
                  <div
                    key={journal.id_carroussel}
                    className="embla__slide !relative flex h-[500px] lg:h-[424px] w-full flex-col overflow-x-hidden rounded-3xl bg-gray-light p-6"
                    onClick={() => {
                      if (windowDimension && windowDimension > 1024) return;
                      if (windowDimension && windowDimension < 1024) {
                        router.push(home_routes.home.search + `?term=${journal.name}&type=journal`);
                      }
                    }}
                    onMouseEnter={() => {
                      if (windowDimension && windowDimension < 1024) return;
                      setHoveredCuratorId(journal.id_carroussel);
                    }}
                    onMouseLeave={() => {
                      if (windowDimension && windowDimension < 1024) return;
                      setHoveredCuratorId(null);
                    }}
                  >
                    <div className="z-40 h-full flex flex-col justify-end pb-1">
                      <motion.h2
                        className="flex items-end justify-start font-medium text-white text-lg lg:text-xl cursor-pointer hover:underline w-fit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hovered_curator_id === journal.id_carroussel ? 1 : 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={() => {
                          router.push(home_routes.home.search + `?term=${journal.name}&type=journal`);
                        }}
                      >
                        {journal.name.length > 20 ? (
                          <React.Fragment>{formatName(journal.name)}</React.Fragment>
                        ) : (
                          <React.Fragment>{journal.name}</React.Fragment>
                        )}
                      </motion.h2>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {keywordsArray(journal.keywords)
                          .slice(0, 6)
                          .map((keyword) => (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: hovered_curator_id === journal.id_carroussel ? 1 : 0 }}
                              transition={{ duration: 0.25 }}
                              key={keyword}
                              className="z-40 border border-white rounded-full px-2 w-fit"
                            >
                              <p className="text-white text-xxs lg:text-xs">
                                {keyword.length > 30 ? formatName(keyword) : keyword}
                              </p>
                            </motion.div>
                          ))}
                      </div>
                    </div>
                    <div className="embla__slide__number">
                      <motion.div
                        className="absolute bottom-0 left-0 z-10 h-1/2 w-full rounded-[25px] bg-[linear-gradient(180deg,_rgba(112,_70,_140,_0.00)_1.65%,_#1E1326_101.65%)] lg:max-w-[316px]"
                        initial={{ height: 0 }}
                        animate={{ height: hovered_curator_id === journal.id_carroussel ? '120%' : 0 }}
                        transition={{ duration: 0.25 }}
                      />
                      <Image
                        width={800}
                        height={800}
                        alt={journal.name}
                        src={journal.cover}
                        className="absolute left-0 top-0 z-0 object-top w-full lg:w-[316px] lg:max-h-[424px] h-full rounded-3xl min-w-[316px] object-cover"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="dots-container lg:!hidden mt-6">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={`dot-button ${selectedIndex === index ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

type OurJournalsProps = {
  journals: PublicJournalsProps['journals'] | undefined;
};

type JournalForCarousel = PublicJournalsProps['journals'][0] & { id_carroussel: string };

export { OurJournals };

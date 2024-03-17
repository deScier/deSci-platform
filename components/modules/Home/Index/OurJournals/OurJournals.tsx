import '@styles/home.css'

import { PublicJournalsProps } from '@/services/journal/getJournals.service'
import { formatName } from '@/utils/format_texts'
import { keywordsArray } from '@/utils/keywords_format'
import { EmblaEventType, EmblaOptionsType } from 'embla-carousel'
import { motion } from 'framer-motion'

import useDimension from '@/hooks/useWindowDimension'
import AutoScroll from 'embla-carousel-auto-scroll'
import useEmblaCarousel from 'embla-carousel-react'
import { uniqueId } from 'lodash'
import Image from 'next/image'
import React from 'react'
import { DotButton, useDotButton } from './EmblaDotsButton'

type AutoScrollPlugin = {
   play: () => void
   stop: () => void
   isPlaying: () => boolean
}

type OurJournalsProps = {
   journals: PublicJournalsProps['journals'] | undefined
}

type JournalForCarousel = PublicJournalsProps['journals'][0] & { id_carroussel: string }

const OurJournals: React.FC<OurJournalsProps> = ({ journals }: OurJournalsProps) => {
   const { windowDimension } = useDimension()

   const [hovered_curator_id, setHoveredCuratorId] = React.useState<string | null>(null)
   const [isPlaying, setIsPlaying] = React.useState(false)

   const OPTIONS: EmblaOptionsType = {
      loop: true,
      containScroll: 'trimSnaps'
   }

   const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS, [
      AutoScroll({
         playOnInit: windowDimension && windowDimension > 1024 ? true : false,
         speed: 0.8,
         stopOnMouseEnter: true,
         startDelay: 200
      })
   ])

   React.useEffect(() => {
      if (windowDimension == null) return

      //   if (windowDimension < 1024 && hovered_curator_id == null) {
      //   }

      if (windowDimension > 1024 && hovered_curator_id !== null) {
         setHoveredCuratorId(null)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [windowDimension])

   React.useEffect(() => {
      if (!emblaApi) return

      const autoScroll = emblaApi?.plugins()?.autoScroll as unknown as AutoScrollPlugin

      if (!autoScroll) return

      const updateIsPlaying = () => setIsPlaying(autoScroll.isPlaying() as boolean)

      updateIsPlaying()

      emblaApi.on('autoScroll:play' as EmblaEventType, updateIsPlaying)
      emblaApi.on('autoScroll:stop' as EmblaEventType, updateIsPlaying)
      emblaApi.on('reInit' as EmblaEventType, updateIsPlaying)

      return () => {
         emblaApi.off('autoScroll:play' as EmblaEventType, updateIsPlaying)
         emblaApi.off('autoScroll:stop' as EmblaEventType, updateIsPlaying)
         emblaApi.off('reInit' as EmblaEventType, updateIsPlaying)
      }
   }, [emblaApi])

   React.useEffect(() => {
      const autoScroll = emblaApi?.plugins()?.autoScroll
      if (!autoScroll) return

      if (windowDimension && windowDimension < 1024) {
         ;(autoScroll.stop as () => void)()
      } else {
         if (hovered_curator_id !== null) {
            ;(autoScroll.stop as () => void)()
         } else {
            ;(autoScroll.play as () => void)()
         }
      }
   }, [emblaApi, hovered_curator_id, windowDimension])

   const [journalsCarousel, setJournalsCarousel] = React.useState<JournalForCarousel[] | undefined>(undefined)

   React.useEffect(() => {
      if (journals === undefined) return

      let journal_for_carroussel: JournalForCarousel[] = []

      if (windowDimension && windowDimension < 1024) {
         journal_for_carroussel = journals.map((journal, index) => ({
            ...journal,
            id_carroussel: uniqueId(`${journal.id}_`)
         }))
      } else {
         journal_for_carroussel = journals
            ? journals.concat(journals).map((journal, index) => ({
                 ...journal,
                 id_carroussel: uniqueId(`${journal.id}_`)
              }))
            : ([] as JournalForCarousel[])
      }

      setJournalsCarousel(journal_for_carroussel)
   }, [journals, windowDimension])

   const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)

   React.useEffect(() => {
      if (windowDimension && windowDimension < 1024 && journalsCarousel && journalsCarousel.length > 0) {
         setHoveredCuratorId(journalsCarousel[0].id_carroussel)
      }
   }, [windowDimension, journalsCarousel])

   React.useEffect(() => {
      if (!emblaApi) return

      const onSelect = () => {
         if (windowDimension && windowDimension < 1024) {
            const selectedIndex = emblaApi.selectedScrollSnap()
            if (journalsCarousel && journalsCarousel.length > 0) {
               setHoveredCuratorId(journalsCarousel[selectedIndex].id_carroussel)
            }
         }
      }

      emblaApi.on('select' as EmblaEventType, onSelect)

      return () => {
         emblaApi.off('select' as EmblaEventType, onSelect)
      }
   }, [emblaApi, journalsCarousel, windowDimension])

   return (
      <React.Fragment>
         <div className="embla">
            <div className="embla__viewport" ref={emblaRef}>
               <div className="embla__container">
                  {journalsCarousel &&
                     journalsCarousel.map((journal) => (
                        <div
                           key={journal.id_carroussel}
                           className="embla__slide !relative flex h-[464px] lg:h-[424px] w-full flex-col overflow-x-hidden rounded-3xl bg-gray-light p-6"
                           onClick={() => setHoveredCuratorId(journal.id_carroussel)}
                           onMouseEnter={() => setHoveredCuratorId(journal.id_carroussel)}
                           onMouseLeave={() => setHoveredCuratorId(null)}
                        >
                           <div className="z-40 h-full flex flex-col justify-end pb-1">
                              <motion.h2
                                 className="flex items-end justify-start font-normal text-white text-xl cursor-pointer hover:underline w-fit"
                                 initial={{ opacity: 0 }}
                                 animate={{ opacity: hovered_curator_id === journal.id_carroussel ? 1 : 0 }}
                                 transition={{ duration: 0.25 }}
                              >
                                 {journal.name.length > 25 ? (
                                    <React.Fragment>{formatName(journal.name)}</React.Fragment>
                                 ) : (
                                    <React.Fragment>{journal.name}</React.Fragment>
                                 )}
                              </motion.h2>
                              <div className="flex flex-wrap gap-2 mt-2">
                                 {keywordsArray(journal.keywords)
                                    .slice(0, 4)
                                    .map((keyword) => (
                                       <motion.div
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: hovered_curator_id === journal.id_carroussel ? 1 : 0 }}
                                          transition={{ duration: 0.25 }}
                                          key={keyword}
                                          className="z-40 border border-white rounded-full px-2 w-fit"
                                       >
                                          <p className="text-white text-xs">{keyword}</p>
                                       </motion.div>
                                    ))}
                              </div>
                           </div>
                           <div className="embla__slide__number">
                              <motion.div
                                 className="absolute bottom-0 left-0 z-10 h-1/2 w-full rounded-[25px] bg-[linear-gradient(180deg,_rgba(112,_70,_140,_0.00)_1.65%,_#1E1326_101.65%)] lg:max-w-[284px]"
                                 initial={{ height: 0 }}
                                 animate={{ height: hovered_curator_id === journal.id_carroussel ? '120%' : 0 }}
                                 transition={{ duration: 0.25 }}
                              />
                              <Image
                                 width={800}
                                 height={800}
                                 alt={journal.name}
                                 src={journal.cover}
                                 className="absolute left-0 top-0 z-0 object-cover object-center lg:w-[284px] lg:max-h-[424px] h-full rounded-3xl min-w-[284px]"
                              />
                           </div>
                        </div>
                     ))}
               </div>
            </div>
         </div>
         <div className="dots-container container flex">
            {scrollSnaps.map((_, index) => (
               <DotButton key={index} onClick={() => onDotButtonClick(index)} className={`dot-button ${selectedIndex === index ? 'active' : ''}`} />
            ))}
         </div>
      </React.Fragment>
   )
}

export { OurJournals }

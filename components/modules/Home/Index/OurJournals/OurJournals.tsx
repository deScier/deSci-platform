import '@styles/home.css'

import { EmblaEventType, EmblaOptionsType } from 'embla-carousel'
import { motion } from 'framer-motion'
import { uniqueId } from 'lodash'

import useDimension from '@/hooks/useWindowDimension'
import AutoScroll from 'embla-carousel-auto-scroll'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import DeScierJournal from 'public/images/journals/descier-journal.png'
import LongBioJournal from 'public/images/journals/longbio.png'
import React from 'react'

interface AutoScrollPlugin {
   play: () => void
   stop: () => void
   isPlaying: () => boolean
}

const OurJournals: React.FC = () => {
   const { windowDimension } = useDimension()
   const [hovered_curator_id, setHoveredCuratorId] = React.useState<string | null>(null)
   const [isPlaying, setIsPlaying] = React.useState(false)

   const OPTIONS: EmblaOptionsType = {
      loop: true,
      containScroll: 'trimSnaps'
   }

   const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS, [
      AutoScroll({
         playOnInit: true,
         speed: 0.8,
         stopOnMouseEnter: true,
         startDelay: 200
      })
   ])

   React.useEffect(() => {
      if (windowDimension == null) return

      if (windowDimension < 1024 && hovered_curator_id == null) {
         setHoveredCuratorId(curators[0].id)
      }

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

      if (hovered_curator_id !== null) {
         ;(autoScroll.stop as () => void)()
      } else {
         ;(autoScroll.play as () => void)()
      }
   }, [emblaApi, hovered_curator_id])

   return (
      <React.Fragment>
         <div className="embla">
            <div className="embla__viewport" ref={emblaRef}>
               <div className="embla__container">
                  {curators.map((curator) => (
                     <div
                        key={curator.id}
                        className="embla__slide !relative flex h-[364px] lg:h-[424px] w-full flex-col overflow-x-hidden rounded-3xl bg-gray-light p-6"
                        onClick={() => setHoveredCuratorId(curator.id)}
                        onMouseEnter={() => setHoveredCuratorId(curator.id)}
                        onMouseLeave={() => setHoveredCuratorId(null)}
                     >
                        <motion.h2
                           className="z-40 flex h-full items-end justify-start font-normal text-white text-xl"
                           initial={{ opacity: 0 }}
                           animate={{ opacity: hovered_curator_id === curator.id ? 1 : 0 }}
                           transition={{ duration: 0.25 }}
                        >
                           {curator.name}
                        </motion.h2>
                        <div className="embla__slide__number">
                           <motion.div
                              className="absolute bottom-0 left-0 z-10 h-1/2 w-full rounded-[25px] bg-[linear-gradient(180deg,_rgba(112,_70,_140,_0.00)_1.65%,_#1E1326_101.65%)] max-w-[284px]"
                              initial={{ height: 0 }}
                              animate={{ height: hovered_curator_id === curator.id ? '50%' : 0 }}
                              transition={{ duration: 0.25 }}
                           />
                           <Image
                              quality={50}
                              width={400}
                              height={400}
                              alt={curator.name}
                              src={curator.image.src}
                              className="absolute left-0 top-0 z-0 object-cover object-center w-[284px] max-h-[424px] h-full rounded-3xl min-w-[284px]"
                           />
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </React.Fragment>
   )
}

const curators = [
   {
      id: uniqueId(),
      name: 'deScier Journal',
      image: DeScierJournal
   },
   {
      id: uniqueId(),
      name: 'LongBio Journal',
      image: LongBioJournal
   },
   {
      id: uniqueId(),
      name: 'deScier Journal',
      image: DeScierJournal
   },
   {
      id: uniqueId(),
      name: 'LongBio Journal',
      image: LongBioJournal
   },
   {
      id: uniqueId(),
      name: 'deScier Journal',
      image: LongBioJournal
   },
   {
      id: uniqueId(),
      name: 'deScier Journal',
      image: DeScierJournal
   },
   {
      id: uniqueId(),
      name: 'LongBio Journal',
      image: LongBioJournal
   },
   {
      id: uniqueId(),
      name: 'deScier Journal',
      image: DeScierJournal
   },
   {
      id: uniqueId(),
      name: 'LongBio Journal',
      image: LongBioJournal
   },
   {
      id: uniqueId(),
      name: 'deScier Journal',
      image: LongBioJournal
   },
   {
      id: uniqueId(),
      name: 'deScier Journal',
      image: DeScierJournal
   },
   {
      id: uniqueId(),
      name: 'LongBio Journal',
      image: LongBioJournal
   },
   {
      id: uniqueId(),
      name: 'deScier Journal',
      image: DeScierJournal
   },
   {
      id: uniqueId(),
      name: 'LongBio Journal',
      image: LongBioJournal
   },
   {
      id: uniqueId(),
      name: 'deScier Journal',
      image: LongBioJournal
   }
]

export { OurJournals }

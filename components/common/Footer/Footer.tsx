'use client'

import { links, social_media } from '@/mock/footer_items'
import { home_routes } from '@/routes/home'
import Link from 'next/link'
import EmailIcon from 'public/svgs/common/footer/icons-footer/email.svg'
import LocationIcon from 'public/svgs/common/footer/icons-footer/location.svg'
import WhatsApp from 'public/svgs/common/footer/icons-footer/whatsapp.svg'
import LogoDeScier from 'public/svgs/common/footer/logo-de-scier-footer.svg'
import React from 'react'

/**
 * @title Footer Component
 * @notice This component renders the footer section of a web page with social media links, contact information, and copyright details.
 * @dev This React functional component uses TailwindCSS for styling and renders links to social media, contact details, and other important website links.
 */
const Footer: React.FC = () => {
   return (
      <React.Fragment>
         <footer className="bg-[#110838] grid md:grid-flow-col justify-items-center gap-8 md:gap-12 lg:gap-40 w-full h-fit py-14 px-6 md:py-14 ">
            <div className="grid gap-4 items-center justify-items-center content-center">
               <LogoDeScier className="w-full max-w-[137px] md:max-w-[160px] lg:w-32 2xl:w-40" />
               <p className="text-sm text-neutral-light_gray max-w-[20ch] text-center">© 2023 Maxi Science LLC. All rights reserved.</p>
            </div>
            <div className="grid gap-4 w-full content-start">
               <p className="text-lg font-semibold text-neutral-white">Social media</p>
               {social_media.map((item) => (
                  <Link href={item.link} target="_blank" rel="noopener noreferrer" key={item.id}>
                     <div className="flex items-center gap-6">
                        <span className="text-neutral-white">{item.icon}</span>
                        <p className="text-sm text-neutral-white font-semibold select-none hover:text-secundary-main cursor-pointer">{item.name}</p>
                     </div>
                  </Link>
               ))}
            </div>
            <div className="grid gap-4 w-full ontent-start">
               <p className="text-lg font-semibold text-neutral-white">Links</p>
               {links.map((item) => (
                  <Link href={item.link} target={item.link.includes(home_routes.home.index) ? '_self' : '_blank'} rel="noopener noreferrer" key={item.id}>
                     <div className="flex items-center gap-6">
                        <p className="text-sm text-neutral-white font-semibold select-none hover:text-secundary-main cursor-pointer">{item.name}</p>
                     </div>
                  </Link>
               ))}
            </div>
            <div className="grid gap-4 w-full content-start">
               <p className="text-lg font-semibold text-neutral-white">Contact</p>
               <Link href={'https://wa.me/50489847869'} target="_blank" rel="noopener noreferrer" className="grid gap-1">
                  <div className="flex items-center gap-2">
                     <div className="flex items-center gap-3">
                        <WhatsApp className="w-4 h-4" />
                        <p className="text-sm text-neutral-white font-semibold select-none">Whatsapp</p>
                     </div>
                  </div>
               </Link>
               <Link href={'mailto:contact@descier.science'} className="grid gap-1">
                  <div className="flex items-center gap-3">
                     <EmailIcon className="w-4 h-4" />
                     <p className="text-sm text-neutral-white font-semibold select-none">E-mail</p>
                  </div>
                  <p className="text-sm text-neutral-white font-regular select-none hover:text-secundary-main cursor-pointer">contact@descier.science</p>
               </Link>
               <Link
                  href={
                     'https://www.google.com/maps/search/Duna+0282,+Beta+District,+Pr%C3%B3spera,+Roat%C3%A1n,+Honduras/@16.3693804,-86.4741986,17z/data=!3m1!4b1?entry=ttu'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid gap-1"
               >
                  <div className="flex items-center gap-3">
                     <LocationIcon className="w-4 h-4" />
                     <p className="text-sm text-neutral-white font-semibold select-none">Address:</p>
                  </div>
                  <p className="text-sm text-neutral-white font-regular select-none hover:text-secundary-main cursor-pointer max-w-[32ch]">
                     Duna 0282, Beta District, Próspera, Roatán, Honduras
                  </p>
               </Link>
            </div>
         </footer>
      </React.Fragment>
   )
}

export default Footer

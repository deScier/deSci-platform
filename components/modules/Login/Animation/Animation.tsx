import '@styles/login.css'
import Image from 'next/image'
import deScierStamp from 'public/svgs/modules/login/selo.png'
import BlobShape from 'public/svgs/modules/login/shape.svg'
import React, { useEffect } from 'react'

/** @title LoginAnimation Component
 *  @notice This component displays an animation during the login process.
 *  @dev It includes a useEffect hook to check and play the animation.
 */
const LoginAnimation: React.FC<LoginAnimationProps> = ({ animation_key }: LoginAnimationProps) => {
   /** @dev Effect to check and play the animation */
   useEffect(() => {
      /** @dev Function to check and play the animation */
      const checkAndPlayAnimation = () => {
         /** @dev Get the SVG animation object */
         const svgatorObject = document.getElementById('animated-svg') as HTMLObjectElement

         /** @dev If the SVG object is not found, return */
         if (!svgatorObject) return

         /** @dev Get the SVG document */
         const svgatorDocument = svgatorObject.contentDocument || svgatorObject.contentWindow?.document

         /** @dev If the SVG document is not found, return */
         if (!svgatorDocument) return

         /** @dev Get the SVG element and its player */
         const svgatorElement = svgatorDocument.getElementById('descier-login-animation') as unknown as SVGElement & {
            svgatorPlayer: {
               play: () => void
            }
         }

         /** @dev If the SVG element is found, play the animation */
         if (svgatorElement) {
            svgatorElement?.svgatorPlayer?.play()
         } else {
            /** @dev If the SVG element is not found, try again after 100ms */
            setTimeout(checkAndPlayAnimation, 100)
         }
      }

      /** @dev Call the function to check and play the animation */
      checkAndPlayAnimation()
   }, [])
   return (
      <React.Fragment>
         <div className="relative overflow-hidden login-animation-container h-[23rem] md:h-auto">
            <div className="login-text">
               <div className="grid gap-2">
                  <h2 className="font-semibold text-lg md:text-xl text-neutral-white">Redefining how you publish!</h2>
                  <p className="text-sm md:text-base text-neutral-white">
                     Publish easily, economically, peer-
                     <br />
                     reviewed scientific and technical
                     <br /> papers while retaining 100% of your
                     <br /> copyright, protected by blockchain
                     <br /> technology.
                  </p>
               </div>
               <h2 className="font-semibold text-lg md:text-xl text-neutral-white">Join the DeSci movement!</h2>
            </div>
            <object
               className="login-animation"
               id="animated-svg"
               type="image/svg+xml"
               data-autoplay={true}
               data="/svgs/modules/login/deScier - Login animation (1).svg"
            />
            <BlobShape className="login-blob-shape" />
            <Image quality={100} width={172} height={172} src={deScierStamp} alt="deScier stamp" className="login-stamp" />
         </div>
      </React.Fragment>
   )
}

interface LoginAnimationProps {
   animation_key?: string | number
}

export default LoginAnimation

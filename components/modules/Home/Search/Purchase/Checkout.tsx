import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useIconRenderer } from '@/hooks/useIconRenderer'
import { payment_options } from '@/mock/payment_options'
import formatPriceInUSD from '@/utils/format_price_in_usd'
import * as Button from '@components/common/Button/Button'
import CreditCardIcon from 'public/svgs/modules/home/checkout/credit-card.svg'
import MetamaskIcon from 'public/svgs/modules/home/checkout/metamask.svg'
import React from 'react'
import { X } from 'react-bootstrap-icons'
import { twMerge } from 'tailwind-merge'

interface CheckoutProps {
   article: {
      id: string
      title: string
      date: string
      price: number
      image: string
   }
   onSetPaymentOption?: (option: string) => void
   onPurchase: () => void
   onClose: () => void
}

export const Checkout: React.FC<CheckoutProps> = ({ article, onPurchase, onSetPaymentOption, onClose }: CheckoutProps) => {
   return (
      <React.Fragment>
         <X
            className="w-8 h-8 absolute top-4 right-4 cursor-pointer hover:text-status-error transition-all duration-500 ease-out hover:scale-110 hover:rotate-180 transform"
            onClick={onClose}
         />
         <div className="flex">
            <div className="flex flex-col gap-6 py-14 px-8 w-1/2">
               <h3 className="text-xl font-semibold">Purchase document</h3>
               <Item article={article} />
               <hr className="divider-h" />
            </div>
            <hr className="divider-v h-full" />
            <div className="flex flex-col gap-6 py-14 px-8 w-1/2">
               <h3 className="text-lg font-semibold">Checkout options</h3>
               <Resume article={article} onPurchase={onPurchase} onSetPaymentOption={onSetPaymentOption} onClose={onClose} />
            </div>
         </div>
      </React.Fragment>
   )
}

interface ItemProps {
   article: CheckoutProps['article']
}

const Item: React.FC<ItemProps> = ({ article }: ItemProps) => {
   return (
      <React.Fragment>
         <div className="flex items-center gap-4">
            {/*  eslint-disable-next-line @next/next/no-img-element */}
            <img loading="lazy" src={article.image} alt="technology" className="w-20 h-20 rounded-md flex-grow-0 flex-shrink-0 object-cover" />
            <div>
               <h6 className="text-base font-semibold">{article.title}</h6>
               <p>{article.date}</p>
            </div>
         </div>
      </React.Fragment>
   )
}

interface ResumeProps extends CheckoutProps {}

const Resume: React.FC<ResumeProps> = ({ article, onPurchase, onSetPaymentOption }: ResumeProps) => {
   const mapping_icons = { credit_card: <CreditCardIcon className="w-6 h-6" />, metamask: <MetamaskIcon className="w-full h-6" /> }
   const { renderIcon } = useIconRenderer(mapping_icons)

   return (
      <React.Fragment>
         <RadioGroup
            className="flex flex-col items-start gap-4"
            defaultValue={payment_options[0].value}
            onValueChange={(value) => onSetPaymentOption && onSetPaymentOption(value)}
         >
            {payment_options.map((option) => (
               <React.Fragment key={option.id}>
                  <div
                     className={twMerge(
                        'flex items-center gap-8 py-2 px-4 border border-neutral-stroke_light rounded-md w-full',
                        option.label !== null && 'cursor-pointer',
                        option.label == null && 'bg-[#E7E7E7]'
                     )}
                  >
                     {option.label !== null && (
                        <div className=" flex items-center gap-6">
                           <RadioGroupItem value={option.value} id={option.value} />
                           <div className="flex items-center gap-2">
                              {renderIcon(option.icon)}
                              <Label htmlFor="r1">{option.label}</Label>
                           </div>
                        </div>
                     )}
                     {option.label === null && (
                        <React.Fragment>
                           <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-6">
                                 <RadioGroupItem disabled value={option.value} id={option.value} />
                                 <div className="flex items-center gap-2">{renderIcon(option.icon)}</div>
                              </div>
                              <Label className="text-[#7E7E7E]" htmlFor="r1">
                                 {option.message}
                              </Label>
                           </div>
                        </React.Fragment>
                     )}
                  </div>
               </React.Fragment>
            ))}
         </RadioGroup>
         <hr className="divider-h" />
         <h3 className="text-xl">
            Price <span className="font-semibold">{formatPriceInUSD(article.price)}</span>
         </h3>
         <Button.Button className="py-3 px-4" onClick={onPurchase}>
            Purchase document
         </Button.Button>
      </React.Fragment>
   )
}

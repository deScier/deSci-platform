'use client'

import { Dropdown } from '@/components/common/Dropdown/Dropdown'
import PaginationComponent from '@/components/common/Pagination/Pagination'
import ArticleUnderReview, { ArticleUnderReviewProps } from '@/components/common/Publication/Item/ArticlesUnderReview'
import { filter_order_by, filter_status } from '@/mock/dropdow_filter_options'
import * as Button from '@components/common/Button/Button'
import * as Input from '@components/common/Input/Input'
import * as Title from '@components/common/Title/Page'
import React from 'react'
import { Search } from 'react-bootstrap-icons'

export default function ArticlesUnderReviewPage() {
   const per_page = 8
   const [page, setPage] = React.useState(1)
   const [results, setResults] = React.useState(articles_under_review)
   const [totalPages, setTotalPages] = React.useState(Math.ceil(results.length / per_page))

   return (
      <React.Fragment>
         <Title.Root>
            <Title.Title>My articles under review</Title.Title>
         </Title.Root>
         <div className="grid gap-6">
            <div className="grid gap-6">
               <div className="flex items-center gap-2">
                  <Input.Search placeholder="Find articles with this terms" />
                  <Button.Button className="px-4 py-3 h-fit text-sm">
                     Search
                     <Search />
                  </Button.Button>
               </div>
               <div className="flex items-center gap-2">
                  <Dropdown items={filter_order_by} label="Order by:" onSelect={(value) => console.log(value)} />
                  <Dropdown
                     label="Status:"
                     className="min-w-[180px]"
                     items={filter_status}
                     onSelect={(value) => console.log(value)}
                  />
               </div>
            </div>
            <div className="grid gap-8">
               <div className="grid grid-cols-2 gap-4">
                  {results.slice((page - 1) * per_page, page * per_page).map((article) => (
                     <React.Fragment key={article.id}>
                        <ArticleUnderReview
                           title={article.title}
                           since={article.since}
                           image={article.image}
                           link={article.link}
                           status_editor={article.status_editor as 'pending' | 'approved'}
                           status_reviewer={article.status_reviewer as 'pending' | 'approved'}
                        />
                     </React.Fragment>
                  ))}
               </div>
            </div>
            <div className="flex justify-center">
               <PaginationComponent
                  key={totalPages}
                  current={page}
                  perPage={per_page}
                  total={results.length}
                  handleFirstPage={() => setPage(1)}
                  handleNextPage={() => setPage(page + 1)}
                  handlePreviousPage={() => setPage(page - 1)}
                  handleLastPage={() => setPage(totalPages)}
               />
            </div>
         </div>
      </React.Fragment>
   )
}

const articles_under_review: ArticleUnderReviewProps[] = [
   {
      id: '1',
      title: 'Blockchain and internet on the new digital era',
      since: '25/04/2023',
      link: 'https://www.google.com/1',
      status_editor: 'approved',
      status_reviewer: 'pending',
      image: 'https://random.imagecdn.app/150/150'
   },
   {
      id: '2',
      title: 'Artificial Intelligence in modern industries',
      since: '27/04/2023',
      link: 'https://www.google.com/2',
      status_editor: 'pending',
      status_reviewer: 'approved',
      image: 'https://random.imagecdn.app/150/150'
   },
   {
      id: '3',
      title: 'The future of Quantum Computing',
      since: '29/04/2023',
      link: 'https://www.google.com/3',
      status_editor: 'approved',
      status_reviewer: 'pending',
      image: 'https://random.imagecdn.app/150/150'
   },
   {
      id: '4',
      title: 'VR and AR changing the face of education',
      since: '01/05/2023',
      link: 'https://www.google.com/4',
      status_editor: 'pending',
      status_reviewer: 'approved',
      image: 'https://random.imagecdn.app/150/150'
   },
   {
      id: '5',
      title: 'How IoT is transforming cities',
      since: '03/05/2023',
      link: 'https://www.google.com/5',
      status_editor: 'approved',
      status_reviewer: 'pending',
      image: 'https://random.imagecdn.app/150/150'
   },
   {
      id: '6',
      title: 'The revolution of 5G and its impact',
      since: '05/05/2023',
      link: 'https://www.google.com/6',
      status_editor: 'pending',
      status_reviewer: 'approved',
      image: 'https://random.imagecdn.app/150/150'
   },
   {
      id: '7',
      title: 'Autonomous vehicles and the future of transportation',
      since: '07/05/2023',
      link: 'https://www.google.com/7',
      status_editor: 'approved',
      status_reviewer: 'pending',
      image: 'https://random.imagecdn.app/150/150'
   },
   {
      id: '8',
      title: 'Robotics in healthcare: Pros and Cons',
      since: '09/05/2023',
      link: 'https://www.google.com/8',
      status_editor: 'pending',
      status_reviewer: 'approved',
      image: 'https://random.imagecdn.app/150/150'
   },
   {
      id: '9',
      title: 'The era of sustainable technology',
      since: '11/05/2023',
      link: 'https://www.google.com/9',
      status_editor: 'approved',
      status_reviewer: 'pending',
      image: 'https://random.imagecdn.app/150/150'
   },
   {
      id: '10',
      title: 'Digital transformation in traditional businesses',
      since: '13/05/2023',
      link: 'https://www.google.com/10',
      status_editor: 'pending',
      status_reviewer: 'approved',
      image: 'https://random.imagecdn.app/150/150'
   },
   {
      id: '11',
      title: "The importance of cybersecurity in today's world",
      since: '15/05/2023',
      link: 'https://www.google.com/11',
      status_editor: 'approved',
      status_reviewer: 'pending',
      image: 'https://random.imagecdn.app/150/150'
   },
   {
      id: '12',
      title: 'Cloud computing: A transformative force',
      since: '17/05/2023',
      link: 'https://www.google.com/12',
      status_editor: 'pending',
      status_reviewer: 'approved',
      image: 'https://random.imagecdn.app/150/150'
   },
   {
      id: '13',
      title: 'The rise of edge computing in IoT',
      since: '19/05/2023',
      link: 'https://www.google.com/13',
      status_editor: 'approved',
      status_reviewer: 'pending',
      image: 'https://random.imagecdn.app/150/150'
   },
   {
      id: '14',
      title: 'The challenges of big data analytics',
      since: '21/05/2023',
      link: 'https://www.google.com/14',
      status_editor: 'pending',
      status_reviewer: 'approved',
      image: 'https://random.imagecdn.app/150/150'
   },
   {
      id: '15',
      title: 'Smart cities: Benefits and challenges',
      since: '23/05/2023',
      link: 'https://www.google.com/15',
      status_editor: 'approved',
      status_reviewer: 'pending',
      image: 'https://random.imagecdn.app/150/150'
   },
   {
      id: '16',
      title: 'Augmented reality in the world of marketing',
      since: '25/05/2023',
      link: 'https://www.google.com/16',
      status_editor: 'pending',
      status_reviewer: 'approved',
      image: 'https://random.imagecdn.app/150/150'
   },
   {
      id: '17',
      title: 'The promise of neural networks in AI',
      since: '27/05/2023',
      link: 'https://www.google.com/17',
      status_editor: 'approved',
      status_reviewer: 'pending',
      image: 'https://random.imagecdn.app/150/150'
   },
   {
      id: '18',
      title: 'Distributed ledger technology beyond blockchain',
      since: '29/05/2023',
      link: 'https://www.google.com/18',
      status_editor: 'pending',
      status_reviewer: 'approved',
      image: 'https://random.imagecdn.app/150/150'
   },
   {
      id: '19',
      title: 'The growth of biometric technology in security',
      since: '31/05/2023',
      link: 'https://www.google.com/19',
      status_editor: 'approved',
      status_reviewer: 'pending',
      image: 'https://random.imagecdn.app/150/150'
   },
   {
      id: '20',
      title: 'Ethical considerations in AI development',
      since: '02/06/2023',
      link: 'https://www.google.com/20',
      status_editor: 'pending',
      status_reviewer: 'approved',
      image: 'https://random.imagecdn.app/150/150'
   },
   {
      id: '21',
      title: 'The next step in drone technology',
      since: '04/06/2023',
      link: 'https://www.google.com/21',
      status_editor: 'approved',
      status_reviewer: 'pending',
      image: 'https://random.imagecdn.app/150/150'
   },
   {
      id: '22',
      title: 'Wearable tech and the health revolution',
      since: '06/06/2023',
      link: 'https://www.google.com/22',
      status_editor: 'pending',
      status_reviewer: 'approved',
      image: 'https://random.imagecdn.app/150/150'
   },
   {
      id: '23',
      title: 'The challenges of data privacy in the cloud',
      since: '08/06/2023',
      link: 'https://www.google.com/23',
      status_editor: 'approved',
      status_reviewer: 'pending',
      image: 'https://random.imagecdn.app/150/150'
   },
   {
      id: '24',
      title: 'NFTs: Beyond art and into business',
      since: '10/06/2023',
      link: 'https://www.google.com/24',
      status_editor: 'pending',
      status_reviewer: 'approved',
      image: 'https://random.imagecdn.app/150/150'
   }
]

import { home_routes } from '@/routes/home'
import { uniqueId } from 'lodash'
import RedirectIcon from 'public/svgs/common/redirect.svg'
import AboutUsIcon from 'public/svgs/common/sidebar/Icons/about-us.svg'
import AdminIcon from 'public/svgs/common/sidebar/Icons/admin.svg'
import ArticlesPurchased from 'public/svgs/common/sidebar/Icons/articles-purchased.svg'
import ArticlesIcon from 'public/svgs/common/sidebar/Icons/articles.svg'
import AsReviewerIcon from 'public/svgs/common/sidebar/Icons/as-reviewer.svg'
// import JournalIcon from 'public/svgs/common/sidebar/Icons/file-text.svg'
import HomeIcon from 'public/svgs/common/sidebar/Icons/home.svg'
import MyIPIcon from 'public/svgs/common/sidebar/Icons/my-ip.svg'
import ProfileIcon from 'public/svgs/common/sidebar/Icons/profile.svg'
import SummaryIcon from 'public/svgs/common/sidebar/Icons/summary.svg'

interface Item {
   id: string | number
   text: string | null
   icon: JSX.Element | null
   path: string | null
   divider?: boolean
   icon_end: JSX.Element | null
}

export const article_key = 'Articles purchased'
export const admin_key = 'Admin'

export const items: Item[] = [
   {
      id: uniqueId(),
      text: 'Summary',
      icon: <SummaryIcon className="w-6 fill-neutral-light_gray md:w-5 lg:w-6" />,
      path: home_routes.summary,
      icon_end: null,
      divider: false
   },
   {
      id: uniqueId(),
      text: 'Articles under Review',
      icon: <ArticlesIcon className="w-6 fill-neutral-light_gray md:w-5 lg:w-6" />,
      path: home_routes.articles_under_review,
      icon_end: null,
      divider: false
   },
   {
      id: uniqueId(),
      text: 'As Reviewer/Editor',
      icon: <AsReviewerIcon className="w-6 fill-neutral-light_gray md:w-5 lg:w-6" />,
      path: home_routes.as_reviewer,
      icon_end: null,
      divider: false
   },
   //    {
   //       id: uniqueId(),
   //       text: 'Journal',
   //       icon: <JournalIcon className="w-6 fill-neutral-light_gray md:w-5 lg:w-6" />,
   //       path: home_routes.as_reviewer,
   //       icon_end: null,
   //       divider: false
   //    },
   {
      id: uniqueId(),
      text: article_key,
      icon: <ArticlesPurchased className="w-6 fill-neutral-light_gray md:w-5 lg:w-6" />,
      path: null,
      icon_end: null,
      divider: false
   },
   {
      id: uniqueId(),
      text: '',
      icon: null,
      path: null,
      icon_end: null,
      divider: true
   },
   {
      id: uniqueId(),
      text: 'Home',
      icon: <HomeIcon className="w-6 fill-neutral-light_gray md:w-5 lg:w-6" />,
      path: home_routes.home.index,
      icon_end: null,
      divider: false
   },
   {
      id: uniqueId(),
      text: 'About us',
      icon: <AboutUsIcon className="w-6 fill-neutral-light_gray md:w-5 lg:w-6" />,
      path: 'https://descier.science',
      icon_end: <RedirectIcon className="w-4 h-4 fill-neutral-light_gray transition-all duration-200" />,
      divider: false
   },
   {
      id: uniqueId(),
      text: 'My IP',
      icon: <MyIPIcon className="w-6 fill-neutral-light_gray md:w-5 lg:w-6" />,
      path: 'https://registermaxi.io',
      icon_end: <RedirectIcon className="w-4 h-4 fill-neutral-light_gray transition-all duration-200" />,
      divider: false
   },
   {
      id: uniqueId(),
      text: admin_key,
      icon: <AdminIcon className="w-6 fill-neutral-light_gray md:w-5 lg:w-6" />,
      path: home_routes.descier.index,
      icon_end: null,
      divider: false
   },
   {
      id: uniqueId(),
      text: '',
      icon: null,
      path: null,
      icon_end: null,
      divider: true
   },
   {
      id: uniqueId(),
      text: 'Profile',
      icon: <ProfileIcon className="w-6 fill-neutral-light_gray md:w-5 lg:w-6" />,
      path: home_routes.profile,
      icon_end: null,
      divider: false
   }
]

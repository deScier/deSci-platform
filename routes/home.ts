export const home_routes = {
   summary: '/summary',
   home: {
      index: '/home',
      search: '/home/search',
      articles_details: '/home/articles-details' // :id
   },
   articles_under_review: '/articles-under-review',
   as_reviewer: '/as-reviewer',
   profile: '/profile',
   about_us: '/about',
   my_ip: '/my-ip',
   journals: '/journals',
   descier: {
      index: '/descier/articles-for-approval',
      articles_for_approval: '/descier/articles-for-approval'
   },
   articles: {
      in_review: 'articles-under-review/',
      added_as_reviewer: 'as-reviewer/'
   },
   summary_routes: {
      new_document: '/summary/new-document',
      new_journal: '/summary/new-journal'
   }
}

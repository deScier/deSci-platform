import { SearchArticlesComponent } from '@/components/pages/Search/Search';

import React from 'react';

export default function SearchArticlesPage() {
  return (
    <React.Suspense>
      <SearchArticlesComponent />
    </React.Suspense>
  );
}

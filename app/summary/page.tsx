import { SummaryComponent } from "@/components/pages/Summary/Summary";

import React from "react";

export default function SummaryPage() {
  return (
    <React.Suspense>
      <SummaryComponent />
    </React.Suspense>
  );
}

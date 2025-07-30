import PieChartComponent from "@/components/common/PieChart/PieChart";
import { home_routes } from "@/routes/home";
import * as Button from "@components/common/Button/Button";
import React from "react";
import { PlusCircle } from "react-bootstrap-icons";
import { SubmissionProps } from "./Typing";

/**
 * @title Submission Component
 * @notice This component provides a visual summary of submissions and allows for new submissions.
 */
const Submission: React.FC<SubmissionProps> = (data: SubmissionProps) => {
  return (
    <React.Fragment>
      <div className="grid gap-6 content-between w-full min-w-full lg:min-w-[254px] xl:min-w-[232px] xxl:min-w-[200px] 2xl:min-w-[242px] h-full lg:gap-12">
        <h3 className="text-xl font-[500] lg:text-lg 2xl:text-xl">Submissions</h3>
        <div className="flex flex-col justify-items-center gap-6 w-full">
          <div className="mx-auto my-0">
            <PieChartComponent
              pendingAmount={data.pendingAmount}
              publishedAmount={data.publishedAmount}
              totalDocuments={data.totalDocuments}
            />
          </div>
          <div className="grid gap-6">
            <div className="grid grid-flow-col gap-2 items-center justify-items-center">
              <div className="grid grid-flow-col items-center justify-start gap-2">
                <div className="w-3 h-3 bg-blue-light rounded-full" />
                <p className="text-sm text-secundary_blue-main">Published</p>
              </div>
              <div className="grid grid-flow-col items-center justify-start gap-2">
                <div className="w-3 h-3 bg-status-pending rounded-full" />
                <p className="text-sm font-regular ext-secundary_blue-main">Under Review</p>
              </div>
            </div>
            <hr className="h-full bg-[#dbdbdb]" />
            <Button.Link href={home_routes.summary_routes.new_document}>
              <Button.Button variant="outline" className="py-2 px-4 md:py-3">
                Submit new article
                <PlusCircle className="w-4" />
              </Button.Button>
            </Button.Link>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Submission;

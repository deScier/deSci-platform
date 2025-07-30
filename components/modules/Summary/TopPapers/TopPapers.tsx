import { PublicationItem } from "@/components/common/Publication/Item/Published";
import { addNumberSuffix } from "@/utils/format_number";
import React from "react";
import { twMerge } from "tailwind-merge";
import { TopPapersProps } from "./Typing";

/**
 * @title TopPapers Component
 * @notice This component displays the user's top papers based on likes, incorporating a scrollable list.
 */
const TopPapers: React.FC<TopPapersProps> = ({ publishedDocuments }: TopPapersProps) => {
  return (
    <React.Fragment>
      <div className="grid gap-4">
        <h3 className="text-xl font-[500] lg:text-lg 2xl:text-xl">My top papers</h3>
        <div
          className={twMerge(
            "grid gap-4 max-h-[13rem] overflow-y-scroll min-h-[188px]",
            `${publishedDocuments.length > 1 && "content-start"}`
          )}
        >
          {publishedDocuments.length === 0 ? (
            <p className="text-gray-500 text-center flex items-center justify-center">No papers found.</p>
          ) : (
            publishedDocuments
              ?.sort((a, b) => b.likes - a.likes)
              ?.map((item, index) => (
                <React.Fragment key={item.id}>
                  <div className="grid gap-4">
                    <PublicationItem
                      key={item.id}
                      date={new Date(item.createdAt).toLocaleDateString("pt-BR")}
                      link={""}
                      likes={addNumberSuffix(item.likes)}
                      title={item.title}
                      views={addNumberSuffix(item.views)}
                      image={item.cover || ""}
                    />
                    {index !== publishedDocuments.length - 1 && <hr className="divider-h" />}
                  </div>
                </React.Fragment>
              ))
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default TopPapers;

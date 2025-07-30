import { truncate } from "lodash";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CardText, Pencil } from "react-bootstrap-icons";
import { PublishedStatus } from "../../Home/Search/ArticleItem/ArticleItem";
import { ReviewerItemProps } from "./Typing";
/**
 * @title ReviewerItem Component
 * @notice This component is used to display a reviewer item with various details.
 * @dev This is a functional component in React.js using TypeScript.
 * @param since - The time since the reviewer was added.
 * @param link - The link to the reviewer's profile.
 * @param status - The current status of the reviewer.
 * @param image - The image URL of the reviewer.
 * @param title - The title of the reviewer.
 * @param added_as - The role of the reviewer (reviewer or editor).
 * @param id - The unique identifier of the reviewer.
 * @param published - The published status of the reviewer.
 * @param access_type - The access type of the reviewer.
 * @param likes - The number of likes the reviewer has received.
 * @param published_date - The date when the reviewer was published.
 * @param views - The number of views the reviewer has received.
 */
const ReviewerItem: React.FC<ReviewerItemProps> = ({
  since,
  link,
  status,
  image,
  title,
  added_as,
  id,
  published,
  access_type,
  likes,
  published_date,
  views,
}: ReviewerItemProps) => {
  return (
    <div className="grid gap-2 bg-[#fff] py-3 px-4 rounded-lg">
      <div className="grid gap-1 items-center">
        <div>
          {added_as == "reviewer" && (
            <div className="flex items-center gap-2">
              <CardText className="text-[#EFB521] lg:text-base" />
              <p className="text-sm lg:text-sm font-semibold text-[#EFB521]">Added as Reviewer</p>
            </div>
          )}
          {added_as == "editor" && (
            <div className="flex items-center gap-2">
              <Pencil className="text-terciary-main lg:text-sm" />
              <p className="text-sm lg:text-sm font-semibold text-terciary-main">Added as Editor</p>
            </div>
          )}
        </div>
        <hr className="divider-h" />
      </div>
      <div className="grid md:grid-cols-max-min-auto md:justify-start items-center gap-2 md:gap-4">
        <Image
          src={image}
          width={400}
          height={400}
          alt={title}
          style={{ objectFit: "cover" }}
          className="rounded-md w-full md:w-20 h-20"
        />
        <hr className="divider-v hidden md:block" />
        <hr className="divider-h mt-1 md:hidden" />
        <div className="grid gap-2">
          <div className="grid gap-2">
            <Link href={link}>
              <h6 className="text-sm font-semibold text-secundary_blue-main lg:text-base cursor-pointer hover:text-primary-main hover:underline transition-all duration-200">
                {truncate(title, { length: 40 })}
              </h6>
            </Link>
            {published ? (
              <React.Fragment>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-neutral-gray">Published in</p>
                  <p className="text-sm">{since}</p>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {access_type != "open" && access_type != "paid" && (
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-neutral-gray">Under review since</p>
                    <p className="text-sm">{since}</p>
                  </div>
                )}
              </React.Fragment>
            )}
          </div>
          {published ? (
            <React.Fragment>
              <PublishedStatus
                published_date={published_date as string}
                access_type={access_type}
                likes={likes}
                views={views}
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              {access_type == "open" || access_type == "paid" ? (
                <React.Fragment>
                  <PublishedStatus
                    access_type={access_type}
                    published_date={published_date as string}
                    likes={likes}
                    views={views}
                  />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className="border-[1px] rounded-md px-2 border-neutral-stroke_light w-full md:w-fit">
                    <div className="grid grid-flow-col items-center md:justify-start justify-center">
                      <div className="grid grid-flow-col gap-1 items-center">
                        {status == "APPROVED" && (
                          <p className="text-sm lg:text-sm font-semibold  text-status-green">You approved</p>
                        )}
                        {status == "PENDING" && (
                          <p className="text-sm lg:text-sm font-semibold  text-status-pending">Approval pending</p>
                        )}
                        {status == "REJECTED" && (
                          <p className="text-sm lg:text-sm font-semibold  text-status-error">Rejected</p>
                        )}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewerItem;

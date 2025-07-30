import { YouAreProps } from "@components/common/Flags/Author/Typing";
import { CardText, Person } from "react-bootstrap-icons";

import React from "react";

/**
 * @title YouAreAuthor Component
 * @notice Display a badge indicating that the user is the author of the article.
 * @dev This component shows a badge with an icon and a text label.
 */
export const YouAreAuthor: React.FC = () => {
  return (
    <React.Fragment>
      <div className="flex items-center gap-2 border border-neutral-stroke_light w-fit py-1 px-3 rounded-md">
        <Person className="text-primary-light" />
        <p className="text-xs md:text-sm text-primary-light font-semibold select-none">
          You are the Author of this article
        </p>
      </div>
    </React.Fragment>
  );
};

/**
 * @title YouAre Component
 * @notice Display a badge indicating the user's role for an article.
 * @dev Component takes a 'role' prop to display the user's role in the article.
 * @param role The role of the user in the context of the article.
 */
export const YouAre: React.FC<YouAreProps> = ({ role }: YouAreProps) => {
  return (
    <React.Fragment>
      <div className="flex items-center gap-2 border border-neutral-stroke_light w-fit py-1 px-3 rounded-md">
        <CardText className="text-[#B48E2B]" />
        <p className="text-xs md:text-sm text-[#B48E2B] font-semibold select-none">
          You are added as a {role} for this article
        </p>
      </div>
    </React.Fragment>
  );
};

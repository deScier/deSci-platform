import { addNumberSuffix } from "@/utils/format_number";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import LikesIllustration from "public/svgs/modules/statistics/likes.svg";
import StatisticsIllustration from "public/svgs/modules/statistics/statistics.svg";
import ViewsIllustration from "public/svgs/modules/statistics/views.svg";
import React from "react";
import { CaretLeft, CaretRight } from "react-bootstrap-icons";
import { twMerge } from "tailwind-merge";
import { StatisticsProps } from "./Typing";

/**
 * @title Statistics Component
 * @notice This component displays a carousel of various statistics such as total articles, likes, and views.
 */
const Statistics: React.FC<StatisticsProps> = (data: StatisticsProps) => {
  /** @dev State for managing the current slide in the carousel */
  const [currentSlide, setCurrentSlide] = React.useState(0);

  /** @dev Setting up the carousel slider with Keen Slider */
  const [sliderRef, instanceRef] = useKeenSlider({
    slides: { perView: 1, spacing: 0 },
    loop: true,
    mode: "snap",
    breakpoints: {
      "(max-width: 728px)": {},
    },
    slideChanged(s) {
      /** @dev Updates current slide based on slider change */
      const realIndex = s.track.details.rel;
      setCurrentSlide(realIndex);
    },
  });

  /** @dev Function to navigate to the previous slide */
  const handlePrevClick = () => {
    if (instanceRef) {
      instanceRef.current?.prev();
    }
  };

  /** @dev Function to navigate to the next slide */
  const handleNextClick = () => {
    if (instanceRef) {
      instanceRef.current?.next();
    }
  };

  /** @dev Array of components for each statistic to be displayed in the carousel */
  const carrousel = [
    {
      id: 1,
      component: <TotalArticles total_articles={data.totalArticlesPublished} />,
    },
    {
      id: 2,
      component: <TotalLikes total_likes={data.totalLikes} />,
    },
    {
      id: 3,
      component: <TotalViews total_views={data.totalViews} />,
    },
  ];
  return (
    <React.Fragment>
      <div className="grid content-start gap-6">
        <div className="grid grid-flow-col items-center gap-4 lg:gap-2 2xl:gap-4">
          <CaretLeft
            className="slider-arrow slider-arrow-left cursor-pointer hover:scale-125 transition-all duration-200"
            onClick={handlePrevClick}
          />
          <div ref={sliderRef} className="keen-slider h-full">
            {carrousel.map((c) => (
              <div key={c.id} className={twMerge(`keen-slider__slide slider-${c.id}`, "grid gap-4")}>
                {c.component}
              </div>
            ))}
          </div>
          <CaretRight
            className="slider-arrow slider-arrow-right cursor-pointer hover:scale-125 transition-all duration-200"
            onClick={handleNextClick}
          />
        </div>
        <div className="grid grid-flow-col justify-center gap-2 content-start">
          {carrousel.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 md:w-3 md:h-3 mx-auto ${
                index === currentSlide ? "bg-primary-main" : "bg-[#D9D9D9]"
              } rounded-sm transition-all duration-200`}
            />
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

/**
 * @title TotalArticles Component
 * @notice Displays the total number of articles published.
 */
const TotalArticles: React.FC<{ total_articles: number }> = ({ total_articles }) => {
  return (
    <div className="grid lg:grid-flow-col items-center">
      <StatisticsIllustration className="w-full max-w-[170px] md:max-w-[14rem] mx-auto my-0" />
      <div className="grid justify-items-center content-center">
        <h3 className="gradient-grad-2 font-bold text-3xl lg:text-3xl 2xl:text-5xl">
          {addNumberSuffix(total_articles)}
        </h3>
        <p className="text-lg text-secundary_blue-main md:max-w-[12ch] text-center lg:text-base 2xl:text-lg">
          Total articles published
        </p>
      </div>
    </div>
  );
};

/**
 * @title TotalLikes Component
 * @notice Displays the total number of likes on articles.
 */
const TotalLikes: React.FC<{ total_likes: number }> = ({ total_likes }) => {
  return (
    <div className="grid lg:grid-flow-col items-center">
      <LikesIllustration className="w-full max-w-[170px] md:max-w-[14rem] mx-auto my-0" />
      <div className="grid justify-items-center content-center">
        <h3 className="gradient-grad-2 font-bold text-3xl lg:text-3xl 2xl:text-5xl">{addNumberSuffix(total_likes)}</h3>
        <p className="text-lg text-secundary_blue-main md:max-w-[12ch] text-center lg:text-base 2xl:text-lg">
          Total likes on articles
        </p>
      </div>
    </div>
  );
};

/**
 * @title TotalViews Component
 * @notice Displays the total number of views on articles.
 */
const TotalViews: React.FC<{ total_views: number }> = ({ total_views }) => {
  return (
    <div className="grid lg:grid-flow-col items-center">
      <ViewsIllustration className="w-full max-w-[170px] md:max-w-[14rem] mx-auto my-0" />
      <div className="grid justify-items-center content-center">
        <h3 className="gradient-grad-2 font-bold text-3xl lg:text-3xl 2xl:text-5xl">{addNumberSuffix(total_views)}</h3>
        <p className="text-lg text-secundary_blue-main md:max-w-[12ch] text-center lg:text-base 2xl:text-lg">
          Total views on articles
        </p>
      </div>
    </div>
  );
};

export default Statistics;

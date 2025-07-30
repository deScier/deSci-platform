"use client";

import * as Dialog from "@components/common/Dialog/Digalog";

import { TruncateWithHoverCard } from "@/components/common/Truncate/TruncateWithHoverCard";
import { ArticleAcess, Badge } from "@/components/modules/Home/Search/ArticleAccess/ArticleAcess";
import { Checkout } from "@/components/modules/Home/Search/Purchase/Checkout";
import { PurchaseError } from "@/components/modules/Home/Search/Purchase/Error";
import { PurchaseProcessing } from "@/components/modules/Home/Search/Purchase/Processing";
import { PurchasedArticles } from "@/components/modules/Home/Search/Purchase/PurchasedArticles";
import { PurchaseSuccess } from "@/components/modules/Home/Search/Purchase/Success";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import { addLikeService } from "@/services/document/addLike.service";
import { downloadDocument } from "@/services/document/download.service";
import { GetDocumentPublicProps } from "@/services/document/getArticles";
import { createCheckoutService } from "@/services/payment/checkout.service";
import { capitalizeWord } from "@/utils/format_texts";
import { getArticleTypeLabel } from "@/utils/generate_labels";
import { uniqueId } from "lodash";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, HandThumbsUp, HandThumbsUpFill } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";

import ForgotPasswordModal from "@/components/modules/ForgotPassword/ForgotPassword";
import LoginModal from "@/components/modules/Login/Login";
import RegisterModal from "@/components/modules/Register/Register";
import Image from "next/image";
import Link from "next/link";
import LikedIcon from "public/svgs/common/likes/Icons/liked.svg";
import UnlikedIcon from "public/svgs/common/likes/Icons/unliked.svg";
import FacebookIcon from "public/svgs/modules/home/article-details/facebook.svg";
import LinkIcon from "public/svgs/modules/home/article-details/link.svg";
import TelegramIcon from "public/svgs/modules/home/article-details/telegram.svg";
import TwitterIcon from "public/svgs/modules/home/article-details/twitter.svg";
import WhatsAppIcon from "public/svgs/modules/home/article-details/whatsapp.svg";
import React from "react";

const login_component = "login";
const register_component = "register";
const forgot_password_component = "forgot_password";

export default function ArticleDetails({ data }: { data: GetDocumentPublicProps }) {
  const router = useRouter();

  const { data: session } = useSession();

  const [liked, setLiked] = React.useState(false);
  const [purchase, setPurchase] = React.useState({
    checkout: false,
    processing: false,
    success: false,
    error: false,
    my_articles: false,
    login: false,
  });
  const [likesAmount, setLikesAmount] = React.useState(data?.document.likes || 0);
  const [component, setComponent] = React.useState(login_component);

  const handleAddLike = async () => {
    const response = await addLikeService(data?.document.id!);
    if (!response.success) {
      toast.error("Error in add like.");
      return;
    }

    setLiked(true);
    setLikesAmount((state) => {
      return state + 1;
    });
  };

  const handlePurchase = async () => {
    if (!session) {
      setPurchase({
        ...purchase,
        processing: false,
        login: true,
      });
      return;
    }
    setPurchase({ ...purchase, checkout: false, processing: true });

    const response = await createCheckoutService(data?.document.id!);
    if (!response.success) {
      setPurchase({
        ...purchase,
        checkout: false,
        error: true,
        processing: false,
      });
    }
    setPurchase({
      ...purchase,
      checkout: false,
      processing: false,
    });

    if (typeof window !== "undefined") {
      window.open(response.checkoutUrl);
    }
  };

  const handleDownloadDocument = async () => {
    const response = await downloadDocument(data?.document.id!);

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    const url = URL.createObjectURL(response.file!);
    const link = document.createElement("a");
    link.href = url;
    link.download = data?.document.title.replace(" ", "_") + ".pdf"!;
    link.click();
    URL.revokeObjectURL(url);

    toast.success("Download will start...");
  };

  const formatAccessType = () => {
    switch (data?.document?.accessStatus) {
      case "PAID":
        return "paid";
      case "FREE":
        return "open";
      case "PURCHASED":
        return "purchased";
      case "OWNER":
        return "author";
      default:
        return "paid";
    }
  };

  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [textToCopy, setTextToCopy] = React.useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setTextToCopy(window.location.href);
    }
  }, []);

  return (
    <React.Fragment>
      <div className="grid gap-8 lg:px-20 2xl:px-52 px-4 sm:px-6">
        <div className="flex items-center gap-4 pt-8 md:pt-12">
          <ArrowLeft
            size={32}
            className="hover:scale-110 transition-all cursor-pointer"
            onClick={() => router.back()}
          />
          <h1 className="text-1xl font-semibold">Back</h1>
        </div>
        <div className="bg-white rounded-xl h-fit p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="hidden md:flex items-center gap-2">
              <Badge
                className="w-fit flex-shrink flex-grow-0"
                access_type={data?.document?.accessType as "PAID" | "FREE"}
              />
              <span className="text-black font-semibold">•</span>
              <p className="text-lg font-semibold">
                {capitalizeWord(getArticleTypeLabel(data?.document?.documentType as string) || "paper")}
              </p>
              {/* <span className="text-black font-semibold">•</span>
                     <p className="text-lg font-semibold text-primary-main">{article?.document?.field}</p> */}
            </div>
            <div className="flex flex-col md:hidden md:items-center gap-2">
              <Badge className="w-full" access_type={data?.document?.accessType as "PAID" | "FREE"} />
              <HoverCard>
                <div className="grid gap-0">
                  <HoverCardTrigger className="flex flex-col md:flex-row md:items-center gap-4 flex-1 min-w-0">
                    <p className="text-sm font-semibold text-primary-main max-w-full truncate">
                      <span className="text-black">{capitalizeWord(data?.document?.documentType || "paper")} -</span>{" "}
                      {data?.document?.field}
                    </p>
                  </HoverCardTrigger>
                </div>
                <HoverCardContent>
                  <p className="text-base text-start font-semibold text-primary-main w-full">
                    <span className="text-black">{capitalizeWord(data?.document?.documentType || "paper")} -</span>{" "}
                    {data?.document?.field}
                  </p>
                </HoverCardContent>
              </HoverCard>
              <hr className="divider-h w-full my-2" />
            </div>
            <h3 className="text-2xl md:text-3xl text-black font-bold">{data?.document?.title}</h3>
            <div className="flex flex-wrap gap-2">
              {data?.document?.keywords.split(";")?.map((tag) => (
                <div
                  className="border rounded-md border-neutral-stroke_light flex items-center px-2 py-[2px]"
                  key={uniqueId("tag")}
                >
                  <span className="text-xs md:text-sm text-primary-main">{tag}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {data?.document?.authors?.map((item, index) => (
              <React.Fragment key={uniqueId("author")}>
                <p className="text-sm text-[#5E6992]">
                  {item.name}
                  {index < (data?.document?.authors?.length || 0) - 1 && <span className="text-[#5E6992]">,</span>}
                </p>
              </React.Fragment>
            ))}
          </div>
          <div className="relative h-80 md:h-96 rounded-lg overflow-hidden">
            {data?.document?.cover ? (
              <React.Fragment>
                <Image
                  fill
                  src={data?.document?.cover}
                  alt="article-image"
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  className="object-cover"
                />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Skeleton className="relative h-80 md:h-96 rounded-lg overflow-hidden" />
              </React.Fragment>
            )}
          </div>
        </div>
        <div className="flex items-start flex-col lg:flex-row-reverse gap-8 mb-10">
          <ArticleAcess
            access_type={(data?.document?.accessType as "PAID" | "FREE") || "PAID"}
            access_status={formatAccessType()}
            date={new Date(data?.document?.publishedAt!).toLocaleDateString("pt-BR")}
            value={data?.document?.price || 0}
            onBuyDocument={() => handlePurchase()}
            onViewDocument={() => handleDownloadDocument()}
          />
          <div className="flex flex-col gap-6 bg-white rounded-xl h-fit w-full flex-grow p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="flex gap-6 items-center">
                <div className="flex items-center gap-1">
                  {liked ? (
                    <HandThumbsUpFill className="text-terciary-main w-5 h-5" />
                  ) : (
                    <HandThumbsUp className="text-terciary-main w-5 h-5" />
                  )}

                  <p className="text-lg text-neutral-gray">{likesAmount} likes</p>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="text-terciary-main w-5 h-5" />
                  <p className="text-lg text-neutral-gray">{data?.document.views || 0} views</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-lg text-neutral-gray">Share</p>
                <HoverCard open={popoverOpen}>
                  <HoverCardTrigger
                    onClick={() => {
                      setPopoverOpen(true);

                      setTimeout(() => {
                        setPopoverOpen(false);
                      }, 3000);
                    }}
                  >
                    <LinkIcon
                      className="w-6 h-6 flex shrink-0 cursor-pointer transition-all duration-200 hover:scale-110"
                      onClick={() => {
                        navigator.clipboard
                          .writeText(textToCopy)
                          .then(() => {})
                          .catch((err) => {
                            console.error("Erro ao copiar texto: ", err);
                          });
                      }}
                    >
                      Copy Link
                    </LinkIcon>
                  </HoverCardTrigger>
                  <HoverCardContent className="px-4 py-2" side="bottom">
                    <h4 className="text-xs font-semibold text-status-green">Link copied to the clipboard!</h4>
                  </HoverCardContent>
                </HoverCard>
                <div
                  onClick={() => {
                    navigator.clipboard
                      .writeText(textToCopy)
                      .then(() => {
                        window.open("https://twitter.com/compose/tweet");
                      })
                      .catch((err) => {
                        console.error("Erro ao copiar texto: ", err);
                      });
                  }}
                >
                  <TwitterIcon className="w-6 h-6 flex shrink-0 cursor-pointer transition-all duration-200 hover:scale-110" />
                </div>
                <div
                  onClick={() => {
                    navigator.clipboard
                      .writeText(textToCopy)
                      .then(() => {
                        window.open("https://www.facebook.com");
                      })
                      .catch((err) => {
                        console.error("Erro ao copiar texto:", err);
                      });
                  }}
                >
                  <FacebookIcon className="w-6 h-6 flex shrink-0 cursor-pointer transition-all duration-200 hover:scale-110" />
                </div>
                <div
                  onClick={() => {
                    navigator.clipboard
                      .writeText(textToCopy)
                      .then(() => {
                        window.open("https://web.whatsapp.com");
                      })
                      .catch((err) => {
                        console.error("Erro ao copiar texto:", err);
                      });
                  }}
                >
                  <WhatsAppIcon className="w-6 h-6 flex shrink-0 cursor-pointer transition-all duration-200 hover:scale-110" />
                </div>
                <div
                  onClick={() => {
                    navigator.clipboard
                      .writeText(textToCopy)
                      .then(() => {
                        window.open("https://web.telegram.org/a/");
                      })
                      .catch((err) => {
                        console.error("Erro ao copiar texto:", err);
                      });
                  }}
                >
                  <TelegramIcon className="w-6 h-6 flex shrink-0 cursor-pointer transition-all duration-200 hover:scale-110" />
                </div>
              </div>
            </div>
            <hr className="divider-h" />
            <div className="grid gap-1">
              <h6 className="text-base font-semibold">Authors</h6>
              <div className="flex flex-col bg-[#F6F6FF] rounded-lg px-4">
                {data?.document?.authors?.map((author, index) => (
                  <React.Fragment key={uniqueId("document-author")}>
                    <div
                      className={twMerge(
                        "flex items-center py-3 gap-4",
                        `${index != (data?.document?.authors?.length || 0) - 1 && "border-b border-neutral-stroke_light"}`
                      )}
                    >
                      <p className="text-base font-regular text-[#5E6992] w-4">{index + 1}º</p>
                      <div className="grid grid-cols-2 w-full">
                        <p className="text-base font-regular text-secundary_blue-main">{author.name}</p>
                        <p className="text-base font-regular text-secundary_blue-main">{author.title}</p>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex flex-col flex-grow">
                <p className="text-base font-semibold">Field</p>
                <p className="text-base font-regular">{data?.document?.field}</p>
              </div>
              <div className="flex flex-col flex-grow">
                <p className="text-base font-semibold">Document type</p>

                <p className="text-base font-regular">
                  {capitalizeWord(getArticleTypeLabel(data?.document?.documentType as string) || "paper")}
                </p>
              </div>
              {data?.document?.journal?.name && (
                <div className="flex flex-col flex-grow">
                  <p className="text-base font-semibold">Journal</p>
                  <p className="text-base font-regular">{capitalizeWord(data?.document?.journal.name)}</p>
                </div>
              )}
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <p className="text-base font-semibold">NFT Hash</p>
                {data?.document?.nftHash !== null && data?.document.nftHash !== undefined ? (
                  <div
                    className="truncate hover:underline cursor-copy"
                    onClick={() => {
                      if (data.document.nftHash) {
                        navigator.clipboard
                          .writeText(data?.document.nftHash)
                          .then(() => toast.success("NFT hash copied to clipboard!"))
                          .catch((err) => console.error("Error copying text: ", err));
                      }
                    }}
                  >
                    <TruncateWithHoverCard text={data?.document.nftHash} />
                  </div>
                ) : (
                  <p className="text-base text-neutral-gray">The NFT hash is not available yet.</p>
                )}
              </div>
              <div className="flex flex-col">
                <p className="text-base font-semibold">NFT Link</p>
                {data?.document.nftLink !== null && data?.document.nftLink !== undefined ? (
                  <Link
                    href={data?.document.nftLink}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate hover:underline hover:text-blue-600"
                  >
                    {data?.document.nftLink}
                  </Link>
                ) : (
                  <p className="text-base text-neutral-gray">The NFT link is not available yet.</p>
                )}
              </div>
            </div>
            <div>
              <p className="text-base font-semibold">Abstract</p>
              <p className="text-base font-regular">{data?.document?.abstract}</p>
            </div>
            {/* <div className="flex flex-col gap-2">
                     <p className="text-base font-semibold">Visual abstract</p>
                     <img loading="lazy" src={'/images/Frame 987.png'} alt="article-image" className="w-fit lg:h-72 object-contain" />
                  </div> */}
            {(data?.document?.reviewers?.length || 0) > 0 && (
              <div>
                <p className="text-base font-semibold">Editors/reviewers</p>
                <div>
                  {data?.document?.reviewers?.map((item) => (
                    <div key={uniqueId("reviewer")} className="border-b border-neutral-stroke_light">
                      <div className="grid md:grid-cols-5 gap-4  items-center px-0 py-3 rounded-md">
                        <div className="border border-neutral-stroke_light rounded px-2 w-full lg:w-28 flex items-center justify-center">
                          <p
                            className={twMerge(
                              "text-base text-secundary_blue-main first-letter:uppercase font-semibold",
                              `${item.role == "reviewer" && "text-[#B07F03]"}`,
                              `${item.role == "editor" && "text-terciary-main"}`
                            )}
                          >
                            {item.role}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-base text-secundary_blue-main">{item.name}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-base text-secundary_blue-main">{item.title}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2" onClick={handleAddLike}>
              {liked ? (
                <LikedIcon className="ml-1 w-6 h-6 cursor-pointer" />
              ) : (
                <UnlikedIcon className="ml-1 w-6 h-6 cursor-pointer" />
              )}
              <p className="text-lg cursor-pointer select-none">Like the article</p>
            </div>
          </div>
        </div>
      </div>
      <Dialog.Root
        open={
          purchase.checkout ||
          purchase.processing ||
          purchase.success ||
          purchase.error ||
          purchase.my_articles ||
          purchase.login
        }
      >
        <Dialog.Content
          className={twMerge(
            "max-w-[1024px] w-full h-fit",
            `${purchase.processing && "max-w-[600px] md:px-16 md:py-14"}`,
            `${purchase.success && "max-w-[600px] md:px-16 md:py-14"}`,
            `${purchase.error && "max-w-[600px] md:px-16 md:py-14"}`,
            `${purchase.my_articles && "max-w-[80%]"}`,
            `${purchase.login && "w-[80%] max-w-[1200px] p-0 transition-all duration-300"}`,
            component === forgot_password_component && "max-w-[554px]"
          )}
        >
          {purchase.checkout && (
            <Checkout
              article={{
                image: data?.document.cover || "https://source.unsplash.com/random/900×700/?technology",
                date: new Date(data?.document.publishedAt!).toLocaleDateString() || "",
                id: data?.document.id || "",
                price: data?.document.price || 0,
                title: data?.document.title || "",
              }}
              onPurchase={() => {
                handlePurchase();
              }}
              onClose={() => setPurchase({ ...purchase, checkout: false })}
              onSetPaymentOption={(value) => {}}
            />
          )}
          {purchase.login && component === login_component && (
            <LoginModal
              onClose={() =>
                setPurchase({
                  ...purchase,
                  login: false,
                })
              }
              noRedirect
              onForgotPassword={() => setComponent(forgot_password_component)}
              //  onLogin={() => setComponent(login_component)}
              onRegister={() => setComponent(register_component)}
            />
          )}
          {component === register_component && (
            <RegisterModal
              onBack={() => setComponent(login_component)}
              onClose={() => {
                setPurchase({
                  ...purchase,
                  login: false,
                });
                setComponent(login_component);
              }}
              onLogin={() => setComponent(login_component)}
              onRegister={() => setComponent(register_component)}
              onReturnToLogin={() => setComponent(login_component)}
            />
          )}
          {component === forgot_password_component && (
            <ForgotPasswordModal
              onBack={() => setComponent(login_component)}
              onClose={() => setComponent(login_component)}
            />
          )}
          {purchase.success && (
            <PurchaseSuccess
              onClose={() => {
                setPurchase({ ...purchase, success: false });
              }}
              onReturn={() => {
                setPurchase({ ...purchase, success: false, error: true });
              }}
            />
          )}
          {purchase.error && (
            <PurchaseError
              onClose={() => {
                setPurchase({ ...purchase, error: false });
              }}
            />
          )}
          {purchase.processing && <PurchaseProcessing />}
          {purchase.my_articles && (
            <PurchasedArticles onClose={() => setPurchase({ ...purchase, my_articles: false })} />
          )}
        </Dialog.Content>
      </Dialog.Root>
    </React.Fragment>
  );
}

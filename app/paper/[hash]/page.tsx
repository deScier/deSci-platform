import ArticleDetails from "@/app/(home)/home/search/[id]/page";

export default function Paper({ params }: { params: { hash: string } }) {
  return <ArticleDetails params={{ id: params.hash }} />;
}

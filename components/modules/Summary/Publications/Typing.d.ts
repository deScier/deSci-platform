import { DocumentBasicProps } from "@/services/document/getStatistics.service";

type PublicationsProps = {
  publishedDocuments: DocumentBasicProps[];
  pendingDocuments: DocumentBasicProps[];
};

export { PublicationsProps };

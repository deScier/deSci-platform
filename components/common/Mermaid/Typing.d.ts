import { DocumentGetProps } from "@/services/document/getArticles";

interface RenderMermaidChartProps {
  article: DocumentGetProps | null;
  chartError: boolean;
}

export { RenderMermaidChartProps };

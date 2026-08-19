import { createArticleRepository } from "@/entities/article/api/repository";
import { mockCmsAdapter } from "./mock-cms-adapter";
// Replace only this adapter during WPGraphQL rollout; consumers remain CMS agnostic.
export const articleRepository = createArticleRepository(mockCmsAdapter);

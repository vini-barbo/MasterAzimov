import { Injectable } from '@nestjs/common';
import { PubmedService } from 'src/api/pubmed/pubmed.service';

@Injectable()
export class SearchService {
    constructor(private readonly pubmedService: PubmedService) { }

    async getQTDArticles(query: string): Promise<number> {
        return Number((await this.pubmedService.fetchArticlesMeta(query)).esearchresult.count)
    }

    async getArticlesIDs(query: string, qtd: number): Promise<string[]> {
        return (await this.pubmedService.fetchArticlesMeta(query, qtd)).esearchresult.idlist
    }

    async getArticleSummary(query: string, qtd: number): Promise<any> {
        return (await this.pubmedService.fetchSummaryArticles(query, qtd))
    }
}

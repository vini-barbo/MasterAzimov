import { Injectable } from '@nestjs/common';
import { PubmedService } from 'src/api/pubmed/pubmed.service';

@Injectable()
export class SearchService {
    constructor(private readonly pubmedService: PubmedService) { }



    async getQTDArticles(query: string): Promise<number> {
        return Number((await this.pubmedService.fetchArticles(query)).esearchresult.count)
    }

    async getArticlesIDs(query: string, qtd: number): Promise<string[]> {
        return (await this.pubmedService.fetchArticles(query, qtd)).esearchresult.idlist
    }
}

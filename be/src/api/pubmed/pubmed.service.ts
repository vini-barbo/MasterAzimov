import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { IEsearch } from './types/Esearch';

@Injectable()
export class PubmedService {
    constructor(private readonly httpService: HttpService) { }

    url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi`
    params = {
        db: "pubmed",
        retmode: "json",
        key: process.env.PUBMED_API_KEY
    };

    async fetchArticles(query: string, qtd: number = 20): Promise<IEsearch> {
        try {
            const response = await lastValueFrom(
                this.httpService.get(this.url, { params: { term: query, retmax: qtd, ...this.params } })
            );
            return response.data as IEsearch;
        } catch (error) {
            throw new Error(`Failed to fetch articles: ${error.message}`);
        }
    }

    async getSummaryArticles(query: string, qtd: number = 20): Promise<IEsearch> {

        const ids = (await this.fetchArticles(query, qtd)).esearchresult.idlist

        try {
            const response = await lastValueFrom(
                this.httpService.get(this.url + ids.join(','))
            );
            return response.data as IEsearch;
        } catch (error) {
            throw new Error(`Failed to fetch articles: ${error.message}`);
        }
    }
}

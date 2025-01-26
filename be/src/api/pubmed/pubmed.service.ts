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
        retmax: 20,
        key: process.env.PUBMED_API_KEY as string
    };

    async fetchArticles(query: string): Promise<IEsearch> {

        try {
            const response = await lastValueFrom(
                this.httpService.get(this.url, { params: { term: query, ...this.params } })
            );
            return response.data as IEsearch;
        } catch (error) {
            throw new Error(`Failed to fetch articles: ${error.message}`);
        }
    }
}

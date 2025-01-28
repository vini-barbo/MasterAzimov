import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { IEsearch } from './types/IEsearch';
import { IEsummary } from './types/IEsummary';

@Injectable()
export class PubmedService {
    constructor(private readonly httpService: HttpService) { }

    urlEsearch = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi`
    urlEsummary = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi`
    params = {
        db: "pubmed",
        retmode: "json",
        key: process.env.PUBMED_API_KEY
    };

    async fetchArticlesMeta(query: string, qtd: number = 20): Promise<IEsearch> {
        try {
            const response = await lastValueFrom(
                this.httpService.get(this.urlEsearch, { params: { term: query, retmax: qtd, ...this.params } })
            );
            return response.data as IEsearch;
        } catch (error) {
            throw new Error(`Failed to fetch articles: ${error.message}`);
        }
    }

    async fetchSummaryArticles(query: string, qtd: number = 20): Promise<IEsummary> {

        const ids = (await this.fetchArticlesMeta(query, qtd)).esearchresult.idlist

        console.log('teste', ids)
        try {
            const response = await lastValueFrom(
                this.httpService.get(this.urlEsummary, { params: { term: query, ids: ids.join(','), ...this.params } })
            ).then(a => a.data);

            const teste = response.data as IEsummary

            teste.result.uids.map(m => {
                console.log(teste.result.m)
            })

            return response.data as IEsummary;


        } catch (error) {
            throw new Error(`Failed to fetch articles: ${error.message}`);
        }
    }
}

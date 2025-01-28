import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { IEsearch } from './types/IEsearch';
import { IEsummary, IEsummaryResultItem } from './types/IEsummary';

@Injectable()
export class PubmedService {
  constructor(private readonly httpService: HttpService) { }

  urlEsearch = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi`;
  urlEsummary = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi`;
  params = {
    db: 'pubmed',
    retmode: 'json',
    key: process.env.PUBMED_API_KEY,
  };

  async fetchArticlesMeta(query: string, qtd: number = 20): Promise<IEsearch> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(this.urlEsearch, { params: { term: query, retmax: qtd, ...this.params } }),
      );
      return response.data as IEsearch;
    } catch (error) {
      throw new Error(`Failed to fetch articles: ${error.message}`);
    }
  }

  async fetchSummaryArticles(query: string, qtd: number = 20): Promise<IEsummaryResultItem[]> {
    try {
      const { esearchresult } = await this.fetchArticlesMeta(query, qtd);
      const ids = esearchresult.idlist;

      if (ids.length === 0) {
        return [];
      }

      const response = await lastValueFrom(
        this.httpService.get<IEsummary>(this.urlEsummary, {
          params: {
            term: query,
            id: ids.join(','),
            ...this.params,
          },
        }),
      );

      const summaryData = response.data;

      // Criação da lista de resultados
      const summaryList = summaryData.result.uids.map((uid) => summaryData.result[uid]);

      return summaryList as IEsummaryResultItem[];
    } catch (error: any) {
      console.error('Error fetching summary articles:', error);
      throw new Error(`Failed to fetch articles: ${error.message || error}`);
    }
  }
}

import { Body, Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PubmedService } from 'src/api/pubmed/pubmed.service';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {

    constructor(private readonly searchService: SearchService) { }

    @Get('qtd')
    findQTDArticles(@Query('query') query: string): Promise<number> {
        return this.searchService.getQTDArticles(query)
    }

    @Get('ids')
    findIDArticles(
        @Query('query') query: string,
        @Query('qtd', ParseIntPipe) qtd: number
    ): Promise<string[]> {
        return this.searchService
            .getArticlesIDs(query, qtd);
    }

    findArticleSummary() { }

}

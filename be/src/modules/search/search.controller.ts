import { Controller, Get } from '@nestjs/common';
import { PubmedService } from 'src/api/pubmed/pubmed.service';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {

    constructor(private readonly searchService: SearchService) { }

    @Get('qtd')
    findQTDArticles(): Promise<number> {
        return this.searchService.getQTDArticles().then(a => Number(a.esearchresult.count)) as Promise<number>
    }

    @Get('ids')
    findIDArticles(): Promise<string[]> {
        return this.searchService.getQTDArticles().then(a => Number(a.esearchresult.idlist)) as Promise<string[]>
    }

}

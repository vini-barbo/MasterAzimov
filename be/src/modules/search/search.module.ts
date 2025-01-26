import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { PubmedModule } from 'src/api/pubmed/pubmed.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
  imports: [PubmedModule, HttpModule]
})
export class SearchModule { }

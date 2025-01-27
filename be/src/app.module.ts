import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchModule } from './modules/search/search.module';
import { PubmedModule } from './api/pubmed/pubmed.module';


@Module({
  imports: [SearchModule, PubmedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

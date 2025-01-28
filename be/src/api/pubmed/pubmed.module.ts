import { Module } from '@nestjs/common';
import { PubmedService } from './pubmed.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [PubmedService],
  imports: [HttpModule],
  exports: [PubmedService],
})
export class PubmedModule { }

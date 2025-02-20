import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesService } from './articles.service';

@NgModule({
  declarations: [],
  providers: [ArticlesService],
  imports: [CommonModule],
})
export class ApiModule {}

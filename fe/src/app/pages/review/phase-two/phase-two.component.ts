import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ArticlesService } from '../../../api/articles.service';
import { ArticleTable } from "./articles-table.component";
import { IEsummaryResultItem } from '../../../api/types/IEsummary';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-phase-two',
    templateUrl: './phase-two.component.html',
    providers: [ArticlesService],
    imports: [InputTextModule, FluidModule, ButtonModule,
        SelectModule, FormsModule, TextareaModule, ArticleTable, CommonModule],
})
export class PhaseTwoComponent implements OnInit {
    constructor(private readonly articleService: ArticlesService) { }

    formData = { text: '' };
    submittedData!: IEsummaryResultItem[];
    loadingTable: boolean = false;

    onSubmit(): void {
        this.loadingTable = true;

        this.articleService.getArticlesSummary(this.formData.text).subscribe({
            next: (response: IEsummaryResultItem[]) => {
                this.submittedData = response;
                console.log('Data fetched successfully:', response);
                this.loadingTable = false;
            },
            error: (error) => {
                console.error('Error fetching data:', error);
                this.loadingTable = false;
            },
        });
    }

    ngOnInit(): void { }
}

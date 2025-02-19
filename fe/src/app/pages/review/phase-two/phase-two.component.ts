import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ArticlesService } from '../../../api/articles.service';
import { IEsummaryResultItem } from '../../../api/types/IEsummary';
import { CommonModule } from '@angular/common';
import { ResultCard, IResultCard } from "../../../bonus/uikit/resultcard";
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
    selector: 'app-phase-two',
    templateUrl: './phase-two.component.html',
    providers: [ArticlesService],
    imports: [InputTextModule, FluidModule, ButtonModule, DatePickerModule, ToggleSwitchModule,
        SelectModule, FormsModule, TextareaModule, CommonModule, ResultCard],
})
export class PhaseTwoComponent implements OnInit {
    constructor(private readonly articleService: ArticlesService) { }


    articleSourceFoundResult: WritableSignal<IResultCard[]> = signal([
        { title: 'IEEE', iconAlt: 'IEEE', label: 'Articles', value: 23, bgColor: '#0d9467', iconUrl: 'assets/images/ieee-logo.svg', textColor: '#ffffff' },
        { title: 'PUBMED', iconAlt: 'PUBMED', label: 'Articles', value: 23, bgColor: '#5273bb', iconUrl: 'assets/images/pubmed-logo.svg', textColor: '#ffffff' },
    ]);

    formData = { text: '' };
    submittedData!: IEsummaryResultItem[];
    loading: boolean = false;

    onSubmit(): void {
        this.loading = true;

        this.articleService.getArticlesSummary(this.formData.text).subscribe({
            next: (response: IEsummaryResultItem[]) => {
                this.submittedData = response;
                console.log('Data fetched successfully:', response);
                this.loading = false;
            },
            error: (error) => {
                console.error('Error fetching data:', error);
                this.loading = false;
            },
        });
    }

    ngOnInit(): void { }
}

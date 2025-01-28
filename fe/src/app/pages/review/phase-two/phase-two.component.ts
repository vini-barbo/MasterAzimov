import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ArticlesService } from '../../../api/articles.service';
import { ApiModule } from '../../../api/api.module';

@Component({
    selector: 'app-phase-two',
    templateUrl: './phase-two.component.html',
    styleUrls: ['./phase-two.component.scss'],
    imports: [InputTextModule, FluidModule, ButtonModule, SelectModule, FormsModule, TextareaModule, ApiModule],
})
export class PhaseTwoComponent implements OnInit {
    constructor(private readonly articleService: ArticlesService) { }
    formData = { text: '' };
    submittedData: any = null;

    onSubmit(): void {
        this.articleService.getArticlesSummary(this.formData.text).subscribe({
            next: (response) => {
                this.submittedData = response;
                console.log('Data fetched successfully:', response);
            },
            error: (error) => {
                console.error('Error fetching data:', error);
            },
        });
    }

    ngOnInit(): void { }
}

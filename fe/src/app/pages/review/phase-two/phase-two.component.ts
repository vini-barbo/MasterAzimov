import { Component, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ArticlesService } from '../../../api/articles.service';
import { IEsummaryResultItem } from '../../../api/types/IEsummary';
import { CommonModule } from '@angular/common';
import { ResultCard, IResultCard } from '../../../bonus/uikit/resultcard';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-phase-two',
  template: `
    <main>
      <p-fluid class="grid md:flex-row gap-8">
        <form (ngSubmit)="onSubmit()" #textForm="ngForm">
          <div class="card grid gap-4">
            <h1>Query</h1>
            <div class="grid lg:grid-cols-4 gap-10">
              <div class="lg:col-span-3 flex flex-col justify-between">
                <h3>Date range:</h3>
                <div class="grid grid-cols-2 gap-2 lg:gap-10">
                  <div>
                    <div class="font-semibold text-xl">From :</div>
                    <p-datepicker
                      [showIcon]="true"
                      [showButtonBar]="true"
                      la></p-datepicker>
                  </div>
                  <div>
                    <div class="font-semibold text-xl">To :</div>
                    <p-datepicker
                      [showIcon]="true"
                      [showButtonBar]="true"></p-datepicker>
                  </div>
                </div>
              </div>
              <div class="flex flex-col justify-between">
                <h3>Search into:</h3>
                <div class>
                  <div class="flex items-center">
                    <p-toggleswitch />
                    <label for="checkOption3" class="ml-2">PUBMED</label>
                  </div>
                  <div class="flex items-center">
                    <p-toggleswitch />
                    <label for="checkOption3" class="ml-2">IEEE</label>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap gap-6">
              <textarea
                pTextarea
                id="address"
                name="textField"
                rows="5"
                cols="30"
                class="resize-none"
                [(ngModel)]="formData.text"
                required></textarea>
            </div>
            <p-button
              type="button"
              label="Search"
              type="submit"
              icon="pi pi-search"
              [loading]="loading" />
          </div>
        </form>
      </p-fluid>
      <p-fluid class="card grid md:flex-row gap-8">
        <h3>Preview:</h3>
        <div class="grid lg:grid-cols-2 gap-4">
          <app-resultcard
            *ngFor="let data of articleSourceFoundResult()"
            [title]="data.title"
            [value]="data.value"
            [textColor]="data.textColor"
            [bgColor]="data.bgColor"
            [label]="data.label"
            [iconUrl]="data.iconUrl"
            [iconAlt]="data.iconAlt"></app-resultcard>
        </div>

        <!-- <app-article-table
            [data]="submittedData" [loading]="loadingTable">
        </app-article-table> -->
      </p-fluid>
    </main>
  `,
  providers: [ArticlesService],
  imports: [
    InputTextModule,
    FluidModule,
    ButtonModule,
    DatePickerModule,
    ToggleSwitchModule,
    SelectModule,
    FormsModule,
    TextareaModule,
    CommonModule,
    ResultCard,
  ],
})
export class PhaseTwoComponent {
  constructor(private readonly articleService: ArticlesService) {}

  articleSourceFoundResult: WritableSignal<IResultCard[]> = signal([
    {
      title: 'IEEE',
      iconAlt: 'IEEE',
      label: 'Articles',
      value: 23,
      bgColor: '#0d9467',
      iconUrl: 'assets/images/ieee-logo.svg',
      textColor: '#ffffff',
    },
    {
      title: 'PUBMED',
      iconAlt: 'PUBMED',
      label: 'Articles',
      value: 23,
      bgColor: '#5273bb',
      iconUrl: 'assets/images/pubmed-logo.svg',
      textColor: '#ffffff',
    },
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
      error: error => {
        console.error('Error fetching data:', error);
        this.loading = false;
      },
    });
  }
}

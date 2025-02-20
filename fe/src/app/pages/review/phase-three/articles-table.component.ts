import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { FluidModule } from 'primeng/fluid';
import { IEsummaryResultItem } from '../../../api/types/IEsummary';

interface expandedRows {
  [key: string]: boolean;
}

@Component({
  selector: 'app-article-table',
  standalone: true,
  imports: [
    TableModule,
    MultiSelectModule,
    SelectModule,
    InputIconModule,
    ToggleButtonModule,
    ToastModule,
    CommonModule,
    ButtonModule,
  ],
  template: `
    <p-table
      #dt1
      [value]="data"
      dataKey="id"
      [rows]="10"
      [loading]="loading"
      [rowHover]="true"
      [showGridlines]="true"
      [paginator]="true"
      [globalFilterFields]="['name']"
      responsiveLayout="scroll">
      <ng-template #header>
        <tr>
          <th style="min-width: 12rem">
            <div class="flex justify-between items-center">
              Article name
              <p-columnFilter
                type="text"
                field="name"
                display="menu"
                placeholder="Search by name"></p-columnFilter>
            </div>
          </th>
          <th style="min-width: 12rem">
            <div class="flex justify-between items-center">
              DOI
              <p-columnFilter
                type="text"
                field="name"
                display="menu"
                placeholder="Search by name"></p-columnFilter>
            </div>
          </th>
          <th style="min-width: 12rem">
            <div class="flex justify-between items-center">
              Release date
              <p-columnFilter
                type="text"
                field="name"
                display="menu"
                placeholder="Search by name"></p-columnFilter>
            </div>
          </th>

          <th style="min-width: 12rem">
            <div class="flex justify-between items-center">
              authors
              <p-columnFilter
                type="text"
                field="name"
                display="menu"
                placeholder="Search by name"></p-columnFilter>
            </div>
          </th>
          <th style="min-width: 12rem">
            <div class="flex justify-between items-center">
              resume
              <p-columnFilter
                type="text"
                field="name"
                display="menu"
                placeholder="Search by name"></p-columnFilter>
            </div>
          </th>
          <th style="min-width: 2rem">
            <div class="flex justify-between items-center">access</div>
          </th>
        </tr>
      </ng-template>
      <ng-template #body let-article>
        <tr>
          <td>
            {{ article.title }}
          </td>
          <td>
            {{ article.elocationid.slice(4).trim() }}
          </td>
          <td>
            {{ article.pubdate }}
          </td>
          <td>
            {{ extractAuthors(article.authors) }}
          </td>
          <td>
            {{ article.title }}
          </td>
          <td>
            <p-button
              icon="pi pi-external-link"
              styleClass="flex-auto md:flex-initial whitespace-nowrap"></p-button>
          </td>
        </tr>
      </ng-template>
      <ng-template #emptymessage>
        <tr>
          <td colspan="8">No Article found.</td>
        </tr>
      </ng-template>
      <ng-template #loadingbody>
        <tr>
          <td colspan="8">Loading Article data. Please wait.</td>
        </tr>
      </ng-template>
    </p-table>
  `,
  styles: `
    .p-datatable-frozen-tbody {
      font-weight: bold;
    }

    .p-datatable-scrollable .p-frozen-column {
      font-weight: bold;
    }
  `,
  providers: [],
})
export class ArticleTable implements OnInit {
  @Input() data!: IEsummaryResultItem[];
  @Input() loading: boolean = false;

  rowGroupMetadata: any;

  expandedRows: expandedRows = {};

  activityValues: number[] = [0, 100];

  isExpanded: boolean = false;

  balanceFrozen: boolean = false;

  @ViewChild('filter') filter!: ElementRef;

  constructor() {}

  ngOnInit() {}

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  extractAuthors(authors: any) {
    return authors.map((author: any) => author.name).join(', ');
  }
}

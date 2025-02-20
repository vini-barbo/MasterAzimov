import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface IResultCard {
  title?: string | null | undefined;
  label?: string | null | undefined;
  value?: number | null | undefined;
  bgColor?: string | null | undefined;
  iconUrl?: string | null | undefined;
  iconAlt?: string | null | undefined;
  textColor?: string | null | undefined;
  loading?: boolean | null | undefined;
}

@Component({
  standalone: true,
  selector: 'app-resultcard',
  imports: [CommonModule],
  template: `
    <div class="col-span-12 lg:col-span-6 xl:col-span-3 ">
      <div class="card mb-0" [style]="'background-color:' + bgColor + '!important'">
        <div class="flex flex-row-reverse justify-between mb-4">
          <div class="flex flex-col justify-between">
            <span
              class="block  font-medium mb-4 text-white  text-xl"
              [style]="'color:' + textColor">
              {{ label || '' }}
            </span>
            <div
              class=" dark:text-surface-0 font-medium text-4xl  text-center "
              [style]="'color:' + textColor">
              {{ value || '-' }}
            </div>
          </div>

          <div class="h-20 w-28 bg-red-50 p-2 rounded-md">
            <img [src]="iconUrl" [alt]="iconAlt" class="w-full h-full" />
          </div>
        </div>
        <span class=" font-medium text-2xl " [style]="'color:' + textColor">{{ title }}</span>
      </div>
    </div>
  `,
})
export class ResultCard {
  @Input() title: string | null | undefined = '';
  @Input() label: string | null | undefined = '';
  @Input() value: number | null | undefined = null;
  @Input() bgColor: string | null | undefined = '#ffffff';
  @Input() textColor: string | null | undefined = '#000000';
  @Input() iconUrl: string | null | undefined = '';
  @Input() iconAlt: string | null | undefined = '';
  @Input() loading: boolean | null | undefined = false;
}

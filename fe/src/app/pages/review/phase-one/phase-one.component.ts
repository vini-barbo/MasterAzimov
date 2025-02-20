import { FluidModule } from 'primeng/fluid';
import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-phase-one',

  imports: [InputTextModule, FluidModule, ButtonModule, SelectModule, FormsModule, TextareaModule],
  template: `
    <main>
      <p-fluid class="grid grid-cols-1 md:flex-row gap-8">
        <form #textForm="ngForm">
          <div class="card grid grid-cols-1 gap-4">
            <h1>About</h1>
            <div class="flex flex-wrap gap-6">
              <div class="flex flex-col grow basis-0 gap-2">
                <label for="name2">Name of the project</label>
                <input pInputText id="name2" type="text" />
              </div>

              <div class="flex flex-wrap gap-2 w-full">
                <label for="state">State</label>
                <p-select
                  id="state"
                  [(ngModel)]="dropdownItem"
                  [options]="dropdownItems"
                  optionLabel="name"
                  placeholder="Select One"
                  class="w-full"></p-select>
              </div>
              <div class="flex flex-wrap gap-2 w-full">
                <label for="state">Publisher</label>
                <p-select
                  id="state"
                  [(ngModel)]="dropdownItem"
                  [options]="dropdownItems"
                  optionLabel="name"
                  placeholder="Select One"
                  class="w-full"></p-select>
              </div>
            </div>
            <div class="flex flex-wrap gap-6">
              <label for="address">Abstract</label>
              <textarea pTextarea id="address" rows="5" cols="30" class="resize-none"></textarea>
            </div>
            <p-button label="Save" />
          </div>
        </form>
      </p-fluid>
    </main>
  `,
})
export class PhaseOneComponent implements OnInit {
  dropdownItems = [
    { name: 'Review', code: 'Review' },
    { name: 'Article', code: 'Article' },
    { name: 'Thesis', code: 'Thesis' },
  ];

  dropdownItem = null;
}

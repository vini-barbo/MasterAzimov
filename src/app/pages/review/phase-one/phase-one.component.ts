import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { FluidModule } from 'primeng/fluid';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-phase-one',
    imports: [FluidModule, IconField, InputIcon, FloatLabelModule, AutoCompleteModule, DatePickerModule, InputNumberModule],
    template: ` <main>
        <p-fluid class="flex flex-col md:flex-row gap-8">
            <div class="md:w-1/2">
                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">InputText</div>
                    <div class="flex flex-col md:flex-row gap-4">
                        <input pInputText type="text" placeholder="Default" />
                        <input pInputText type="text" placeholder="Disabled" [disabled]="true" />
                        <input pInputText type="text" placeholder="Invalid" class="ng-dirty ng-invalid" />
                    </div>

                    <div class="font-semibold text-xl">Icons</div>
                    <p-iconField>
                        <p-inputicon class="pi pi-user" />
                        <input pInputText type="text" placeholder="Username" />
                    </p-iconField>
                    <p-iconfield iconPosition="left">
                        <input pInputText type="text" placeholder="Search" />
                        <p-inputIcon class="pi pi-search" />
                    </p-iconfield>

                    <div class="font-semibold text-xl">Float Label</div>
                </div>
            </div>
        </p-fluid>
    </main>`
})
export class PhaseOneComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}

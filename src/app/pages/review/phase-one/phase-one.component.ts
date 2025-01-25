import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
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
    templateUrl: './phase-one.component.html'
})
export class PhaseOneComponent implements OnInit {
    constructor() {}

    dropdownItems = [
        { name: 'Review', code: 'Review' },
        { name: 'Article', code: 'Article' },
        { name: 'Thesis', code: 'Thesis' }
    ];

    dropdownItem = null;

    ngOnInit(): void {}
}

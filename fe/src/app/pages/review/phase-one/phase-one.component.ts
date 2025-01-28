import { FluidModule } from 'primeng/fluid';
import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-phase-one',
    imports: [InputTextModule, FluidModule, ButtonModule,
        SelectModule, FormsModule, TextareaModule],
    templateUrl: './phase-one.component.html'
})
export class PhaseOneComponent implements OnInit {
    constructor() { }

    dropdownItems = [
        { name: 'Review', code: 'Review' },
        { name: 'Article', code: 'Article' },
        { name: 'Thesis', code: 'Thesis' }
    ];

    dropdownItem = null;

    ngOnInit(): void { }
}

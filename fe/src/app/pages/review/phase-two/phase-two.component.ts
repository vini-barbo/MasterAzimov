import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-phase-two',
    templateUrl: './phase-two.component.html',
    styleUrls: ['./phase-two.component.scss'],
    imports: [InputTextModule, FluidModule, ButtonModule, SelectModule, FormsModule, TextareaModule]
})
export class PhaseTwoComponent implements OnInit {
    constructor() {}

    dropdownItems = [
        { name: 'Review', code: 'Review' },
        { name: 'Article', code: 'Article' },
        { name: 'Thesis', code: 'Thesis' }
    ];

    dropdownItem = null;

    ngOnInit(): void {}
}

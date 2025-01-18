import { Component, OnInit } from '@angular/core';
import { CardComponent } from '../../../../theme/shared/components/card/card.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-phase-one',
  templateUrl: './phase-one.component.html',
  styleUrls: ['./phase-one.component.scss'],
  standalone: true,
  imports: [CardComponent, InputNumberModule, InputTextModule, FormsModule]
})
export class PhaseOneComponent implements OnInit {
  constructor() {}

  value: string = 'teste';

  ngOnInit(): void {
    console.log('not standlone');
  }
}

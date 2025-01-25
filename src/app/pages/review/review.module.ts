import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewRoutingModule } from './review-routing.module';
import { PhaseOneComponent } from './phase-one/phase-one.component';
import { PhaseTwoComponent } from './phase-two/phase-two.component';

@NgModule({
    declarations: [
    PhaseTwoComponent
  ],
    imports: [CommonModule, ReviewRoutingModule]
})
export class ReviewModule {}

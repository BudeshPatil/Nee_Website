import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectPhasesComponent } from '../components/project/project-details/project-phases.component';

@NgModule({
  declarations: [ProjectPhasesComponent],
  imports: [CommonModule],
  exports: [ProjectPhasesComponent]
})
export class SharedModule { }

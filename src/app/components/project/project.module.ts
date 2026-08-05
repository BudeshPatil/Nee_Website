import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './project.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { ProjectPhasesComponent } from './project-details/project-phases.component';


@NgModule({
  declarations: [
    ProjectComponent,
    ProjectDetailsComponent,
    ProjectPhasesComponent
  ],
  imports: [
    CommonModule,
    ProjectRoutingModule
  ]
})
export class ProjectModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectComponent } from './project.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';

const routes: Routes = [
	{
		path: '',
		component: ProjectComponent
	}, {
		path: 'project-details/:url_key',
		component: ProjectDetailsComponent,
		data: { isProject: true }

	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ProjectRoutingModule { }

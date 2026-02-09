import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { Error404Component } from './error404/error404.component';
import { AboutComponent } from './components/about/about.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { JournalComponent } from './components/journal/journal.component';
import { JournalDetailComponent } from './components/journal-detail/journal-detail.component';
import { ServicesComponent } from './components/services/services.component';

const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		data: { pageName: 'home' }
	},
	{
		path: 'about',
		component: AboutComponent,
		data: { pageName: 'about' }
	},
	{
		path: 'services',
		component: ServicesComponent,
		data: { pageName: 'services' }
	},
	{
		path: 'projects',
		component: PortfolioComponent,
		data: { pageName: 'projects' }
	},
	{
		path: 'portfolio/:category',
		component: PortfolioComponent,
		data: { pageName: 'portfolio' }
	},
	{
		path: 'journal',
		component: JournalComponent,
		data: { pageName: 'journal' }
	},
	{
		path: 'journal-detail',
		component: JournalDetailComponent,
		data: { pageName: 'journal-detail' }
	},
	{
		path: 'contact',
		loadChildren: () => import('./components/contact/contact.module').then(m => m.ContactModule)
	},
	{
		path: 'project',
		loadChildren: () => import('./components/project/project.module').then(m => m.ProjectModule)
	},
	{
		path: '**',
		component: Error404Component
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, {
		anchorScrolling: 'enabled', // enable fragment navigation
		scrollPositionRestoration: 'enabled', // restore scroll when going back
	})],
	exports: [RouterModule]
})
export class AppRoutingModule { }

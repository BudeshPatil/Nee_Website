import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
	{
		path: '',
		component: ListComponent
	},
	// {
	//   path: 'detail',
	//   component: DetailComponent
	// },
	// {
	//   path: 'detail/:url_key',
	//   component: DetailComponent
	// },
	{
		path: 'list',
		component: ListComponent
	},
	{
		path: 'list/:car_type',
		component: ListComponent
	},
	{
		path: 'search',
		component: SearchComponent
	},
	{
		path: 'search/:type',
		component: SearchComponent
	},
	{
		path: ':url_key',
		component: DetailComponent
	},
	{
		path: '**',
		component: ListComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ProductRoutingModule { }

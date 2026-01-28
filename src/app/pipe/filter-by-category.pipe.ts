import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'filterByCategory'
})
export class FilterByCategoryPipe implements PipeTransform {
	transform(projects: any[], categoryId: string): any[] {
		if (!projects || !categoryId) return [];
		return projects.filter(project => project.category_id === categoryId);
	}
}

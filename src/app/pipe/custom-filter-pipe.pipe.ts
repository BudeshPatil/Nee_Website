import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'productfilter'
})
export class CustomFilterPipePipe implements PipeTransform {

  transform(products: any[], searchText: string): any[] {
    if(!products) return [];
    if(!searchText) return products;
    return this.searchItems(products, searchText.toLowerCase());
   }
   private searchItems(products :any[], searchText): any[] {
     let results = [];
     if(products && products.length > 0 ){
      products.forEach(it => {
        if (it.name.toLowerCase().includes(searchText) || it.sku.toLowerCase().includes(searchText)) {
            results.push(it);
        } else {
          let searchResults =  this.searchItems(it.items_containers, searchText);
          if (searchResults.length > 0) {
              results.push({
                name: it.name,
                items_containers: searchResults
              });
          }
        }
      });
     }
      return results;
   }

}

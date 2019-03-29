import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface TableItem {
  grade: string;
  scoreRange: string;
}

// TODO: replace this with real data from your application
// const EXAMPLE_DATA: TableItem[] = [
//  id: 1, name: 'Hydrogen' },
//  id: 2, name: 'Helium' },
//  id: 3, name: 'Lithium' },
//  id: 4, name: 'Beryllium' },
//  id: 5, name: 'Boron' },
//  id: 6, name: 'Carbon' },
//  id: 7, name: 'Nitrogen' },
//  id: 8, name: 'Oxygen' },
//  id: 9, name: 'Fluorine' },
//  id: 10, name: 'Neon' },
//  id: 11, name: 'Sodium' },
//  id: 12, name: 'Magnesium' },
//  id: 13, name: 'Aluminum' },
//  id: 14, name: 'Silicon' },
//  id: 15, name: 'Phosphorus' },
//  id: 16, name: 'Sulfur' },
//  id: 17, name: 'Chlorine' },
//  id: 18, name: 'Argon' },
//  id: 19, name: 'Potassium' },
//  id: 20, name: 'Calcium' },
// ];
const SCORE_CHART: TableItem[] = [
  { scoreRange: '0-5', grade: 'Perfect' },
  { scoreRange: '5-10', grade: 'Excellent' },
  { scoreRange: '10-15', grade: 'Great' },
  { scoreRange: '15-20', grade: 'Very Good' },
  { scoreRange: '20-25', grade: 'Good' },
  { scoreRange: '25-30', grade: 'Okay' },
  { scoreRange: '30-35', grade: 'Almost' },
  { scoreRange: '35-40', grade: 'Not Too Good' },
  { scoreRange: '40+', grade: 'No Effort' },
];

/**
 * Data source for the Table view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TableDataSource extends DataSource<TableItem> {
  data: TableItem[] = SCORE_CHART;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<TableItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.data),
      // this.paginator.page,
      // this.sort.sortChange,
    ];

    // Set the paginator's length
    // this.paginator.length = this.data.length;

    return merge(...dataMutations).pipe(
      map(() => {
        // return this.getPagedData(this.getSortedData([...this.data]));
        return this.data;
      })
    );
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  // private getPagedData(data: TableItem[]) {
  // const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
  // return data.splice(startIndex, this.paginator.pageSize);
  // }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  // private getSortedData(data: TableItem[]) {
  //   if (!this.sort.active || this.sort.direction === '') {
  //     return data;
  //   }

  //   return data.sort((a, b) => {
  //     const isAsc = this.sort.direction === 'asc';
  //     switch (this.sort.active) {
  //       case 'grade':
  //         return compare(a.grade, b.grade, isAsc);
  //       case 'scoreRange':
  //         return compare(+a.scoreRange, +b.scoreRange, isAsc);
  //       default:
  //         return 0;
  //     }
  //   });
  // }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

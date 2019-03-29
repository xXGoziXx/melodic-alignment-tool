import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { TableDataSource } from './table-datasource';

@Component({
  selector: 'mat-data-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  dataSource: TableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['scoreRange', 'grade'];

  ngOnInit() {
    this.dataSource = new TableDataSource();
  }
}

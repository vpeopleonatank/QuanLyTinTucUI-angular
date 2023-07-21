import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleListConfig } from 'src/app/core/models/article-list-config.model';
import { MatTableDataSource } from '@angular/material/table';
import { LoadingState } from 'src/app/core/models/loading-state.model';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ArticlesService } from 'src/app/core/services/article.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import { MatSort } from '@angular/material/sort';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-article-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatPaginatorModule,
    RouterLink
  ],
  templateUrl: './article-management.component.html',
  styleUrls: ['./article-management.component.scss'],
})
export class ArticleManagementComponent implements OnInit {
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['title', 'action'];
  loading = LoadingState.NOT_LOADED;
  query!: ArticleListConfig;
  limit!: number;
  currentPage = 0;
  destroy$ = new Subject<void>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog,
    private articlesService: ArticlesService
  ) {}

  ngOnInit(): void {
    this.query = {
      type: 'all',
      filters: {},
    };
    this.runQuery();
  }

  runQuery() {
    this.loading = LoadingState.LOADING;

    // Create limit and offset filter (if necessary)
    if (this.limit) {
      this.query.filters.limit = this.limit;
      this.query.filters.offset = this.currentPage;
    }

    this.articlesService
      .query(this.query)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.loading = LoadingState.LOADED;

        this.dataSource = new MatTableDataSource(data.articles);
        // this.dataSource.sort = this.sort;
        this.paginator.length = data.articlesCount;

        // this.paginator.pageSize = this.query.filters.PageSize;
        // this.dataSource.paginator = this.paginator;
      });
  }

  setPageTo(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.runQuery();
  }
}

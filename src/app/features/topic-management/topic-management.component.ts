import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { LoadingState } from 'src/app/core/models/loading-state.model';
import { TopicListConfig } from 'src/app/core/models/topic-list-config.model';
import { TopicService } from 'src/app/core/services/topic.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AddEditTopicComponent } from '../add-edit-topic/add-edit-topic.component';
import { DeleteTopicComponent } from '../delete-topic/delete-topic.component';

@Component({
  selector: 'app-topic-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './topic-management.component.html',
  styleUrls: ['./topic-management.component.scss'],
})
export class TopicManagementComponent implements OnInit {
  dataSource!: MatTableDataSource<any>;
  addButtonPressed: Subject<boolean> = new Subject();
  displayedColumns: string[] = ['topicId', 'topicName', 'action'];
  loading = LoadingState.NOT_LOADED;
  query!: TopicListConfig;
  currentPage = 1;
  limit!: number;
  destroy$ = new Subject<void>();

  constructor(private _dialog: MatDialog, private topicService: TopicService) {}

  ngOnInit(): void {
    this.query = {
      type: 'all',
      filters: {},
    };
    this.runQuery();
  }

  openAddEditDeviceForm() {
    const dialogRef = this._dialog.open(AddEditTopicComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          // this.addButtonPressed.next(true);
          this.runQuery();
        }
      },
    });
  }

  runQuery() {
    this.loading = LoadingState.LOADING;

    // Create limit and offset filter (if necessary)
    if (this.limit) {
      this.query.filters.PageSize = this.limit;
      this.query.filters.PageNumber = this.currentPage;
    }

    this.topicService
      .query(this.query)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.loading = LoadingState.LOADED;

        this.dataSource = new MatTableDataSource(data.topics);
        // this.dataSource.sort = this.sort;
        // this.paginator.length = data.devicesCount;

        // this.paginator.pageSize = this.query.filters.PageSize;
        // this.dataSource.paginator = this.paginator;
      });
  }

  openEditForm(data: any) {

    const dialogRef = this._dialog.open(AddEditTopicComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.runQuery();
        }
      },
    });
  }

  deleteDevice(data: number) {
    const dialogRef = this._dialog.open(DeleteTopicComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.topicService.delete(val)
            .subscribe({
              next: () => {
                this.runQuery();

              },
              error: () => {

              }
            })
        }
      },
    });
  }
}

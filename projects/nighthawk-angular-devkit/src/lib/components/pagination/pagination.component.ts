import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ChangeDetectorRef,
  SimpleChanges,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'nighthawk-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class NighthawkPaginationComponent implements AfterViewInit {
  @Input() currentPage: number = 1;
  @Input() totalItems: number = 420;
  @Input() itemsPerPage: number = 20;

  public totalPages: number = 21;
  public isPaginationCreated: boolean = false;

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  public visiblePages: number[] = [];

  constructor(private readonly cdRef: ChangeDetectorRef) {}

  public ngAfterViewInit(): void {
    this.createPagination();
  }
  
  public ngOnChanges(changes: SimpleChanges): void {
    this.createPagination();
  }

  public createPagination(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

    if (this.totalPages <= 3) {
      this.visiblePages = Array.from(
        { length: this.totalPages },
        (_, i) => i + 1
      );
    } else if (this.currentPage <= 2) {
      this.visiblePages = [1, 2, 3];
    } else if (this.currentPage >= this.totalPages - 1) {
      this.visiblePages = [
        this.totalPages - 2,
        this.totalPages - 1,
        this.totalPages,
      ];
    } else {
      this.visiblePages = [
        this.currentPage - 1,
        this.currentPage,
        this.currentPage + 1,
      ];
    }

    this.isPaginationCreated = true;
    this.cdRef.detectChanges();
  }

  public goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.pageChange.emit(pageNumber);
      this.currentPage = pageNumber;
      this.createPagination();
    }
  }

  public prevPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  public nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }
}

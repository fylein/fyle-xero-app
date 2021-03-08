import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {
  pageSize: number;
  @Input() page: number;
  @Input() isLoading: boolean;
  @Input() count: number;
  @Input() coloumnArray: string[];
  @Output() getMappings = new EventEmitter<any>();

  constructor(private storageService: StorageService) {}

  getParentMappings() {
    console.log(this.page)
    const that = this;
    const data = {
      pageSize: that.pageSize,
      pageNumber: that.page
    };
    that.getMappings.emit(data);
  }
 
  onPageChange(event) {
    const that = this;
    if (that.pageSize !== event.pageSize) {
        that.storageService.set('mappings.pageSize', event.pageSize);
    }
    
    that.pageSize = event.pageSize;
    that.page = event.pageIndex;
    that.getParentMappings();
  }

  ngOnInit() {
    const that = this;
    that.pageSize = that.storageService.get('mappings.pageSize') || 1;
    that.page = 0;
  }

}

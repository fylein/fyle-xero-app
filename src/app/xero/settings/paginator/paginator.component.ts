import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
    selector: 'app-paginator',
    templateUrl: './paginator.component.html',
    styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {
    pageNumber: number;
    pageSize: number;
    multiplier: number;
    tableDimension: number;
    @Input() isLoading: boolean;
    @Input() count: number;
    @Input() coloumnArray: string[];
    @Output() getMappings = new EventEmitter<object>();

    constructor(private storageService: StorageService, private route: ActivatedRoute) {}

    getParentMappings() {
        const that = this;
        const data = {
            pageSize: that.multiplier * that.pageSize,
            pageNumber: that.pageNumber,
            tableDimension: that.tableDimension
        };
        that.getMappings.emit(data);
    }

    onPageChange(event) {
        const that = this;
        if (that.pageSize !== event.pageSize) {
            that.storageService.set('mappings.pageSize', event.pageSize);
        }
        that.pageSize = event.pageSize;
        that.pageNumber = event.pageIndex;
        that.getParentMappings();
    }


    ngOnInit() {
        const that = this;
        that.route.params.subscribe(val => {
            that.pageSize = that.storageService.get('mappings.pageSize') || 50;
            that.pageNumber = 0;
            that.multiplier = that.coloumnArray.includes('ccc') ? 2 : 1;
            that.tableDimension = that.coloumnArray.includes('ccc') ? 3 : 2;
        });
    }
}

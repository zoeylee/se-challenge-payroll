import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges, DoCheck } from '@angular/core';
import * as _ from 'lodash';
import { Pager } from '../../../providers/models/pager.model';


@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnInit, DoCheck {
  @Input() newPager: Pager = {
                pageItems: [],
                pageNo : 1,
                pageSize: 30,
                totalCount: 0,
                totalPages: 0
            };
  @Input() searchText: string = '';
  @Output() pageChanged = new EventEmitter<any>();

  public pager: Pager = {
      pageItems: [],
      pageNo : 1,
      pageSize: 30,
      totalCount: 0,
      totalPages: 0
  }
  
  constructor() {}

  ngOnInit() {
    this.pager = this.getPager(this.newPager);
  }
  
  ngDoCheck() {
    if(!_.isEqual(this.newPager, this.pager)) {
      this.pager = this.getPager(this.newPager);
    }
  }

  getPager(pager: Pager) {
    let startPage: number, endPage: number;
    let totalPages = Math.ceil(pager.totalCount / pager.pageSize);

    if (totalPages <= 3) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (pager.pageNo <= 2) {
        startPage = 1;
        endPage = 3;
      } else if (pager.pageNo + 1 >= totalPages) {
        startPage = totalPages - 2;
        endPage = totalPages;
      } else {
        startPage = pager.pageNo - 1;
        endPage = pager.pageNo + 1;
      }
    }
    let pageItems = _.range(startPage, endPage + 1);

    return {
      pageNo: pager.pageNo,
      pageSize: pager.pageSize,
      totalCount: pager.totalCount,
      pageItems: pageItems,
      totalPages: totalPages,
    }
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager.pageNo = page;
    let pageNo = this.pager.pageNo;
    let searchText = this.searchText;
    this.pageChanged.emit({ pageNo, searchText });
  }
}

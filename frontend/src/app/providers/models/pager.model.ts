export interface Pager {
  pageItems: Array<number>;
  pageNo: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
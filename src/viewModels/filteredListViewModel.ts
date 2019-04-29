import { SortingDirection } from "@src/data/sortingDirection";
import { IPagingFilter } from "@src/data/types";
import { attachAutomaticDirtyWatcher } from "@src/dirtycheck";
import { IHasDirtyWatcher } from "@src/dirtycheck/types";
import bound from "@src/helpers/bound";
import { Omit } from "@src/helpers/types";
import { action, observable } from "mobx";
import ListViewModel from "./listViewModel";

export default abstract class FilteredListViewModel<TEntity, TFilter> extends ListViewModel<TEntity> {
  @observable filter: TFilter & IHasDirtyWatcher<TFilter>;
  @observable pagingFilter: IPagingFilter;

  // we need to cache applied filter so that when the user changes filter but does not Load and changes page instead, the original filter is used
  protected appliedFilter: Omit<TFilter, keyof IHasDirtyWatcher<TFilter>>;

  constructor() {
    super();

    this.initFilter();
  }

  @action.bound applyFilter() {
    const { __dirtycheck, ...actualFilter } = this.filter;
    __dirtycheck.reset();

    this.appliedFilter = actualFilter;
    this.pagingFilter.offset = 0;
  }

  @bound applyFilterAndLoad() {
    this.applyFilter();
    this.loadData();
  }

  @action.bound resetFilter() {
    this.resetFilterValues(this.filter);
    this.applyFilter();
  }

  @bound resetFilterAndLoad() {
    this.resetFilter();
    this.loadData();
  }

  protected abstract loadData(): void | Promise<any>;
  protected abstract resetFilterValues(filter: TFilter): void;

  private initFilter() {
    this.pagingFilter = {
      offset: 0,
      limit: 30,
      sortColumn: null,
      sortDirection: SortingDirection.Ascending,
    };

    const filter = {} as any;
    this.resetFilterValues(filter);
    attachAutomaticDirtyWatcher(filter, true);
    this.filter = filter;
  }
}

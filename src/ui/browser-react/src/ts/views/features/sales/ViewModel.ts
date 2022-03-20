
import { ViewModelBase } from '../../shared/ViewModelBase'
import { SalesEntryQueryResult, SalesEntryQueryService, getLogger } from 'model-client';
export { SalesEntryQueryResult, getLogger };

export type TransitionName = ('loading' | 'loaded');
const logger = getLogger('sales-entry-viewmodel');

export class ViewModel extends ViewModelBase<ViewModel> {
  private readonly _service = new SalesEntryQueryService();

  private constructor(seriesName: string, observeTransition: (vw: ViewModel) => void, transitionName?: string) {
    super(seriesName, observeTransition, transitionName);
  }

  public static createNew(observeTransition: (vw: ViewModel) => void): ViewModel {
    return (new ViewModel('sales-entry', observeTransition));
  }
  
  protected override create(seriesName: string, observeTransition: (vw: ViewModel) => void, transitionName: string): ViewModel {
    return (new ViewModel(seriesName, observeTransition, transitionName));
  }

  public get result(): SalesEntryQueryResult {
    return (this.state['result'] || null);
  }

  public load = async () => {
    const next = this.setNext('loading');

    const get = async () => {
      const result = (await next._service.get());
      logger(`query result fetched (${result.data.length})`);
      next.setNext('loaded', { result });
    }

    get();
  }
}
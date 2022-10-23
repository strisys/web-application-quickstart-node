
import { ViewModelBase, isBrowser } from '../../shared/ViewModelBase';
import { SalesEntryQueryResult, SalesEntryQueryService, KV, getLogger } from 'model-client';
export { SalesEntryQueryResult, getLogger };
export type { KV };
export { isBrowser }

export type TransitionName = ('start' | 'loading' | 'loaded');
const logger = getLogger('sales-entry-viewmodel');

export const regionSortMap: { [key: string]: number } = {
  'North America': 0,
  'Europe': 1,
  'Austrailia': 2,
  'South America': 3,
  'Asia': 4,
  'Africa': 5,
};

export type ContextChangedStatus = ('loading' | 'loaded');

export class ContextChangedEventData {
  constructor(public status: ContextChangedStatus, public context: KV, public result: SalesEntryQueryResult = null) {
  }

  public get isLoading(): boolean {
    return (this.status === 'loading');
  }

  public get isLoaded(): boolean {
    return (this.status === 'loaded');
  }
}

export type ContextChanged = (state: ContextChangedEventData) => void;

export class MasterViewModel extends ViewModelBase<MasterViewModel> {
  private readonly _service = new SalesEntryQueryService();
  private _listener: ContextChanged;
  private _context: KV;

  private constructor(seriesName: string, observeTransition: (vw: MasterViewModel) => void, transitionName?: string) {
    super(seriesName, observeTransition, transitionName);
  }

  public static createNew(observeTransition: (vw: MasterViewModel) => void): MasterViewModel {
    return (new MasterViewModel('sales-entry-master', observeTransition));
  }

  protected override create(seriesName: string, observeTransition: (vw: MasterViewModel) => void, transitionName: string): MasterViewModel {
    return (new MasterViewModel(seriesName, observeTransition, transitionName));
  }

  public isTransitionOneOf(...transitions: TransitionName[]): boolean {
    return super.isTransitionOneOf(transitions);
  }

  public get result(): SalesEntryQueryResult {
    return (this.state['result'] || null);
  }

  public get context() {
    return (this._context || {});
  }

  public set context(value: KV) {
    this._context = value;
    logger(`context set: ${JSON.stringify(value)}`)

    if (this._listener) {
      this._listener(new ContextChangedEventData('loading', value));
    }

    const tryRaiseEvent = async () => {
      if (this._listener) {
        this._listener(new ContextChangedEventData('loaded', value, (await this._service.get(value))));
      }
    }

    const timeoutHandle = setTimeout(() => {
      clearTimeout(timeoutHandle);
      tryRaiseEvent();
    }, 500);

  }

  public registerContextChanged(fn: ContextChanged) {
    this._listener = fn;
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
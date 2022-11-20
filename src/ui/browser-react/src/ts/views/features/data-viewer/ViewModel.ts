
import { ViewModelBase, isBrowser } from '../../shared/ViewModelBase'
import { ReportEntryRepository, ReportEntry, IReportEntryBaseState, setProperty, getLogger as createLogger } from 'model-client';
export { ReportEntry, setProperty, isBrowser };

export type TransitionName = ('genesis' | 'loading' | 'loaded' | 'processing');
export const MODULE_NAME = 'task-management';

export const getLogger = (componentName: string) => {
  return createLogger(`${componentName}-viewmodel`)
}

const logger = getLogger(`viewmodel`);

export class ViewModel extends ViewModelBase<ViewModel> {
  private readonly _repository = new ReportEntryRepository();

  private constructor(seriesName: string, observeTransition: (vw: ViewModel) => void, transitionName?: string) {
    super(seriesName, observeTransition, transitionName);
  }

  public static createNew(observeTransition: (vw: ViewModel) => void): ViewModel {
    return (new ViewModel(MODULE_NAME, observeTransition));
  }

  protected override create(seriesName: string, observeTransition: (vw: ViewModel) => void, transitionName: string): ViewModel {
    return (new ViewModel(seriesName, observeTransition, transitionName));
  }

  public isTransitionOneOf(...transitions: TransitionName[]): boolean {
    return super.isTransitionOneOf(transitions);
  }

  public get details(): Array<IReportEntryBaseState> {
    return (this.state['details'] || []);
  }

  public get current(): ReportEntry {
    return (this.state['current'] || []);
  }

  public load = async (): Promise<void> => {
    const next = this.setNext('loading');
    const details = (await next._repository.getDetails());
    logger(`details fetched (${details.length})`);

    let current = {};

    if (details && details.length) {
      current = (await next._repository.get(details[0].name, details[0].version));
      logger(`current fetched (${current})`);
    }

    next.setNext('loaded', { details, current });
  }

  public setCurrent = async (id: string): Promise<void> => {
    const details: Array<IReportEntryBaseState> = this.state['details'];
    const detail: IReportEntryBaseState = details.find((d) => id === d.id);

    const current = (await this._repository.get(detail.name, detail.version));
    this.setNext('loaded', { details, current });
  }
}
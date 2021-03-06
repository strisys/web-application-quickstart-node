
import { ViewModelBase } from '../../shared/ViewModelBase'
import { TaskRepository, Task, getLogger } from 'model-client';
export { getLogger };

export type TransitionName = ('loading' | 'searching' | 'search-complete');
const logger = getLogger('search-management-viewmodel');

export class ViewModel extends ViewModelBase<ViewModel> {
  private readonly _repository = new TaskRepository();

  private constructor(seriesName: string, observeTransition: (vw: ViewModel) => void, transitionName?: string) {
    super(seriesName, observeTransition, transitionName);
  }

  public static createNew(observeTransition: (vw: ViewModel) => void): ViewModel {
    return (new ViewModel('search-management', observeTransition));
  }
  
  protected override create(seriesName: string, observeTransition: (vw: ViewModel) => void, transitionName: string): ViewModel {
    return (new ViewModel(seriesName, observeTransition, transitionName));
  }

  public get entities(): Task[] {
    return (this.state['entities'] || []);
  }

  public load = async () => {
    const next = this.setNext('loading');

    const get = async () => {
      const entities = (await next._repository.get());
      logger(`entities fetched (${entities.length})`);
      next.setNext('loaded', { entities });
    }
  }
}
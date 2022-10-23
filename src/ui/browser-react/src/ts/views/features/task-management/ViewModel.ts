
import { ViewModelBase } from '../../shared/ViewModelBase'
import { TaskRepository, Task, getLogger } from 'model-client';
export { Task, getLogger };

export type TransitionName = ('genesis' | 'loading' | 'loaded' | 'mark-complete' | 'processing');
const logger = getLogger('task-management-viewmodel');

export class ViewModel extends ViewModelBase<ViewModel> {
  private readonly _repository = new TaskRepository();

  private constructor(seriesName: string, observeTransition: (vw: ViewModel) => void, transitionName?: string) {
    super(seriesName, observeTransition, transitionName);
  }

  public static createNew(observeTransition: (vw: ViewModel) => void): ViewModel {
    return (new ViewModel('task-management', observeTransition));
  }

  protected override create(seriesName: string, observeTransition: (vw: ViewModel) => void, transitionName: string): ViewModel {
    return (new ViewModel(seriesName, observeTransition, transitionName));
  }

  public isTransitionOneOf(...transitions: TransitionName[]): boolean {
    return super.isTransitionOneOf(transitions);
  }

  public get entities(): Task[] {
    return (this.state['entities'] || []);
  }

  public load = async () => {
    const next = this.setNext('loading');

    const exec = async () => {
      const entities = (await next._repository.get());
      logger(`entities fetched (${entities.length})`);
      next.setNext('loaded', { entities });
    }

    // simulate long running process
    const delay = 1500;

    const handle = setTimeout(() => {
      clearTimeout(handle);
      exec();
    }, delay);
  }

  public markComplete(entity: Task) {
    const next = this.setNext('processing');

    const exec = async () => {
      const result = (await next._repository.deleteOne(entity));
      logger(`delete complete (${JSON.stringify(result.state)})`);

      const entities = (await next._repository.get());
      next.setNext('mark-complete', { entities });
    }

    exec();
  }
}
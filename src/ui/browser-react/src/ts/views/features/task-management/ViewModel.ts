
import { ViewModelBase } from '../../shared/ViewModelBase'
import { TaskRepository, Task, setProperty, getLogger as createLogger } from 'model-client';
export { Task, setProperty };

export type TransitionName = ('genesis' | 'loading' | 'loaded' | 'mark-complete' | 'add-task' | 'processing');
export const MODULE_NAME = 'task-management';

export const getLogger = (componentName: string) => {
  return createLogger(`${componentName}-viewmodel`)
}

const logger = getLogger(`viewmodel`);

export class ViewModel extends ViewModelBase<ViewModel> {
  private readonly _repository = new TaskRepository();

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
    const delay = 1000;

    const handle = setTimeout(() => {
      clearTimeout(handle);
      exec();
    }, delay);
  }

  public async post(entity: Task): Promise<Task> {
    const next = this.setNext('processing');

    const result = (await next._repository.post(entity));
    logger(`post complete (${JSON.stringify(result)})`);

    const entities = (await next._repository.get());
    next.setNext('loaded', { entities });

    return result[0];
  }

  public async markComplete(entity: Task): Promise<Task> {
    const next = this.setNext('processing');

    const result = (await next._repository.deleteOne(entity));
    logger(`delete complete (${JSON.stringify(result.state)})`);

    const entities = (await next._repository.get());
    next.setNext('mark-complete', { entities });

    return entity;
  }
}
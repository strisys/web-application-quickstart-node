
import { ViewModelBase } from '../../shared/ViewModelBase'
import { TaskRepository, Task, getLogger } from 'model-client';
export { Task, getLogger };

export type TransitionName = ('loading' | 'loaded' | 'mark-complete');
const seriesName = 'task-viewmodel';
const logger = getLogger(seriesName);

export class ViewModel extends ViewModelBase<ViewModel> {
  private readonly _repository = new TaskRepository();

  public constructor(observeTransition: (vw: ViewModel) => void, transitionName?: string) {
    super(seriesName, observeTransition, transitionName);
  }

  public get entities(): Task[] {
    return (this.state['entities'] || []);
  }

  protected override create(transitionName: string): ViewModel {
    return (new ViewModel(null, transitionName));
  }

  public load = async () => {
    const next = this.setNext('loading');

    const get = async () => {
      const entities = (await next._repository.get());
      logger(`entities fetched (${entities.length})`);
      next.setNext('loaded', { entities });
    }

    // simulate long running process
    const delay = 1500;

    const handle = setTimeout(() => {
      clearTimeout(handle);  
      get();    
    }, delay);
  }

  public markComplete(entity: Task) {
    const entities = this.entities.filter((value: Task) => { 
      return (value.id !== entity.id);
    });

    this.setNext('mark-complete', { entities });
  }
}
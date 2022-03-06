import { getLogger } from 'model-client';

interface IDiposable {
  dispose(): void;
}

export type KeyValuePairType = { [key:string]: any };

const logger = getLogger('shared-viewmodelbase');
const seriesMap = new Map<string, any>();

export abstract class ViewModelBase<V extends ViewModelBase<V>> implements IDiposable {
  protected _state: KeyValuePairType = {};
  private readonly _seriesName: string;
  protected _observeTransition: (vw: V) => void = null;
  private _isDisposed = false;
  private _transitionName: string;
  private _version = 0;
    
  protected constructor(seriesName: string, observeTransition: (vw: V) => void, transitionName: string = 'start') {
    if (!seriesName) {
      throw new Error(`Failed to instantiate view model.  No series name specified.  The series name is used to validate objects created in a sequence as state transitions need to be in order.`);
    }

    this._seriesName = seriesName.trim().toLowerCase();
    this._transitionName = (transitionName || 'unknown').trim().toLowerCase();
    this._observeTransition = observeTransition;

    if (!seriesMap.has(seriesName)) {
      seriesMap.set(seriesName, this);
    }

    logger(`creating view model (series:=${this._seriesName}, transition:=${this._transitionName}) ...`);
  }

  protected raiseTransitionNotification = (): void => {
    const target = this;

    const handle = setTimeout(async () => {
      clearTimeout(handle);

      if (target.isDisposed) {
        return;
      }

      logger(`raising transition notification (transition:=${target.transitionName}, vm:=${target})`);
      target._observeTransition(target.cast());
    })
  }

  protected abstract create(transitionName?: string): V;

  private cast(): V {
    return ((this as unknown) as V);
  }

  protected tryMergeState = (currentState: KeyValuePairType, newState: KeyValuePairType) => {
    if (!newState) {
      return;
    }

    Object.keys(newState).forEach((k) => {
      currentState[k] = newState[k];
    });
  }

  protected setNext = (transitionName: string, newState?: KeyValuePairType): V => {
    if (this.isDisposed) {
      throw Error(`Failed to set state for next view model in series.  The view model from which a state transition was attempted is disposed (${this})`);
    }

    const nextVal = this.createNext(transitionName);
    logger(`setting state on next view model in series (transition:=${transitionName}) ...`);    
    nextVal.tryMergeState(nextVal._state, newState)
    nextVal.raiseTransitionNotification();

    return nextVal;
  }

  public tickle = (): void => {
    this.setNext('tickle');
  }

  public get transitionName(): string {
    return (this._transitionName || 'unknown').trim().toLowerCase();
  }

  public isTransitionOneOf(transitions: (string | string[])): boolean {
    return ((Array.isArray(transitions)) ? transitions.includes(this.transitionName) : (transitions === this.transitionName));
  }

  protected get state(): KeyValuePairType {
    return (this._state || {});
  }

  public get version(): number {
    return this._version;
  }

  private validateTransition = (next: V): V => {
    const expected = seriesMap.get(this._seriesName);

    if (this._version === expected._version) {
      return next;
    }

    throw new Error(`Failed to transition to the next view model in series. Cannot transition from current view model since its NOT the latest version (current:=${this._version}, expected:=${expected._version}).`)
  }

  protected createNext = (transitionName: string): V => {
    const next = this.validateTransition(this.create(transitionName));
    const prev = this;

    next._state = { ...(prev._state || {}) };
    next._transitionName = (transitionName || 'unknown').trim().toLowerCase();
    next._observeTransition = prev._observeTransition;
    next._version = (prev._version + 1);
    seriesMap.set(prev._seriesName, next);

    logger(`creating current view model (previous:=${prev._version}, next:=${next._version})`);
    prev.dispose();

    return next;
  }

  public get isDisposed() {
    return this._isDisposed;
  }

  public toString(): string {
    return `transition:=${this._transitionName}, version:=${this._version}, disposed:=${this._isDisposed}`
  }

  public dispose(): void {
    const handle = setTimeout(() => {
      clearTimeout(handle);
      logger(`disposing view model (${this})`)

      this._isDisposed = true;
      this._state = {};
      this._observeTransition = null;      
    })
  }
}
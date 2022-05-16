import { isBrowser, isMobile } from 'react-device-detect';
import { getLogger } from 'model-client';
export { getLogger, isBrowser, isMobile };

interface IDiposable {
  dispose(): void;
}

export type KeyValuePairType = { [key:string]: any };

export type Genesis = ('genesis');
export const GENESIS: Genesis = 'genesis';

const logger = getLogger('shared-viewmodelbase');

const seriesHeadMap = new Map<string, any>();
let seriesCounter = 0;

export abstract class ViewModelBase<V extends ViewModelBase<V>> implements IDiposable {
  protected _state: KeyValuePairType = {};
  private readonly _seriesName: string;
  protected _observeTransition: (vw: V) => void = null;
  private _isDisposed = false;
  private _isSeriesGenesis: boolean;
  private _transitionName: string;
  private _version = 0;
    
  protected constructor(seriesName: string, observeTransition: (vw: V) => void, transitionName: (string | Genesis) = GENESIS) {
    if (!seriesName) {
      throw new Error(`Failed to instantiate view model.  No series name specified.  The series name is used to validate objects created in a sequence as state transitions need to be in order.`);
    }

    this._transitionName = (transitionName || GENESIS).trim().toLowerCase();
    this._isSeriesGenesis = (this._transitionName === GENESIS);
    this._observeTransition = observeTransition;
    this._seriesName = seriesName;

    if (this._isSeriesGenesis) {
      this._seriesName = `${seriesName}-${++seriesCounter}`;
      logger(`tracking new series (series:=${this._seriesName}) ...`);
    }

    seriesHeadMap.set(this._seriesName, this);
    logger(`creating view model (series:=${this._seriesName}, isSeriesGenesis:=${this._isSeriesGenesis}, transition:=${this._transitionName}) ...`);
  }

  protected raiseTransitionNotification = (): void => {
    const target = this;

    const handle = setTimeout(async () => {
      clearTimeout(handle);

      if (target.isDisposed) {
        return;
      }

      logger(`raising transition notification (series:=${this._seriesName}, transition:=${target.transitionName}, vm:=${target})`);
      target._observeTransition(target.cast());
    })
  }

  protected abstract create(seriesName: string, observeTransition: (vw: V) => void, transitionName?: string): V;

  protected get seriesName(): string {
    return this._seriesName;
  }

  protected isSeriesGenesis(): boolean {
    return this._isSeriesGenesis;
  }

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
    logger(`setting state on next view model in series (series:=${this._seriesName}, transition:=${transitionName}) ...`);    
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

  private validateHead = (): ViewModelBase<V> => {
    const head = seriesHeadMap.get(this._seriesName);

    if (this._version === head._version) {
      return this;
    }

    throw new Error(`Failed to transition to the next view model in series. Cannot transition from current view model since its NOT the latest version (series:=${this._seriesName}, transition:=${this._transitionName}, (version:=${this._version} !== expected:=${head._version}) ).`)
  }

  protected createNext = (transitionName: string): V => {
    const prev = this.validateHead();
    const next = prev.create(prev._seriesName, prev._observeTransition, (transitionName || 'unknown').trim().toLowerCase());
        
    next._state = { ...(prev._state || {}) };
    next._version = (prev._version + 1);

    logger(`creating head view model (series:=${prev._seriesName}, previous:=${prev._version}, next:=${next._version})`);
    prev.dispose();

    return next;
  }

  public get isDesktopMode() {
    return isBrowser;
  }

  public get isMobileMode() {
    return isMobile;
  }

  public get isDisposed() {
    return this._isDisposed;
  }

  public toString(): string {
    return `series:=${this._seriesName}, transition:=${this._transitionName}, version:=${this._version}, disposed:=${this._isDisposed}`
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
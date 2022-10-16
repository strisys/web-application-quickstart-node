import { IIdentityState } from 'model-core';

export interface IIdentityStateAuthenticated extends IIdentityState {
  accessToken: string;
}

export type IIdentityStateAuthenticatedOmit = Omit<IIdentityStateAuthenticated, 'accessToken'>;
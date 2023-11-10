import { setup, expect } from './../util';
import { Identity, IIdentityState } from '../..';

setup();

describe('UserProfile', () => {
  describe('constructor', function () {
    it('should contain the expected state', async () => {
      // Assemble/Act
      const state: IIdentityState = {
        id: '1',
        uuid: '',
        email: `name@email.com`,
        displayName: 'Stephen Trudel',
        settings: { 'initial-path': '/dashboard' }
      };

      const assert = (entity: Identity): Identity => {
        expect(entity.id).to.be.eq(state.id);
        expect(entity.email).to.be.eq(state.email);
        expect(entity.displayName).to.be.eq(state.displayName);
        expect(entity.preferences).to.be.deep.equal(state.settings);

        return entity;
      }

      // Assert
      const entity = assert(Identity.from(assert(Identity.create(state)).toJSON(true)));
    });
  });
});
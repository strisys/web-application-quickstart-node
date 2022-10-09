import { expect } from 'chai';
import { KVStore, Identity, IIdentityState } from '../../';

KVStore.current().isTesting = true;

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

      const entity = new Identity(state)

      // Assert
      expect(entity.id).to.be.eq(state.id);
      expect(entity.email).to.be.eq(state.email);
      expect(entity.displayName).to.be.eq(state.displayName);
      expect(entity.preferences).to.be.deep.equal(state.settings);
    });
  });
});
const { createToken, createResetToken, validateToken } = require('../lib/jwtoken');

describe('jwtoken', () => {
  describe('createToken', () => {
    it('produces a token that validateToken accepts', () => {
      const payload = { id: 1, role: 'user' };
      const token = createToken(payload);
      expect(typeof token).toBe('string');
      const decoded = validateToken(token);
      expect(decoded.id).toBe(1);
      expect(decoded.role).toBe('user');
    });

    it('expires after one day', () => {
      const token = createToken({ id: 1 });
      const decoded = validateToken(token);
      expect(decoded.exp - decoded.iat).toBeCloseTo(24 * 60 * 60, 1);
    });
  });

  describe('createResetToken', () => {
    it('produces a token that validateToken accepts', () => {
      const token = createResetToken({ id: 7 });
      const decoded = validateToken(token);
      expect(decoded.id).toBe(7);
    });

    it('expires after one hour', () => {
      const token = createResetToken({ id: 7 });
      const decoded = validateToken(token);
      expect(decoded.exp - decoded.iat).toBeCloseTo(60 * 60, 1);
    });
  });

  describe('validateToken', () => {
    it('rejects a tampered token', () => {
      const token = createToken({ id: 1 });
      expect(() => validateToken(`${token}x`)).toThrow();
    });
  });
});

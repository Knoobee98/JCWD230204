const { tokenVerify, requireRole } = require('../middleware/Token');
const { createToken } = require('../lib/jwtoken');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res;
};

describe('tokenVerify', () => {
  it('responds 400 when no token header is present', () => {
    const req = { headers: {} };
    const res = mockResponse();
    const next = jest.fn();

    tokenVerify(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ message: 'Token not found' }));
    expect(next).not.toHaveBeenCalled();
  });

  it('responds 400 for an invalid token', () => {
    const req = { headers: { token: 'not-a-real-token' } };
    const res = mockResponse();
    const next = jest.fn();

    tokenVerify(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid Token' }));
    expect(next).not.toHaveBeenCalled();
  });

  it('attaches uid and calls next for a valid token', () => {
    const req = { headers: { token: createToken({ id: 5, role: 'user' }) } };
    const res = mockResponse();
    const next = jest.fn();

    tokenVerify(req, res, next);

    expect(req.uid.id).toBe(5);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe('requireRole', () => {
  it('responds 401 when req.uid is missing', () => {
    const req = {};
    const res = mockResponse();
    const next = jest.fn();

    requireRole(['user'])(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ message: 'Unauthorized' }));
    expect(next).not.toHaveBeenCalled();
  });

  it('responds 403 when the role is not allowed', () => {
    const req = { uid: { id: 1, role: 'customer' } };
    const res = mockResponse();
    const next = jest.fn();

    requireRole(['user'])(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ message: 'Forbidden: insufficient role' }));
    expect(next).not.toHaveBeenCalled();
  });

  it('allows a matching role', () => {
    const req = { uid: { id: 1, role: 'branch admin' } };
    const res = mockResponse();
    const next = jest.fn();

    requireRole(['user', 'branch admin'])(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('falls back to req.uid.status when role is absent', () => {
    const req = { uid: { id: 1, status: 'super admin' } };
    const res = mockResponse();
    const next = jest.fn();

    requireRole(['super admin'])(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});

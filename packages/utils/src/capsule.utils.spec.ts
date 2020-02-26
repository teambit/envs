import { getCapsuleName, createCapsule, destroyCapsule } from './capsule.utils';

describe('capsule utils', () => {
  it('should return a capsule name with no infix', () => {
    const res = getCapsuleName();
    expect(res).toContain('var/');
  });
  it('should return a capsule name with infix', () => {
    const INFIX: string = 'abcdefg';
    const res = getCapsuleName(INFIX);
    expect(res).toContain(INFIX);
  });

  it('should isolate the component with default options', async () => {
    const TEST_NAME = 'test_name';
    const isolateMock = jest.fn();
    await createCapsule(isolateMock, {});
    expect(isolateMock).toHaveBeenCalledTimes(1);
  });
});

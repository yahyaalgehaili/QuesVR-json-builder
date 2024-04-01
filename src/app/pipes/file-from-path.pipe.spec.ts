import { FileFromPathPipe } from './file-from-path.pipe';

describe('FileFromPathPipe', () => {
  it('create an instance', () => {
    const pipe = new FileFromPathPipe();
    expect(pipe).toBeTruthy();
  });
});

import { mount } from '@vue/test-utils'
import Fastype from '@/apps/Fastype/Fastype.vue'

let cmp;

beforeEach(() => {
  cmp = mount(Fastype);
});

describe('Fastype: Initialization', () => {
  it('running is false', () => {
    expect(cmp.vm.running).toBe(false);
  });

  it('finished is false', () => {
    expect(cmp.vm.finished).toBe(false);
  });

  it('correctCount is 0', () => {
    expect(cmp.vm.correctCount).toBe(0);
  });

  it('timer is null', () => {
    expect(cmp.vm.timer).toBeNull();
  });
});


describe('Fastype: generateRandomWord() method', () => {
  it('Does not return empty string', () => {
    expect(cmp.vm.generateRandomWord().length > 0).toBeTruthy();
  });

  it('Returns a string with a lenght of correctCount+3', () => {
    expect(cmp.vm.generateRandomWord().length).toBe(cmp.vm.correctCount+3);
  });
});


describe('Fastype: start() method', () => {
  beforeEach(() => {
    cmp.vm.start();
  });

  it('running sets to true', () => {
    expect(cmp.vm.running).toBeTruthy();
  });

  it('correctCount sets to 0', () => {
    expect(cmp.vm.correctCount).toBe(0);
  });

  it('secondsLeft equals to secondsTotal', () => {
    expect(cmp.vm.secondsLeft).toEqual(cmp.vm.secondsTotal);
  });

  it('timer is NOT null', () => {
    expect(cmp.vm.timer).not.toBeNull();
  });
});

describe('Fastype: stop() method', () => {
  beforeEach(() => {
    cmp.vm.start();
    cmp.vm.stop();
  });

  it('running is false', () => {
    expect(cmp.vm.running).not.toBeTruthy();
  });

  it('finished sets to true', () => {
    expect(cmp.vm.finished).toBeTruthy();
  });

  it('timer is null', () => {
    expect(cmp.vm.timer).toBeNull();
  });
});

describe('Fastype: checkInput() method', () => {
  beforeEach(() => {
    cmp.vm.start();
  });

  it('correctCount is 1 when solving the first word correctly', () => {
    expect(cmp.vm.correctCount).toBe(0);
    let n = cmp.vm.randomWord.length;
    for (var i = 0; i < n; i++) {
      cmp.vm.inputChars += cmp.vm.randomWord[i];
      cmp.vm.checkInput();
    }
    expect(cmp.vm.correctCount).toBe(1);
  });

  it('correctCount is 2 when solving the first two words correctly', () => {
    expect(cmp.vm.correctCount).toBe(0);
    let n = cmp.vm.randomWord.length;
    for (var i = 0; i < n; i++) {
      cmp.vm.inputChars += cmp.vm.randomWord[i];
      cmp.vm.checkInput();
    }
    n = cmp.vm.randomWord.length;
    for (var i = 0; i < n; i++) {
      cmp.vm.inputChars += cmp.vm.randomWord[i];
      cmp.vm.checkInput();
    }
    expect(cmp.vm.correctCount).toBe(2);
  });

  it('new randomWord is 1 character longer than last', () => {
    let n = cmp.vm.randomWord.length;
    for (var i = 0; i < n; i++) {
      cmp.vm.inputChars += cmp.vm.randomWord[i];
      cmp.vm.checkInput();
    }
    expect(cmp.vm.randomWord.length).toBe(n+1);
  });
});

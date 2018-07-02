import { mount } from 'vue-test-utils'
import Cryptocurrency from '@/apps/Cryptocurrency/Cryptocurrency.vue'

let cmp;

beforeEach(() => {
  // we pass getCryptoData as an empty function in order to mock the real one
  cmp = mount(Cryptocurrency, { methods: { getCryptoData: () => {} } });
});

describe('Cryptocurrency: addThousandSeparator() method using comma as separator', () => {
  it('1000 => 1,000', () => {
    expect(cmp.vm.addThousandSeparator(1000,',')).toBe('1,000');
  });

  it('1 => 1', () => {
    expect(cmp.vm.addThousandSeparator(1,',')).toBe('1');
  });

  it('10 => 10', () => {
    expect(cmp.vm.addThousandSeparator(10,',')).toBe('10');
  });

  it('100 => 100', () => {
    expect(cmp.vm.addThousandSeparator(100,',')).toBe('100');
  });

  it('19199 => 19,199', () => {
    expect(cmp.vm.addThousandSeparator(19199,',')).toBe('19,199');
  });

  it('333333 => 333,333', () => {
    expect(cmp.vm.addThousandSeparator(333333,',')).toBe('333,333');
  });

  it('123123123 => 123,123,123', () => {
    expect(cmp.vm.addThousandSeparator(123123123,',')).toBe('123,123,123');
  });

  it('23456789 => 23,456,789', () => {
    expect(cmp.vm.addThousandSeparator(23456789,',')).toBe('23,456,789');
  });

  it('3456789 => 3,456,789', () => {
    expect(cmp.vm.addThousandSeparator(3456789,',')).toBe('3,456,789');
  });

  it('456789 => 456,789', () => {
    expect(cmp.vm.addThousandSeparator(456789,',')).toBe('456,789');
  });

  it('\'\' => \'\'', () => {
    expect(cmp.vm.addThousandSeparator('',',')).toBe('');
  });

  it('asdf => a,sdf', () => {
    expect(cmp.vm.addThousandSeparator('asdf',',')).toBe('a,sdf');
  });

  it('111111,1 => 111,111,1', () => {
    expect(cmp.vm.addThousandSeparator('111111,1',',')).toBe('111,111,1');
  });

  it(',,, => ,,,', () => {
    expect(cmp.vm.addThousandSeparator(',,,',',')).toBe(',,,');
  });

  it(',,,,, => ,,,,,', () => {
    expect(cmp.vm.addThousandSeparator(',,,',',')).toBe(',,,');
  });

  it('Array as value returns empty string', () => {
    expect(cmp.vm.addThousandSeparator(['1'],',')).toBe('');
  });

});


describe('Cryptocurrency: addThousandSeparator() method using different separators', () => {
  it('Empty separator returns the same value', () => {
    expect(cmp.vm.addThousandSeparator(7654321,'')).toBe('7654321');
  });

  it('No separator uses comma as separator', () => {
    expect(cmp.vm.addThousandSeparator(7654321)).toBe('7,654,321');
  });

  it('Null separator returns the same value', () => {
    expect(cmp.vm.addThousandSeparator(7654321,null)).toBe('7654321');
  });

  it('More than 1 char separator returns empty string', () => {
    expect(cmp.vm.addThousandSeparator(7654321,',,')).toBe('');
  });

  it('Array as separator returns empty string', () => {
    expect(cmp.vm.addThousandSeparator(1000,['.'])).toBe('');
  });

  it('1000 \'.\' => 1.000', () => {
    expect(cmp.vm.addThousandSeparator(1000,'.')).toBe('1.000');
  });

  it('99999 \'a\' => 99a999', () => {
    expect(cmp.vm.addThousandSeparator(99999,'a')).toBe('99a999');
  });

  it('aaaf \'f\' => aaaf', () => {
    expect(cmp.vm.addThousandSeparator('aaaf','f')).toBe('aaaf');
  });

  it('aaaaf \'f\' => afaaaf', () => {
    expect(cmp.vm.addThousandSeparator('aaaaf','f')).toBe('afaaaf');
  });

  it('aaaafa \'f\' => afaaafa', () => {
    expect(cmp.vm.addThousandSeparator('aaaafa','f')).toBe('afaaafa');
  });
});

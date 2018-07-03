import { mount } from 'vue-test-utils'
import Cryptocurrency from '@/apps/Cryptocurrency/Cryptocurrency.vue'

let cmp;

beforeEach(() => {
  // we pass getCryptoData as an empty function in order to mock the real one
  cmp = mount(Cryptocurrency, {
    methods: { getCryptos: () => {} },
    data: function() {
      return {
        cryptoData: [
          {"symbol":"ETHBTC","baseAsset":"ETH","quoteAsset":"BTC"},
          {"symbol":"LTCBTC","baseAsset":"LTC","quoteAsset":"BTC"},
          {"symbol":"BNBBTC","baseAsset":"BNB","quoteAsset":"BTC"}
        ],
        candlesData: [
          [1530568800000,"6300.00000000","7000.00000000","6000.00000000","6700.00000000","1161.32614200",1530572399999,"7691494.48324262",10619,"550.16647300","3645114.95049808","0"]
        ]
      }
    }
  });
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


describe('Cryptocurrency: getCandleHeight() method', () => {
  it('7000, 6000 => 100%', () => {
    expect(cmp.vm.getCandleHeight(7000, 6000)).toBe(100);
  });

  it('6500, 6000 => 50%', () => {
    expect(cmp.vm.getCandleHeight(6500, 6000)).toBe(50);
  });

  it('7000, 6500 => 50%', () => {
    expect(cmp.vm.getCandleHeight(7000, 6500)).toBe(50);
  });

  it('0, 0 => 0', () => {
    expect(cmp.vm.getCandleHeight(0, 0)).toBe(0);
  });

  it('100, 50 => 5', () => {
    expect(cmp.vm.getCandleHeight(100, 50)).toBe(5);
  });

  it('1000, 500 => 50', () => {
    expect(cmp.vm.getCandleHeight(1000, 500)).toBe(50);
  });

  it('null, null => 0', () => {
    expect(cmp.vm.getCandleHeight(null, null)).toBe(0);
  });

  it('[], [] => 0', () => {
    expect(cmp.vm.getCandleHeight([], [])).toBe(0);
  });

  it('1000, 750 => 25', () => {
    expect(cmp.vm.getCandleHeight(1000, 750)).toBe(25);
  });

  it('1000, 250 => 75', () => {
    expect(cmp.vm.getCandleHeight(1000, 250)).toBe(75);
  });

  it('1000, 100 => 90', () => {
    expect(cmp.vm.getCandleHeight(1000, 100)).toBe(90);
  });

  it('1000, 900 => 10', () => {
    expect(cmp.vm.getCandleHeight(1000, 900)).toBe(10);
  });

  it('1000, 333 => 66.7', () => {
    expect(cmp.vm.getCandleHeight(1000, 333)).toBe(66.7);
  });

  it('333, 1000 => -66.7', () => {
    expect(cmp.vm.getCandleHeight(333, 1000)).toBe(-66.7);
  });
});


describe('Cryptocurrency: getCandleColor() method', () => {
  it('10, 20 => green', () => {
    expect(cmp.vm.getCandleColor([null,10,null,null,20])).toBe('green');
  });

  it('20, 10 => red', () => {
    expect(cmp.vm.getCandleColor([null,20,null,null,10])).toBe('red');
  });

  it('10, 10 => green', () => {
    expect(cmp.vm.getCandleColor([null,10,null,null,10])).toBe('green');
  });

  it('null, null => green', () => {
    expect(cmp.vm.getCandleColor([null,null,null,null,null])).toBe('green');
  });

  it('-10, -20 => red', () => {
    expect(cmp.vm.getCandleColor([null,-10,null,null,-20])).toBe('red');
  });

  it('-10, -5 => green', () => {
    expect(cmp.vm.getCandleColor([null,-10,null,null,-5])).toBe('green');
  });
});


describe('Cryptocurrency: getCandleTopPosition() method', () => {
  it('7000 => 0', () => {
    expect(cmp.vm.getCandleTopPosition(7000)).toBe(0);
  });

  it('6500 => 50', () => {
    expect(cmp.vm.getCandleTopPosition(6500)).toBe(50);
  });

  it('6000 => 100', () => {
    expect(cmp.vm.getCandleTopPosition(6000)).toBe(100);
  });

  it('6200 => 80', () => {
    expect(cmp.vm.getCandleTopPosition(6200)).toBe(80);
  });

  it('6850 => 15', () => {
    expect(cmp.vm.getCandleTopPosition(6850)).toBe(15);
  });
});

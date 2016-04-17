import searchByImage from '../dist';
import expect from 'expect.js';
import path from 'path';

const mochaAsync = (fn) => {
  return async(done) => {
    try {
      await fn();
      done();
    } catch (err) {
      done(err);
    }
  };
};

/**
 * Tests
 */

describe('searchByImage', function () {

  this.timeout(10000);

  it('should upload image and guess the content', mochaAsync(async()=> {
    const res = await searchByImage(path.join(__dirname, 'files', 'puppy.jpg'), {language: 'en'});

    expect(res).to.be.an('object');
    expect(res.guess).to.be.a('string');
    expect(res.guess).to.match(/puppy/);
  }));

  it('should guess the content of image url', mochaAsync(async()=> {
    const res = await searchByImage(
      'https://pixabay.com/static/uploads/photo/2014/11/07/21/39/oporto-521258_640.jpg',
      {language: 'en'});

    expect(res).to.be.an('object');
    expect(res.guess).to.be.a('string');
    expect(res.guess).to.match(/night/);
  }));
});

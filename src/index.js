import validUrl from 'valid-url';
import Promise from 'bluebird';
import request from 'superagent';
import cheerio from 'cheerio';

const BASE_URL = 'https://www.google.com/searchbyimage';

const searchByImage = (image, opts, cb)=> {
  const isUrl = (typeof image === 'string' && validUrl(image));
  if (typeof opts === 'function') cb = opts;

  let req;
  if (isUrl) {
    req = request
      .get(BASE_URL)
      .query({
        site: 'search',
        sa: 'X',
        image_url: image
      })
  } else {
    req = request
      .post(BASE_URL + '/uplaod')
      .attach('encoded_image', image);
  }

  return new Promise((resolve, reject)=> {
    req.set({
      'User-Agent': 'Mozilla/5.0',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }).end((err, res)=> {
      if (err) return reject(err);

      const $ = cheerio.load(res.text);
      const guess = $('a._gUb').text();

      resolve({guess})
    })
  }).nodeify(cb);
};

module.exports = searchByImage;

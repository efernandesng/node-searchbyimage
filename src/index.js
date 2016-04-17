import Promise from 'bluebird';
import {isUri} from 'valid-url';

import request from 'superagent';
import cheerio from 'cheerio';

const CSS_QUERY = 'div#topstuff div.card-section > div:nth-child(3) > a';

const defOptions = {
  userAgent: 'Mozilla/5.0 (X11; Linux x86_64; rv:45.0) Gecko/20100101 Firefox/45.0',
  language: 'en'
};

const searchByImage = (image, opts, cb)=> {
  const typeOfOpts = typeof opts;

  let options = defOptions;
  switch (typeOfOpts) {
    case 'object':
      options = {
        ...defOptions,
        ...opts
      };
      break;
    case 'function':
      cb = opts;
      break;
  }

  return new Promise((resolve, reject)=> {
    const isLocalImage = (typeof image === 'string' && !isUri(image));

    let url = 'https://www.google.com/searchbyimage';
    let method = 'get';
    let qs = {};

    if (isLocalImage) {
      url += '/upload';
      method = 'post';
    } else {
      qs = {site: 'search', hl: options.language, image_url: image}
    }

    let req = request[method](url)
      .query(qs)
      .set({
        'User-Agent': options.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      });

    if (isLocalImage) {
      req = req
        .field('hl', options.language)
        .attach('encoded_image', image);
    }

    req.end((err, res)=> {
      if (err) return reject(err);

      const $ = cheerio.load(res.text);
      const guess = $(CSS_QUERY).text();
      resolve({guess})
    });
  }).nodeify(cb);
};

module.exports = searchByImage;

import fs from 'fs';
import Promise from 'bluebird';
import {isUri} from 'valid-url';
import request from 'request';
import cheerio from 'cheerio';

const BASE_URL = 'https://www.google.com/searchbyimage';
const CSS_QUERY = 'div#topstuff div.card-section > div:nth-child(3) > a';

const defOptions = {
  userAgent: 'Mozilla/5.0 (X11; Linux x86_64; rv:45.0) Gecko/20100101 Firefox/45.0',
  acceptLanguage: 'en-US,en;q=0.5'
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
    const reqOpts = (typeof image === 'string' && isUri(image)) ? {
      method: 'GET',
      url: BASE_URL,
      qs: {
        site: 'search',
        sa: 'X',
        image_url: image
      }
    } : {
      method: 'POST',
      url: BASE_URL + '/uplaod',
      formData: {
        encoded_image: (image instanceof Buffer) ? image : fs.createReadStream(image)
      }
    };

    request({
      headers: {
        'User-Agent': options.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': options.acceptLanguage
      },
      ...reqOpts
    }, (err, res, body)=> {
      if (err) return reject(err);

      const $ = cheerio.load(body);
      const guess = $(CSS_QUERY).text();

      resolve({guess})
    })
  }).nodeify(cb);
};

module.exports = searchByImage;

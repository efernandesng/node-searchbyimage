import fs from 'fs';
import Promise from 'bluebird';
import {isUri} from 'valid-url';
import request from 'request';
import cheerio from 'cheerio';

const BASE_URL = 'https://www.google.com/searchbyimage';

const searchByImage = (image, opts, cb)=> {
  if (typeof opts === 'function') cb = opts;

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
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:45.0) Gecko/20100101 Firefox/45.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      ...reqOpts
    }, (err, res, body)=> {
      if (err) return reject(err);

      const $ = cheerio.load(body);
      const guess = $('a._gUb').text();

      resolve({guess})
    })
  }).nodeify(cb);
};

module.exports = searchByImage;

const URI = require('uri-js');

const getUrls = (content) => {
  // get all urls in the content string
  const host = content
    .split('htt')
    .filter(string => string[0] === 'p')
    .map(element => {
      const [string] = element.split(' ');
      // just for case
      if (!string) {
        return null;
      }
      // if not correct url
      if (!string.startsWith('p://') && !string.startsWith('ps://')) {
        return null;
      }

      return `htt${string}`;
    })
    .filter(url => url);

  return host;
};

const convertToHost = url => {
  if (!url.includes('http')) {
    return url;
  }
  return URI.parse(url).host;
};

const isEqual = (host1, host2) => {
  return URI.equal(host1, host2);
};

module.exports = {
  getUrls,
  convertToHost,
  isEqual,
};
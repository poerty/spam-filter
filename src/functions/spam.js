const axios = require('axios');
const Url = require('./url');

const isSpam = async (content, spamLinkDomains, redirectionDepth) => {

  let urls = Url.getUrls(content);

  while (redirectionDepth > 0) {
    // check host is spam host
    const hosts = urls.map(url => Url.convertToHost(url));
    const spamHosts = spamLinkDomains.map(domain => Url.convertToHost(domain));
    const isContainSpamHost = checkHostContainSpamHost(hosts, spamHosts);
    if (isContainSpamHost) {
      return true;
    }

    // get content of html(or redirection), and make new url list
    const newContentList = await Promise.all(urls.map(async url => {
      return getContent(url);
    }));
    urls = [];
    newContentList.map(newContent => {
      urls = urls.concat(Url.getUrls(newContent));
    });
    redirectionDepth -= 1;
  }
  return false;
};

const getContent = async (url) => {
  try {
    // cant get redirect chain list even by maxRedirects...
    const resp = await axios.get(url, {
      maxRedirects: 0,
      validateStatus: status => (status >= 200 && status < 300) || status === 302,
    });

    let body = '';
    // set for no redirect
    if (resp && resp.data) {
      body = resp.data;
    }
    // set for redirect
    if (resp.headers && resp.headers.location && resp.headers.location.length > 0) {
      body = resp.headers.location;
    }
    return body;
  } catch (err) {
    console.log('err: ', err);
    return '';
  }
};


const checkHostContainSpamHost = (hosts, spamHosts) => {
  return !hosts.every(host => spamHosts.every(spamHost => !Url.isEqual(spamHost, host)));
};

module.exports = {
  isSpam,
};
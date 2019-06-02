const axios = require('axios');
const Url = require('./url');

const isSpam = async (content, spamLinkDomains, redirectionDepth) => {
  console.log('redirectionDepth: ', redirectionDepth);
  const urls = Url.getUrls(content);
  console.log('urls: ', urls);

  const hosts = urls.map(url => Url.convertToHost(url));
  console.log('hosts: ', hosts);
  const spamHosts = spamLinkDomains.map(domain => Url.convertToHost(domain));
  console.log('spamHosts: ', spamHosts);
  const isContainSpamHost = checkHostContainSpamHost(hosts, spamHosts);
  console.log('isContainSpamHost: ', isContainSpamHost);
  if (isContainSpamHost) {
    return true;
  }

  return await Promise.all(urls.map(async url => {
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
      [body] = resp.headers.location;
    }
    return isSpam(body, spamLinkDomains, redirectionDepth - 1);
  }));
};


const checkHostContainSpamHost = (hosts, spamHosts) => {
  return !hosts.every(host => spamHosts.every(spamHost => !Url.isEqual(spamHost, host)));
};

module.exports = {
  isSpam,
};
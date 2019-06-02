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
    const body = (await axios.get(url)).data;
    return isSpam(body, spamLinkDomains, redirectionDepth);
  }));
};


const checkHostContainSpamHost = (hosts, spamHosts) => {
  return !hosts.every(host => spamHosts.every(spamHost => !Url.isEqual(spamHost, host)));
};

module.exports = {
  isSpam,
};
const chai = require('chai');

const { isSpam } = require('../functions/spam');

const expect = chai.expect;
// const should = chai.should();

const url = 'https://goo.gl/nVLutc';

const filekokUrl = 'www.filekok.com';
// const bitUrl = 'bit.ly';
const tvtvUrl = 'tvtv24.com';
const fileisUrl = 'fileis.com';

describe('/SpamFiltering : Given', () => {
  it('it should not filter filekok 1', async () => {
    const content = `spam spam ${url}`;
    const spamLinkDomains = [filekokUrl];
    const redirectionDepth = 1;
    const check = await isSpam(content, spamLinkDomains, redirectionDepth);
    expect(check).to.eq(false);
  });

  // redirection ...
  // it('it should filter bit 1', async () => {
  //   const content = `spam spam ${url}`;
  //   const spamLinkDomains = [bitUrl];
  //   const redirectionDepth = 1;
  //   const check = await isSpam(content, spamLinkDomains, redirectionDepth);
  //   expect(check).to.eq(true);
  // });

  it('it should filter tvtv 2', async () => {
    const content = `spam spam ${url}`;
    const spamLinkDomains = [tvtvUrl];
    const redirectionDepth = 2;
    const check = await isSpam(content, spamLinkDomains, redirectionDepth);
    expect(check).to.eq(true);
  });

  it('it should not filter filekok 2', async () => {
    const content = `spam spam ${url}`;
    const spamLinkDomains = [filekokUrl];
    const redirectionDepth = 2;
    const check = await isSpam(content, spamLinkDomains, redirectionDepth);
    expect(check).to.eq(false);
  });

  // filekok url does not eixst in that page..
  // instead use fileis
  it('it should filter filekok 3', async () => {
    const content = `spam spam ${url}`;
    const spamLinkDomains = [fileisUrl];
    const redirectionDepth = 3;
    const check = await isSpam(content, spamLinkDomains, redirectionDepth);
    expect(check).to.eq(true);
  });
});
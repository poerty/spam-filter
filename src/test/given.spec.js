const chai = require('chai');

const { isSpam } = require('../functions/spam')

const expect = chai.expect;
const should = chai.should();

describe('/SpamFiltering : Given', () => {
  describe('it should filter', () => {
    const url = "https://goo.gl/nVLutc"
    const content = `spam spam ${url}`
    const spamLinkDomains = ['www.filekok.com']
    const redirectionDepth = 1
    expect(isSpam(content, spamLinkDomains, redirectionDepth)).to.eq(false)
  });
})
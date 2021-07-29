const { expect } = require('chai');
const request = require('request');

const app = 'http://localhost:8000';

describe('/ test', () => {
  it('Main page content and status', (done) => {
    request(app, (error, response, body) => {
      expect(body).to.equal('Hello World!');
      expect(response.statusCode).to.equal(200);
      done();
    });
  });
});

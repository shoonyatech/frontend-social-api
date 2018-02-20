import chai, { assert,expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';
import {isPalindrome} from '../../src/controller/sample'

chai.use(chaiHttp);

describe('Sample Controller', () => {
    it('Should return response with status 200', (done) => {
        chai.request(server)
            .get('/api/sample')
            .end((err, res) => {
                expect(res.status).equals(200);
                done();
            });          
    });
});


describe('Palindrome Function', () => {
    it('should return true', () => {
      let input = `ababa`;
      let output = isPalindrome(input);
      assert.isTrue(output, "Value is true");
    })
  
    it('should return false', () => {
      let input = `abab`;
      let output = isPalindrome(input);
      assert.isFalse(output, "Value is false");
    })
  
    it('should throw an error on empty string', () => {
      let input = ``;
      let errorMessage = "Please enter string"
      assert.throws(() => isPalindrome(input), Error, errorMessage)
    })
  })

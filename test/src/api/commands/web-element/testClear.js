const assert = require('assert');
const {WebElement, Key} = require('selenium-webdriver');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const common = require('../../../../common.js');
const Element = common.require('element/index.js');

describe('element().clear() command', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .element().clear()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/clear',
      method: 'POST',
      response: JSON.stringify({
        value: null
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').clear();
    // neither an instance of Element or Promise, but an instance of ScopedWebElement.
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(resultPromise instanceof Promise, false);

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '0');
  });

  it('test .element().find().clear()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/1/clear',
      method: 'POST',
      response: JSON.stringify({
        value: null
      })
    }, true);

    const resultPromise = this.client.api.element('#signupSection').find('#helpBtn').clear();
    // neither an instance of Element or Promise, but an instance of ScopedWebElement.
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(resultPromise instanceof Promise, false);

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '1');
  });

  it('test .element.find().clear()', async function() {
    MockServer.addMock({
      url: '/session/13521-10219-202/element/0/clear',
      method: 'POST',
      response: JSON.stringify({
        value: null
      })
    }, true);

    const resultPromise = this.client.api.element.find('#signupSection').clear();
    // neither an instance of Element or Promise, but an instance of ScopedWebElement.
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(typeof resultPromise.find, 'undefined');
    assert.strictEqual(resultPromise instanceof Promise, false);

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '0');
  });

  it('test .element().clear() with fallback sending keys', async function() {
    let sendKeysMockCalled = false;

    MockServer
      .addMock({
        url: '/session/13521-10219-202/element/0/clear',
        method: 'POST',
        response: JSON.stringify({
          value: null
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/element/0/property/value',
        method: 'GET',
        response: {value: 'sample'}
      }, true)
      .addMock({
        url: '/session/13521-10219-202/element/0/value',
        method: 'POST',
        response: {value: null},
        onRequest(_, requestData) {
          assert.strictEqual(requestData.text, Array(6).fill(Key.BACK_SPACE).join(''));
          sendKeysMockCalled = true;
        }
      }, true);

    const resultPromise = this.client.api.element('#signupSection').clear();

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '0');

    assert.strictEqual(sendKeysMockCalled, true);
  });

  it('test .element().clear() with fallback not sending keys when clear working correctly', async function() {
    let sendKeysMockCalled = false;

    MockServer
      .addMock({
        url: '/session/13521-10219-202/element/0/clear',
        method: 'POST',
        response: JSON.stringify({
          value: null
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/element/0/property/value',
        method: 'GET',
        response: {value: ''}
      }, true)
      .addMock({
        url: '/session/13521-10219-202/element/0/value',
        method: 'POST',
        response: {value: null},
        onRequest() {
          sendKeysMockCalled = true;
        }
      }, true);

    const resultPromise = this.client.api.element('#signupSection').clear();

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '0');

    assert.strictEqual(sendKeysMockCalled, false);
  });
});

var sinon = require("sinon");
var MockFirmata = require("./util/mock-firmata");
var EVS = require("../lib/evshield");
var five = require("../lib/johnny-five");
var Button = five.Button;

var io = new MockFirmata();
var board = new five.Board({
  debug: false,
  repl: false,
  io: io,
});

io.emit("ready");


var proto = [];
var instance = [{
  name: "pullup"
}, {
  name: "invert"
}, {
  name: "downValue"
}, {
  name: "upValue"
}, {
  name: "holdtime"
}, {
  name: "isDown"
}, {
  name: "value"
}];


exports["Button -- Digital Pin"] = {
  setUp: function(done) {
    this.digitalRead = sinon.spy(MockFirmata.prototype, "digitalRead");
    this.button = new Button({
      pin: 8,
      board: board
    });

    done();
  },

  tearDown: function(done) {
    this.digitalRead.restore();
    done();
  },

  shape: function(test) {
    test.expect(proto.length + instance.length);

    proto.forEach(function(method) {
      test.equal(typeof this.button[method.name], "function");
    }, this);

    instance.forEach(function(property) {
      test.notEqual(typeof this.button[property.name], "undefined");
    }, this);

    test.done();
  },

  down: function(test) {

    var callback = this.digitalRead.args[0][1];
    test.expect(1);

    //fake timers dont play nice with __.debounce
    this.button.on("down", function() {

      test.ok(true);
      test.done();
    });

    callback(this.button.downValue);
  },

  up: function(test) {

    var callback = this.digitalRead.args[0][1];
    test.expect(1);

    //fake timers dont play nice with __.debounce
    this.button.on("up", function() {

      test.ok(true);
      test.done();
    });
    callback(this.button.downValue);
    callback(this.button.upValue);
  },

  hold: function(test) {
    var clock = sinon.useFakeTimers();
    var callback = this.digitalRead.args[0][1];
    test.expect(1);

    //fake timers dont play nice with __.debounce
    this.button.on("hold", function() {
      test.ok(true);
      clock.restore();
      test.done();
    });
    this.button.holdtime = 10;
    callback(this.button.downValue);
    clock.tick(11);
    callback(this.button.upValue);
  },
};

exports["Button -- Analog Pin"] = {
  setUp: function(done) {
    this.digitalRead = sinon.spy(MockFirmata.prototype, "digitalRead");
    this.button = new Button({
      pin: "A0",
      board: board
    });

    done();
  },

  tearDown: function(done) {
    this.digitalRead.restore();
    done();
  },
  pinTranslation: function(test) {
    test.expect(1);
    test.equal(this.button.pin, 14);
    test.done();
  },
  down: function(test) {

    var callback = this.digitalRead.args[0][1];
    test.expect(1);

    //fake timers dont play nice with __.debounce
    this.button.on("down", function() {

      test.ok(true);
      test.done();
    });

    callback(this.button.downValue);
  },

  up: function(test) {

    var callback = this.digitalRead.args[0][1];
    test.expect(1);

    //fake timers dont play nice with __.debounce
    this.button.on("up", function() {
      test.ok(true);
      test.done();
    });
    callback(this.button.downValue);
    callback(this.button.upValue);
  },

  hold: function(test) {
    var clock = sinon.useFakeTimers();
    var callback = this.digitalRead.args[0][1];
    test.expect(1);

    //fake timers dont play nice with __.debounce
    this.button.on("hold", function() {
      test.ok(true);
      clock.restore();
      test.done();
    });

    this.button.holdtime = 10;
    callback(this.button.downValue);
    clock.tick(11);
    callback(this.button.upValue);
  },
};

exports["Button -- Value Inversion"] = {
  setUp: function(done) {
    this.digitalRead = sinon.spy(MockFirmata.prototype, "digitalRead");
    this.button = new Button({
      pin: 8,
      board: board
    });


    done();
  },

  tearDown: function(done) {
    this.digitalRead.restore();
    done();
  },

  initialInversion: function(test) {
    test.expect(6);

    this.button = new Button({
      pin: 8,
      invert: true,
      board: board
    });

    test.equal(this.button.downValue, 0);
    test.equal(this.button.upValue, 1);

    this.button.downValue = 1;

    test.equal(this.button.downValue, 1);
    test.equal(this.button.upValue, 0);

    this.button.upValue = 1;

    test.equal(this.button.downValue, 0);
    test.equal(this.button.upValue, 1);

    test.done();
  },

  pullupInversion: function(test) {
    test.expect(6);

    this.button = new Button({
      pin: 8,
      pullup: true,
      board: board
    });

    test.equal(this.button.downValue, 0);
    test.equal(this.button.upValue, 1);

    this.button.downValue = 1;

    test.equal(this.button.downValue, 1);
    test.equal(this.button.upValue, 0);

    this.button.upValue = 1;

    test.equal(this.button.downValue, 0);
    test.equal(this.button.upValue, 1);

    test.done();
  },

  inlineInversion: function(test) {
    test.expect(14);

    test.equal(this.button.downValue, 1);
    test.equal(this.button.upValue, 0);

    this.button.upValue = 1;

    test.equal(this.button.downValue, 0);
    test.equal(this.button.upValue, 1);

    this.button.upValue = 0;

    test.equal(this.button.downValue, 1);
    test.equal(this.button.upValue, 0);

    this.button.downValue = 0;

    test.equal(this.button.downValue, 0);
    test.equal(this.button.upValue, 1);

    this.button.downValue = 1;

    test.equal(this.button.downValue, 1);
    test.equal(this.button.upValue, 0);

    this.button.invert = true;

    test.equal(this.button.downValue, 0);
    test.equal(this.button.upValue, 1);

    this.button.invert = false;

    test.equal(this.button.downValue, 1);
    test.equal(this.button.upValue, 0);

    test.done();
  },

  downInversion: function(test) {

    var callback = this.digitalRead.args[0][1];
    test.expect(3);

    //fake timers dont play nice with __.debounce
    this.button.on("down", function() {

      test.ok(true);
      test.done();
    });

    this.button.downValue = 0;

    test.equal(this.button.downValue, 0);
    test.equal(this.button.upValue, 1);

    callback(this.button.downValue);
  },

  upInversion: function(test) {

    var callback = this.digitalRead.args[0][1];
    test.expect(3);

    this.button.on("up", function() {
      test.ok(true);
      test.done();
    });

    this.button.upValue = 1;

    test.equal(this.button.downValue, 0);
    test.equal(this.button.upValue, 1);

    callback(this.button.upValue);
  },

  holdInversion: function(test) {
    var clock = sinon.useFakeTimers();
    var callback = this.digitalRead.args[0][1];
    test.expect(1);

    //fake timers dont play nice with __.debounce
    this.button.on("hold", function() {
      test.ok(true);
      clock.restore();
      test.done();
    });

    this.button.holdtime = 10;
    this.button.downValue = 0;
    callback(this.button.downValue);
    clock.tick(11);
    callback(this.button.upValue);
  },
};


exports["Button -- EVS_EV3"] = {
  setUp: function(done) {
    this.evssetup = sinon.spy(EVS.prototype, "setup");
    this.evsread = sinon.spy(EVS.prototype, "read");

    this.i2cConfig = sinon.spy(MockFirmata.prototype, "i2cConfig");
    this.i2cWrite = sinon.spy(MockFirmata.prototype, "i2cWrite");
    this.i2cRead = sinon.spy(MockFirmata.prototype, "i2cRead");

    this.button = new Button({
      controller: "EVS_EV3",
      pin: "BAS1",
      board: board
    });

    done();
  },

  tearDown: function(done) {
    this.evssetup.restore();
    this.evsread.restore();

    this.i2cConfig.restore();
    this.i2cWrite.restore();
    this.i2cRead.restore();
    done();
  },

  pinTranslation: function(test) {
    test.expect(1);
    test.equal(this.button.pin, "BAS1");
    test.done();
  },

  initialization: function(test) {
    test.expect(4);

    test.equal(this.evssetup.callCount, 1);
    test.equal(this.evsread.callCount, 1);

    test.equal(this.i2cWrite.callCount, 1);
    test.equal(this.i2cRead.callCount, 1);

    test.done();
  },

  down: function(test) {

    var callback = this.i2cRead.args[0][3];
    test.expect(1);

    this.button.on("down", function() {

      test.ok(true);
      test.done();
    });

    callback([this.button.downValue]);
  },

  up: function(test) {

    var callback = this.i2cRead.args[0][3];
    test.expect(1);

    this.button.on("up", function() {
      test.ok(true);
      test.done();
    });
    callback([this.button.downValue]);
    callback([this.button.upValue]);
  },

  hold: function(test) {
    var clock = sinon.useFakeTimers();
    var callback = this.i2cRead.args[0][3];
    test.expect(1);

    //fake timers dont play nice with __.debounce
    this.button.on("hold", function() {
      test.ok(true);
      clock.restore();
      test.done();
    });

    this.button.holdtime = 10;
    callback([this.button.downValue]);
    clock.tick(11);
    callback([this.button.upValue]);
  },
};

exports["Button -- EVS_NXT"] = {
  setUp: function(done) {
    this.evssetup = sinon.spy(EVS.prototype, "setup");
    this.evsread = sinon.spy(EVS.prototype, "read");

    this.i2cConfig = sinon.spy(MockFirmata.prototype, "i2cConfig");
    this.i2cWrite = sinon.spy(MockFirmata.prototype, "i2cWrite");
    this.i2cRead = sinon.spy(MockFirmata.prototype, "i2cRead");

    this.button = new Button({
      controller: "EVS_NXT",
      pin: "BAS1",
      board: board
    });

    done();
  },

  tearDown: function(done) {
    this.evssetup.restore();
    this.evsread.restore();

    this.i2cConfig.restore();
    this.i2cWrite.restore();
    this.i2cRead.restore();
    done();
  },

  pinTranslation: function(test) {
    test.expect(1);
    test.equal(this.button.pin, "BAS1");
    test.done();
  },

  initialization: function(test) {
    test.expect(4);

    test.equal(this.evssetup.callCount, 1);
    test.equal(this.evsread.callCount, 1);

    test.equal(this.i2cWrite.callCount, 1);
    test.equal(this.i2cRead.callCount, 1);

    test.done();
  },

  down: function(test) {

    var callback = this.i2cRead.args[0][3];
    test.expect(1);

    this.button.on("down", function() {

      test.ok(true);
      test.done();
    });

    callback([250]);
  },

  up: function(test) {

    var callback = this.i2cRead.args[0][3];
    test.expect(1);

    this.button.on("up", function() {
      test.ok(true);
      test.done();
    });
    callback([250]);
    callback([1000]);
  },

  hold: function(test) {
    var clock = sinon.useFakeTimers();
    var callback = this.i2cRead.args[0][3];
    test.expect(1);

    //fake timers dont play nice with __.debounce
    this.button.on("hold", function() {
      test.ok(true);
      clock.restore();
      test.done();
    });

    this.button.holdtime = 10;
    callback([250]);
    clock.tick(11);
    callback([1000]);
  },
};

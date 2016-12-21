/// <reference path="../../node_modules/@types/node/index.d.ts"/>
/// <reference path="../../node_modules/@types/mocha/index.d.ts"/>

import Framer = require('../Buffers/Framer');

describe('when using a framer', () => {

    describe("#construction", () => {
        it('construted ok without callback being called', (done) => {
            var framer = new Framer(1, f => { done("constructor called erroneously") })
            done();
        });
    });

    describe("#write", () => {
        it('writes one one word frame', (done) => {
            var frames = 0;
            var byte = new Buffer(1);
            var framer = new Framer(1, f => { frames++ });
            framer.write(byte);
            framer.write(byte);
            framer.write(byte);
            if (frames != 0) done("frame produced too early");
            framer.write(byte);
            if (frames != 1) done("frame produced too late");
            done();
        });

        it('writes one two word frame', (done) => {
            var frames = 0;
            var byte = new Buffer(1);
            var framer = new Framer(2, f => { frames++ });
            framer.write(byte);
            framer.write(byte);
            framer.write(byte);
            framer.write(byte);
            framer.write(byte);
            framer.write(byte);
            framer.write(byte);
            if (frames != 0) done("frame produced too early");
            framer.write(byte);
            if (frames != 1) done("frame produced too late");
            done();
        });

        it('creates frames in correct order and endianness', (done) => {
            var framer = new Framer(2, f => {
                var word1 = f[0];
                var word2 = f[1];
                if (String.fromCharCode(word1 >> 24 & 255) != 'h') done("fail");
                if (String.fromCharCode(word1 >> 16 & 255) != 'e') done("fail");
                if (String.fromCharCode(word1 >> 8  & 255) != 'l') done("fail");
                if (String.fromCharCode(word1 >> 0  & 255) != 'l') done("fail");
                if (String.fromCharCode(word2 >> 24 & 255) != 'o') done("fail");
                if (String.fromCharCode(word2 >> 16 & 255) != ' ') done("fail");
                if (String.fromCharCode(word2 >> 8  & 255) != 'w') done("fail");
                if (String.fromCharCode(word2 >> 0  & 255) != 'o') done("fail");
                done();
            });
            framer.write(new Buffer("hello world!"));
        });

        it('creates frames correctly from fragments', (done) => {
            var frames = 0;
            var framer = new Framer(2, f => {
                if (frames == 1) {
                    var word1 = f[0];
                    var word2 = f[1];
                    if (String.fromCharCode(word1 >> 24 & 255) != 'r') done("fail");
                    if (String.fromCharCode(word1 >> 16 & 255) != 'l') done("fail");
                    if (String.fromCharCode(word1 >> 8  & 255) != 'd') done("fail");
                    if (String.fromCharCode(word1 >> 0  & 255) != '!') done("fail");
                    if (String.fromCharCode(word2 >> 24 & 255) != ' ') done("fail");
                    if (String.fromCharCode(word2 >> 16 & 255) != 'a') done("fail");
                    if (String.fromCharCode(word2 >> 8  & 255) != 'g') done("fail");
                    if (String.fromCharCode(word2 >> 0  & 255) != 'a') done("fail");
                    done();
                }
                frames++;
            });
            framer.write(new Buffer("hello world!"));
            framer.write(new Buffer(" again"));
        });
    });
});

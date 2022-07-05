/* eslint-disable */

import assert from "assert";

import { luhnAlgorithm } from "../src/luhnAlgorithm";
// import { parseDate } from "../src/personalNumber/parseDate";

import { parse as parsePN, validate as validatePN, normalise as normalisePN, parseCIN, validateCIN, normaliseCIN } from "../src/index";

describe("#luhnAlgorithm()", function () {
    it("should return correct: luhn number", function () {
        assert.strictEqual(luhnAlgorithm(811218987), 6);
        assert.strictEqual(luhnAlgorithm("000101812"), 6);
        assert.strictEqual(luhnAlgorithm(870723534), 0);
        assert.strictEqual(luhnAlgorithm("930311420"), 2);
    });
});

describe("#parseDate()", function () {
    it("should return correct: luhn number", function () {
        assert.strictEqual(luhnAlgorithm(811218987), 6);
        assert.strictEqual(luhnAlgorithm("000101812"), 6);
        assert.strictEqual(luhnAlgorithm(870723534), 0);
        assert.strictEqual(luhnAlgorithm("930311420"), 2);
    });
});

describe("#normalisePN()", function () {
    it("should return correct: normalised personal number", function () {
        assert.strictEqual(normalisePN("450103-8220"), "19450103-8220");
        assert.strictEqual(normalisePN(8707235340), "19870723-5340");
        assert.strictEqual(normalisePN("9303114202"), "19930311-4202");
        assert.strictEqual(normalisePN("19181129+3057"), "19181129-3057");
        assert.strictEqual(normalisePN("0001018126"), "20000101-8126");
        assert.strictEqual(normalisePN("000101-8126"), "20000101-8126");
        assert.strictEqual(normalisePN("000101+8126"), "19000101-8126");
        assert.strictEqual(normalisePN("071029-0024"), "20071029-0024");
        assert.strictEqual(normalisePN("030405-9231"), "20030405-9231");
    });
});

describe("#validatePN()", function () {
    it("should validate: correct personnummer", function () {
        assert.strictEqual(validatePN("450103-8220"), true);
        assert.strictEqual(validatePN("870613-5657"), true);
        assert.strictEqual(validatePN(9307174459), true);
        assert.strictEqual(validatePN("0010237808"), true);
        assert.strictEqual(validatePN("0512240169"), true);
        assert.strictEqual(validatePN("150314+5425"), true);
        assert.strictEqual(validatePN("0512240169"), true);
        assert.strictEqual(validatePN("19181129+3057"), true);
    });

    it("should not validate: incorrect personnummer dates", function () {
        assert.strictEqual(validatePN("999999-5476"), false);
        assert.strictEqual(validatePN("191313-8473"), false);
        assert.strictEqual(validatePN(1006334351), false);
        assert.strictEqual(validatePN("0014234561"), false);
    });

    it("should not validate: incorrect personnummer format or incorrect type", function () {
        assert.strictEqual(validatePN(undefined as any), false);
        assert.strictEqual(validatePN(null as any), false);
        assert.strictEqual(validatePN([] as any), false);
        assert.strictEqual(validatePN({} as any), false);
        assert.strictEqual(validatePN(false as any), false);
        assert.strictEqual(validatePN(true as any), false);
        assert.strictEqual(validatePN(123), false);
        assert.strictEqual(validatePN("123"), false);
        assert.strictEqual(validatePN("123-123"), false);
        assert.strictEqual(validatePN("123_123"), false);
        assert.strictEqual(validatePN("123?123"), false);
        assert.strictEqual(validatePN("string"), false);
        assert.strictEqual(validatePN("123-abc"), false);
        assert.strictEqual(validatePN("670427-554"), false);
        assert.strictEqual(validatePN("040229-074"), false);
    });

    it("should not validate: incorrect personnummer checksum", function () {
        assert.strictEqual(validatePN("320323-9325"), false);
        assert.strictEqual(validatePN("870514-3202"), false);
        assert.strictEqual(validatePN(1806282244), false);
        assert.strictEqual(validatePN("471224-0907"), false);
    });

    it("should validate: co-ordination numbers", function () {
        assert.strictEqual(validatePN("0411643844"), true);
        assert.strictEqual(validatePN(1103784755), true);
        assert.strictEqual(validatePN("0311803860"), true);
        assert.strictEqual(validatePN("430688-0362"), true);
    });

    it("should not validate: incorrect co-ordination numbers", function () {
        assert.strictEqual(validatePN("370567-4738"), false);
        assert.strictEqual(validatePN("871161-2345"), false);
        assert.strictEqual(validatePN(121272846), false);
        assert.strictEqual(validatePN("080690-4857"), false);
    });

    it("should validate: correct leapyear", function () {
        assert.strictEqual(validatePN("20000229-6127"), true);
        assert.strictEqual(validatePN(9602296973), true);
        assert.strictEqual(validatePN(9202294402), true);
        assert.strictEqual(validatePN("960229-6973"), true);
    });

    it("should not validate: incorrect leapyear", function () {
        assert.strictEqual(validatePN("20010229-2391"), false);
        assert.strictEqual(validatePN(9802293231), false);
        assert.strictEqual(validatePN(200002293243), false);
        assert.strictEqual(validatePN("960229-4534"), false);
    });
});

describe("#validateCIN()", function () {
    it("should validate correct: corporate identity number", function () {
        assert.strictEqual(validateCIN("502068-4865"), true);
        assert.strictEqual(validateCIN("556754-8283"), true);
        assert.strictEqual(validateCIN("802521-6220"), true);
        assert.strictEqual(validateCIN("802467-7182"), true);
    });
});

describe("#normaliseCIN()", function () {
    it("should normalise correct: corporate identity number", function () {
        assert.strictEqual(normaliseCIN("502068-4865"), "165020684865");
        assert.strictEqual(normaliseCIN("5567548283"), "165567548283");
        assert.strictEqual(normaliseCIN("16802521-6220"), "168025216220");
        assert.strictEqual(normaliseCIN("168024677182"), "168024677182");
        assert.strictEqual(normaliseCIN("870613-5657"), "19870613-5657");
    });
});

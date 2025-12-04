import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b04/names/Name";
import { StringName } from "../../../src/adap-b04/names/StringName";
import { StringArrayName } from "../../../src/adap-b04/names/StringArrayName";
import { IllegalArgumentException } from "../../../src/adap-b04/common/IllegalArgumentException";

describe("Basic StringName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss.fau.de");
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringName("oss.cs.fau");
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Basic StringArrayName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss#fau#de", '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    let n: Name = new StringName("oss.cs.fau.de", '#');
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });
});

describe("Invalid argument tests", () => {
  it("test preconditions", () => {
    let arr: string[] = ["oss", "cs", "fau", "de"];
    let sn: Name = new StringName(arr.join("."));
    let san: Name = new StringArrayName(arr);
    expect(() => sn.getComponent(-1)).toThrowError(expect.any(IllegalArgumentException));
    expect(() => sn.getComponent(4)).toThrowError(expect.any(IllegalArgumentException));
    expect(() => sn.setComponent(-1, "ab")).toThrowError(expect.any(IllegalArgumentException));
    expect(() => sn.setComponent(4, "ab")).toThrowError(expect.any(IllegalArgumentException));
    expect(() => sn.remove(-1)).toThrowError(expect.any(IllegalArgumentException));
    expect(() => sn.remove(4)).toThrowError(expect.any(IllegalArgumentException));
    expect(() => san.getComponent(-1)).toThrowError(expect.any(IllegalArgumentException));
    expect(() => san.getComponent(4)).toThrowError(expect.any(IllegalArgumentException));
    expect(() => san.setComponent(-1, "ab")).toThrowError(expect.any(IllegalArgumentException));
    expect(() => san.setComponent(4, "ab")).toThrowError(expect.any(IllegalArgumentException));
    expect(() => san.remove(-1)).toThrowError(expect.any(IllegalArgumentException));
    expect(() => san.remove(4)).toThrowError(expect.any(IllegalArgumentException));

    expect(() => sn.append("a.b")).toThrowError(expect.any(IllegalArgumentException));
    expect(() => sn.setComponent(2, "a.b")).toThrowError(expect.any(IllegalArgumentException));
    expect(() => sn.insert(1, "a.b")).toThrowError(expect.any(IllegalArgumentException));
    expect(() => san.append("a.b")).toThrowError(expect.any(IllegalArgumentException));
    expect(() => san.setComponent(2, "a.b")).toThrowError(expect.any(IllegalArgumentException));
    expect(() => san.insert(1, "a.b")).toThrowError(expect.any(IllegalArgumentException));

    let snr: Name = new StringArrayName(arr, '#');

    expect(() => sn.concat(snr)).toThrowError(expect.any(IllegalArgumentException));
    expect(() => san.concat(snr)).toThrowError(expect.any(IllegalArgumentException));
  });
});

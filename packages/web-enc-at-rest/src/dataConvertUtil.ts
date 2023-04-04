/*
MIT License

Copyright (c) 2022 Erik Hermansen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

const textEncoder = new TextEncoder();
export function stringToBytes(text:string):Uint8Array {
  return textEncoder.encode(text);
}

const textDecoder = new TextDecoder();
export function bytesToString(utf8Array:Uint8Array):string {
  return textDecoder.decode(utf8Array);
}

/* The purpose of the replacement table is to fix some primitive values that otherwise would not survive JSON.stringify(JSON.parse()) (de)serialization.
   I would love to include "undefined" below too, but on the JSON.parse() execution, an "undefined" value will always omit the the variable from 
   the parse. You could avoid serializing variables with undefined values, e.g. { x:undefined }. Or you could use (de)serialization other than JSON.*.
   
    = an escaping prefix that is very unlikely to be part of the passed in data. */
const replacementTable = [
  [Infinity, 'infinity'],
  [-Infinity, '-infinity'],
  [NaN, 'NaN']
];

export interface IReplacer { (key:string, value:any):string }
export interface IReviver { (key:string, value:string):any }

function _replacePrimitiveValues(value:any):string {
  if (Number.isNaN(value)) return 'NaN'; // === comparison below won't work.
  for(let i = 0; i < replacementTable.length; ++i) {
    // @ts-ignore
    if (replacementTable[i][0] === value) return replacementTable[i][1] as string;
  }
  return value;
}

function _revivePrimitiveValues(value:string):any {
  for(let i = 0; i < replacementTable.length; ++i) {
    // @ts-ignore
    if (replacementTable[i][1] === value) return replacementTable[i][0];
  }
  return value;
}

export function anyToString(value:any, replacer?:IReplacer):string {
  return JSON.stringify(value, (key, value) => {
    let updatedValue = _replacePrimitiveValues(value);
    return replacer ? replacer(key, updatedValue) : updatedValue;
  });
}

export function anyToBytes(value:any, replacer?:IReplacer):Uint8Array {
  return stringToBytes(anyToString(value, replacer));
}

export function bytesToAny(bytes:Uint8Array, reviver?:IReviver):any {
  const text = bytesToString(bytes);
  return JSON.parse(text, (key, value) => {
    let updatedValue = _revivePrimitiveValues(value);
    return reviver ? reviver(key, updatedValue) : updatedValue;
  });
}

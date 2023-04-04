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

/* Returns the crypto.subtle instance after verifying it has all methods needed. By design, this function will never 
   polyfill. The implementor of app code can choose to polyfill before this function is called, and great care is 
   recommending in choosing any polyfills. */
export function getSubtle():SubtleCrypto {
  const subtle = globalThis.crypto && globalThis.crypto.subtle;
  if (!subtle) throw Error('Browser does not implement Web Crypto.');
  if (!subtle.importKey || !subtle.deriveKey || !subtle.decrypt || !subtle.encrypt || !subtle.exportKey) throw Error('Web Crypto on this browser does not implement required APIs.');
  return subtle;
}

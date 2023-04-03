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

import { base64ToBytes, bytesToBase64 } from "./base64Util";

const WEAR_PREFIX = 'WEAR_keyGen_';
const DERIVE_KEY_SALT = `${WEAR_PREFIX}deriveKeySalt`;
const CREDENTIAL_PROOF = `${WEAR_PREFIX}credentialProof`;

export function getDeriveKeySalt():Uint8Array|null {
  const value = global.localStorage.getItem(DERIVE_KEY_SALT);
  return value === null ? null : base64ToBytes(value);
}

export function setDeriveKeySalt(deriveKeySalt:Uint8Array|null) {
  if (deriveKeySalt === null) {
    global.localStorage.removeItem(DERIVE_KEY_SALT);
    return;
  }
  global.localStorage.setItem(DERIVE_KEY_SALT, bytesToBase64(deriveKeySalt));
}

export function getCredentialProof():Uint8Array|null {
  const value = global.localStorage.getItem(CREDENTIAL_PROOF);
  return value === null ? null : base64ToBytes(value);
}

export function setCredentialProof(credentialProof:Uint8Array|null) {
  if (credentialProof === null) {
    global.localStorage.removeItem(CREDENTIAL_PROOF);
    return;
  }
  global.localStorage.setItem(CREDENTIAL_PROOF, bytesToBase64(credentialProof));
}

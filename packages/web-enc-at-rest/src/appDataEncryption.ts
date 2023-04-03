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

import { getSubtle } from './protectedCrypto';
import { randomBytes } from "./randomUtil";

const AES_GCM_IV_LENGTH = 12;
export async function encryptAppData(credentialKey:CryptoKey, data:Uint8Array):Promise<Uint8Array> {
  const subtle = getSubtle();
  const iv = randomBytes(AES_GCM_IV_LENGTH);
  const algorithmParams:AesGcmParams = {name: 'AES-GCM', iv };
  const cipherText = await subtle.encrypt(algorithmParams, credentialKey, data);
  const fullMessage:Uint8Array = new Uint8Array(AES_GCM_IV_LENGTH + cipherText.byteLength);
  fullMessage.set(iv);
  fullMessage.set(new Uint8Array(cipherText), AES_GCM_IV_LENGTH);
  return fullMessage;
}

export async function decryptAppData(credentialKey:CryptoKey, ivPlusEncryptedData:Uint8Array):Promise<any> {
  const subtle = getSubtle();
  const iv = ivPlusEncryptedData.slice(0, AES_GCM_IV_LENGTH);
  const cipherText = ivPlusEncryptedData.slice(AES_GCM_IV_LENGTH);
  const algorithmParams:AesGcmParams = {name: 'AES-GCM', iv};
  const plainText = await subtle.decrypt(algorithmParams, credentialKey, cipherText);
  return new Uint8Array(plainText);
}

const PI = [58, 50, 42, 34, 26, 18, 10, 2,
  60, 52, 44, 36, 28, 20, 12, 4,
  62, 54, 46, 38, 30, 22, 14, 6,
  64, 56, 48, 40, 32, 24, 16, 8,
  57, 49, 41, 33, 25, 17, 9, 1,
  59, 51, 43, 35, 27, 19, 11, 3,
  61, 53, 45, 37, 29, 21, 13, 5,
  63, 55, 47, 39, 31, 23, 15, 7];

const CP_1 = [57, 49, 41, 33, 25, 17, 9,
  1, 58, 50, 42, 34, 26, 18,
  10, 2, 59, 51, 43, 35, 27,
  19, 11, 3, 60, 52, 44, 36,
  63, 55, 47, 39, 31, 23, 15,
  7, 62, 54, 46, 38, 30, 22,
  14, 6, 61, 53, 45, 37, 29,
  21, 13, 5, 28, 20, 12, 4];

const CP_2 = [14, 17, 11, 24, 1, 5, 3, 28,
  15, 6, 21, 10, 23, 19, 12, 4,
  26, 8, 16, 7, 27, 20, 13, 2,
  41, 52, 31, 37, 47, 55, 30, 40,
  51, 45, 33, 48, 44, 49, 39, 56,
  34, 53, 46, 42, 50, 36, 29, 32];

const E = [32, 1, 2, 3, 4, 5,
  4, 5, 6, 7, 8, 9,
  8, 9, 10, 11, 12, 13,
  12, 13, 14, 15, 16, 17,
  16, 17, 18, 19, 20, 21,
  20, 21, 22, 23, 24, 25,
  24, 25, 26, 27, 28, 29,
  28, 29, 30, 31, 32, 1];

const S_BOX = [
  [[14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
    [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
    [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
    [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13],
  ],
  [[15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
    [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
    [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
    [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9],
  ],
  [[10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
    [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
    [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
    [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12],
  ],
  [[7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
    [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
    [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
    [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14],
  ],
  [[2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
    [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
    [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
    [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3],
  ],
  [[12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
    [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
    [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
    [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13],
  ],
  [[4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
    [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
    [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
    [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12],
  ],
  [[13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
    [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
    [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
    [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11],
  ],
];

const P = [16, 7, 20, 21, 29, 12, 28, 17,
  1, 15, 23, 26, 5, 18, 31, 10,
  2, 8, 24, 14, 32, 27, 3, 9,
  19, 13, 30, 6, 22, 11, 4, 25];

const PI_1 = [40, 8, 48, 16, 56, 24, 64, 32,
  39, 7, 47, 15, 55, 23, 63, 31,
  38, 6, 46, 14, 54, 22, 62, 30,
  37, 5, 45, 13, 53, 21, 61, 29,
  36, 4, 44, 12, 52, 20, 60, 28,
  35, 3, 43, 11, 51, 19, 59, 27,
  34, 2, 42, 10, 50, 18, 58, 26,
  33, 1, 41, 9, 49, 17, 57, 25];

const SHIFT = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

function* chunks(array, n) {
  for (let i = 0; i < array.length; i += n) {
    yield array.slice(i, i + n);
  }
}

const CHUNK_LENGTH = 64;
const KEY_LENGTH = 56;
const ROUNDS = 16;
const ACTION = {
  ENCRYPT: "ENCRYPT",
  DECRYPT: "DECRYPT",
};

function uintToString(arr) {
  return arr.join(",");
}

function stringToUint(str) {
  return Uint8Array.from(str.split(',').map((v) => Number(v)));
}

class DES {
  constructor(key) {
    let bitsKey = this.toBits(key).slice(0, 64);
    bitsKey = this.padStart(bitsKey, 64);
    let permutedKey = this.permute(CP_1, bitsKey);
    this.roundKeys = this.generateRoundKeys(permutedKey);
  }

  generateRoundKeys(permutedKey) {
    const roundKeys = [];
    for (let round = 0; round < ROUNDS; round++) {
      const shift = SHIFT[round];
      const leftPart = permutedKey.slice(0, KEY_LENGTH / 2);
      const rightPart = permutedKey.slice(KEY_LENGTH / 2);
      const leftPartShifted = this.cyclicShiftLeft(leftPart, shift);
      const rightPartShifted = this.cyclicShiftLeft(rightPart, shift);
      permutedKey = [...leftPartShifted, ...rightPartShifted];
      const roundKey = this.permute(CP_2, permutedKey);
      roundKeys.push(roundKey);
    }
    return roundKeys;
  }

  createZeroArray(length) {
    return Array.from(new Array(length), () => 0);
  }

  proceedComputations(message, action) {
    let bits = this.toBits(message);
    const offset = bits.length % CHUNK_LENGTH;
    if (offset !== 0) {
      // to 64 len
      bits.push(...this.createZeroArray(offset));
    }
    const roundKeys = action === ACTION.DECRYPT ? [...this.roundKeys].reverse() : this.roundKeys;
    const resultMessage = [];
    for (const chunk of chunks(bits, CHUNK_LENGTH)) {
      let permutedBits = this.permute(PI, chunk);
      let rightPart = permutedBits.slice(CHUNK_LENGTH / 2);
      let leftPart = permutedBits.slice(0, CHUNK_LENGTH / 2);
      for (let round = 0; round < ROUNDS; round++) {
        const extendedRightPart = this.permute(E, rightPart);
        const roundKey = roundKeys[round];
        const xored = this.xor(extendedRightPart, roundKey);
        let newRightPart = [];
        for (const [sIndex, group] of Array.from(chunks(xored, 6)).entries()) {
          const sBlock = S_BOX[sIndex];
          const rowNumber = this.bitsToNumber([group[0], group[5]]);
          const columnNumber = this.bitsToNumber(group.slice(1, 5));
          const sResult = this.toBits(sBlock[rowNumber][columnNumber], 4);
          newRightPart.push(...sResult);
        }
        newRightPart = this.permute(P, newRightPart);
        newRightPart = this.xor(newRightPart, leftPart);
        leftPart = rightPart;
        rightPart = newRightPart;
      }
      let result = [...rightPart, ...leftPart];
      result = this.permute(PI_1, result);
      resultMessage.push(...result);
    }
    if (typeof message === "string") {
      return this.bitsToBytes(resultMessage);
    }
    return this.bitsToText(resultMessage);
  }

  encrypt(message) {
    return uintToString(this.proceedComputations(message, ACTION.ENCRYPT));
  }

  encryptObject(obj) {
    return this.encrypt(JSON.stringify(obj));
  }

  decryptToObject(message) {
    try {
      return JSON.parse(this.decrypt(message));
    } catch (err) {
      throw new Error(`Invalid message ${err.message}`);
    }
  }

  decrypt(message) {
    // console.log(`Mess: ${message}`)
    return this.proceedComputations(stringToUint(message), ACTION.DECRYPT);
  }

  permute(bitmap, old) {
    return bitmap.map((oldIndex) => old[oldIndex - 1]);
  }

  toBits(value, bitsLength = 8) {
   
    if (typeof value === "number") {
      return value
        .toString(2)
        .padStart(bitsLength)
        .split("")
        .map((v) => Number(v));
    }
    if (typeof value === "string") {
      let utf8Encode = new TextEncoder();
      return Array.from(utf8Encode.encode(value))
        .map((num) => this.toBits(num, bitsLength))
        .flat();
    }
    return Array.from(value)
      .map((num) => this.toBits(num, bitsLength))
      .flat();
  }

  bitsToText(bits) {
    const byteArray = this.bitsToBytes(bits);
    const decoder = new TextDecoder();
    let res = decoder.decode(byteArray);
    while (res.charCodeAt(res.length - 1) === 0) {
      res = res.slice(0, res.length - 1);
    }
    return res;
  }

  bitsToBytes(bits) {
    return new Uint8Array(Array.from(chunks(bits, 8), (byte) => this.bitsToNumber(byte)));
  }

  bitsToNumber(bits) {
    return parseInt(bits.join(""), 2);
  }

  cyclicShiftLeft(array, shift) {
    return [...array.slice(shift), ...array.slice(0, shift)];
  }

  padStart(array, length) {
    if (array.length >= length) {
      return array;
    }
    return [...this.createZeroArray(length - array.length), ...array];
  }

  xor(firstArray, secondArray) {
      if (firstArray.length !== secondArray.length) {
        throw new Error("Invalid arrays length");
      }
      return firstArray.map((firstNumber, index) => {
        const secondNumber = secondArray[index];
        return secondNumber ^ firstNumber;
      });
  }
}

export default DES
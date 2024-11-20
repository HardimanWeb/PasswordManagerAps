let savedAdjustedKey = '';

// Fungsi untuk memperpanjang kunci jika panjangnya lebih pendek dari plainteks
function adjustKeyLength(key, plaintext) {
  let extendedKey = key;
  let index = 0;
  while (extendedKey.length < plaintext.length) {
    extendedKey += plaintext[index % plaintext.length];
    index++;
  }
  savedAdjustedKey = extendedKey;
  return extendedKey;
}

// Fungsi enkripsi Vigenere Cipher
function vigenereEncrypt(plaintext, key) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let ciphertext = '';

  plaintext = plaintext.toUpperCase();
  key = key.toUpperCase();

  let adjustedKey = adjustKeyLength(key, plaintext);

  for (let i = 0; i < plaintext.length; i++) {
    if (alphabet.includes(plaintext[i])) {
      let pIndex = alphabet.indexOf(plaintext[i]);
      let kIndex = alphabet.indexOf(adjustedKey[i]);
      let cIndex = (pIndex + kIndex) % alphabet.length;
      ciphertext += alphabet[cIndex];
    } else {
      ciphertext += plaintext[i];
    }
  }
  const shiftedCiphertext = shiftCipher(ciphertext, 2);
  
  // Membuat objek untuk dikembalikan
  return {
    ciphertext: shiftedCiphertext,
    key: savedAdjustedKey,
  };
}

// Fungsi untuk menggeser ciphertext sejumlah n posisi
function shiftCipher(text, shift) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let shiftedText = '';

  for (let i = 0; i < text.length; i++) {
    if (alphabet.includes(text[i])) {
      let index = (alphabet.indexOf(text[i]) + shift + alphabet.length) % alphabet.length;
      shiftedText += alphabet[index];
    } else {
      shiftedText += text[i];
    }
  }
  return shiftedText;
}

// Fungsi untuk mendekripsi data terenkripsi Vigenere Cipher
function vigenereDecrypt(ciphertext, key) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let plaintext = '';

  ciphertext = ciphertext.toUpperCase();
  // key = key.toUpperCase();

  let adjustedKey = key;
  // console.log("ini key : " + adjustedKey);

  for (let i = 0; i < ciphertext.length; i++) {
    if (alphabet.includes(ciphertext[i])) {
      let cIndex = alphabet.indexOf(ciphertext[i]);
      let kIndex = alphabet.indexOf(adjustedKey[i]);
      let pIndex = (cIndex - kIndex + alphabet.length) % alphabet.length;
      plaintext += alphabet[pIndex];
    } else {
      plaintext += ciphertext[i];
    }
  }

  // Reverse the shift by 2 positions
  return shiftCipher(plaintext, -2);
}

// Fungsi untuk menghasilkan kunci otomatis menggunakan nanoid sepanjang 8
function generateKey(length = 8) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  
// Export fungsi untuk digunakan dalam modul lain
module.exports = {
  vigenereEncrypt,
  vigenereDecrypt,
  generateKey,
};


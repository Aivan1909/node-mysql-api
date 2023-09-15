var CryptoJS = require("crypto-js");
const config = require('./../config')

const algorithm = "aes-192-cbc";
const clave = config.crypt

const encrypt = (text) => {
  //generate encryption key using the secret.
  crypto.scrypt(clave, 'salt', 24, (err, key) => {
    if (err) throw err;

    //create an initialization vector
    crypto.randomFill(new Uint8Array(16), (err, iv) => {
      if (err) throw err;

      const cipher = crypto.createCipheriv(algorithm, key, iv);

      let encrypted = '';
      cipher.setEncoding('hex');

      cipher.on('data', (chunk) => encrypted += chunk);
      cipher.on('end', () => console.log(encrypted))
      cipher.on('error', (err) => console.log(err))

      cipher.write(text);
      cipher.end();
    });
  });
}

const decrypt = (encrypted, iv) => {
  //generate encryption key using secret
  crypto.scrypt(clave, 'salt', 24, (err, key) => {
    if (err) throw err;

    //create decipher object
    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted = '';
    decipher.on('readable', () => {
      while (null !== (chunk = decipher.read())) {
        decrypted += chunk.toString('utf8');
      }
    });
    decipher.on('end', () => console.log(decrypted));
    decipher.on('error', (err) => console.log(err))

    decipher.write(encrypted, 'hex');
    decipher.end();
  })
}

const encryptar = (texto) => {
  return CryptoJS.AES.encrypt(texto.toString(), clave).toString();
}

const desencryptar = (encriptado) => {
  var bytes = CryptoJS.AES.decrypt(encriptado.toString(), clave);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export { encrypt, decrypt, encryptar, desencryptar }

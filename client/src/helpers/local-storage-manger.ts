import CryptoJS from "crypto-js";

const SECRET_KEY = "NG_@#_SECRET_KEY";

export const decodeToken = (token: string): any => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (error) {
    console.error("Invalid token format:", error);
    return null;
  }
};

export const encryptData = (data: any): string | null => {
  try {
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    return ciphertext;
  } catch (error) {
    console.error("Encryption failed:", error);
    return null;
  }
};

export const decryptData = (encryptedData: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};

export class LocalStorageManager {
  static setItem(key: string, data: any): void {
    const encryptedValue = encryptData(data);
    if (encryptedValue) {
      localStorage.setItem(key, encryptedValue);
    } else {
      console.error(`Failed to set item in localStorage for key: ${key}`);
    }
  }

  static getItem(key: string): any {
    const encryptedValue = localStorage.getItem(key);
    if (!encryptedValue) {
      console.warn(`No value found in localStorage for key: ${key}`);
      return null;
    }

    const decryptedValue = decryptData(encryptedValue);
    if (decryptedValue !== null) {
      return decryptedValue;
    } else {
      console.warn(`Failed to decrypt value for key: ${key}`);
      return encryptedValue; // Return encrypted value as fallback
    }
  }

  static removeItem(key: string): any {
    const value = this.getItem(key);
    localStorage.removeItem(key);
    return value;
  }

  static clear(): void {
    localStorage.clear();
  }
}

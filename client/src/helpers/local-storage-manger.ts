import CryptoJS from "crypto-js";

const SECRET_KEY = "NG_@#_SECRET_KEY";

export const decodeToken = (token: string): any => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (error) {
    console.error("Invalid token format:", error);
    return null;
  }
};

export const encryptData = (data: any): string | null => {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  } catch (error) {
    console.error("Encryption failed:", error);
    return null;
  }
};

export const decryptData = (encryptedData: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
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
      console.error("Failed to set item in localStorage");
    }
  }

  static getItem(key: string): any {
    const encryptedValue = localStorage.getItem(key);
    if (encryptedValue) {
      const decryptedValue = decryptData(encryptedValue);
      if (decryptedValue !== null) {
        return decryptedValue;
      } else {
        console.warn(`Failed to decrypt value for key: ${key}`);
        return encryptedValue; // Return encrypted value as fallback
      }
    } else {
      console.warn(`No value found in localStorage for key: ${key}`);
      return null;
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

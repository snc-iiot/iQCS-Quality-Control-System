interface IBase64Helper {
  getBase64: (file: File) => Promise<string>;
  getBase64FromUrl: (url: string) => Promise<string>;
  getBase64FromBlob: (blob: Blob) => Promise<string>;
  getBase64FromCanvas: (canvas: HTMLCanvasElement) => Promise<string>;
  getBase64FromImage: (image: HTMLImageElement) => Promise<string>;
  getBase64FromVideo: (video: HTMLVideoElement) => Promise<string>;
  getBase64FromMediaStream: (mediaStream: MediaStream) => Promise<string>;
  resizingImage: (file: File, maxWidth: number, maxHeight: number) => Promise<File>;
  getImageBase64: (file: File, maxWidth: number, maxHeight: number) => Promise<string>;
}

export class Base64Helper implements IBase64Helper {
  /**
   * The function `getBase64` asynchronously converts a File object to a base64 string using FileReader
   * in TypeScript.
   * @param {File} file - The `file` parameter in the `getBase64` function is of type `File`, which
   * represents a file from the user's system that can be read by the FileReader API.
   * @returns The `getBase64` function returns a Promise that resolves to a base64 encoded string
   * representing the contents of the provided `File` object.
   */
  public async getBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * The function getImageBase64 asynchronously resizes an image file and returns its base64
   * representation.
   * @param {File} file - The `file` parameter in the `getImageBase64` function is of type `File`, which
   * typically represents a file uploaded by the user through an input field in a web application.
   * @param {number} maxWidth - The `maxWidth` parameter specifies the maximum width that the image
   * should be resized to. This value is used to determine the width of the resized image while
   * maintaining its aspect ratio.
   * @param {number} maxHeight - The `maxHeight` parameter specifies the maximum height that the image
   * should be resized to while maintaining its aspect ratio.
   * @returns The `getImageBase64` function returns a Promise that resolves to a string, which is the
   * base64 representation of the resized image file.
   */
  public async getImageBase64(file: File, maxWidth: number, maxHeight: number): Promise<string> {
    const newFile = await this.resizingImage(file, maxWidth, maxHeight);
    return this.getBase64(newFile);
  }

  /**
   * The function `getBase64FromUrl` asynchronously fetches a resource from a URL and converts it to a
   * base64 encoded string.
   * @param {string} url - The `url` parameter is a string that represents the URL of the resource from
   * which you want to retrieve data in base64 format.
   * @returns A Promise that resolves to a base64 encoded string representing the content of the URL
   * provided.
   */
  public async getBase64FromUrl(url: string): Promise<string> {
    return fetch(url)
      .then((response) => response.blob())
      .then((blob) => this.getBase64FromBlob(blob));
  }

  /**
   * The function `getBase64FromBlob` converts a Blob object to a base64 encoded string asynchronously.
   * @param {Blob} blob - The `blob` parameter in the `getBase64FromBlob` function is of type `Blob`,
   * which represents raw data in the form of a file-like object. This function reads the data from the
   * Blob object and converts it to a base64-encoded string asynchronously.
   * @returns A Promise that resolves to a base64 encoded string representing the data in the Blob
   * object.
   */
  public async getBase64FromBlob(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * The function `getBase64FromCanvas` asynchronously converts an HTML canvas element to a base64
   * encoded string.
   * @param {HTMLCanvasElement} canvas - An HTMLCanvasElement that represents a canvas element in the
   * HTML document.
   * @returns The function `getBase64FromCanvas` returns a Promise that resolves to a base64-encoded
   * image data URL generated from the provided HTMLCanvasElement.
   */
  public async getBase64FromCanvas(canvas: HTMLCanvasElement): Promise<string> {
    return canvas.toDataURL();
  }

  /**
   * The function `getBase64FromImage` converts an HTML image element to a base64 string using a canvas.
   * @param {HTMLImageElement} image - The `image` parameter is an HTMLImageElement, which represents an
   * image element in the HTML document.
   * @returns The `getBase64FromImage` function is returning a Promise that resolves to a base64 encoded
   * string representing the image data from the provided HTMLImageElement.
   */
  public async getBase64FromImage(image: HTMLImageElement): Promise<string> {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    context?.drawImage(image, 0, 0);
    return this.getBase64FromCanvas(canvas);
  }

  /**
   * The function `getBase64FromVideo` takes an HTML video element, captures a frame as a base64 image
   * using a canvas, and returns the base64 string.
   * @param {HTMLVideoElement} video - An HTMLVideoElement representing a video element in the DOM.
   * @returns The `getBase64FromVideo` method returns a Promise that resolves to a base64 encoded string
   * representing the content of the video element provided as input.
   */
  public async getBase64FromVideo(video: HTMLVideoElement): Promise<string> {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context?.drawImage(video, 0, 0);
    return this.getBase64FromCanvas(canvas);
  }

  /**
   * The function `getBase64FromMediaStream` creates a video element from a media stream, plays it, and
   * then retrieves the base64 data from the video.
   * @param {MediaStream} mediaStream - A MediaStream object that represents a stream of media content,
   * typically obtained from a user's camera or microphone.
   * @returns The `getBase64FromMediaStream` function returns a Promise that resolves to a base64 string
   * representing the media stream provided as an input.
   */
  public async getBase64FromMediaStream(mediaStream: MediaStream): Promise<string> {
    const video = document.createElement("video");
    video.srcObject = mediaStream;
    await video.play();
    return this.getBase64FromVideo(video);
  }

  /**
   * The function `resizingImage` asynchronously resizes an image file to fit within specified maximum
   * width and height dimensions.
   * @param {File} file - The `file` parameter in the `resizingImage` function represents the image file
   * that you want to resize. It should be of type `File`, which is a built-in JavaScript object
   * representing a file from the file system.
   * @param {number} maxWidth - The `maxWidth` parameter in the `resizingImage` function represents the
   * maximum width that the image should be resized to while maintaining its aspect ratio. If the
   * original image width is greater than this `maxWidth`, the function will resize the image
   * proportionally to fit within the specified `maxWidth`.
   * @param {number} maxHeight - The `maxHeight` parameter in the `resizingImage` function represents the
   * maximum height that the resized image should have. If the original image's height is greater than
   * this `maxHeight`, the function will proportionally resize the image to ensure that the height does
   * not exceed the specified maximum height while maintaining
   * @returns The `resizingImage` function returns a Promise that resolves to a File object after
   * resizing the input image file to fit within the specified maxWidth and maxHeight dimensions.
   */
  public async resizingImage(file: File, maxWidth: number, maxHeight: number): Promise<File> {
    const image = new Image();
    image.src = URL.createObjectURL(file);
    return new Promise((resolve) => {
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        let width = image.width;
        let height = image.height;
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        context?.drawImage(image, 0, 0, width, height);
        canvas.toBlob((blob) => {
          const newFile = new File([blob as Blob], file.name, { type: file.type });
          resolve(newFile);
        }, file.type);
      };
    });
  }
}

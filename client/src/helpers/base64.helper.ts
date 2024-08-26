interface IBase64Helper {
  getBase64: (file: File) => Promise<string>;
  getBase64FromUrl: (url: string) => Promise<string>;
  getBase64FromBlob: (blob: Blob) => Promise<string>;
  getBase64FromCanvas: (canvas: HTMLCanvasElement) => Promise<string>;
  getBase64FromImage: (image: HTMLImageElement) => Promise<string>;
  getBase64FromVideo: (video: HTMLVideoElement) => Promise<string>;
  getBase64FromMediaStream: (mediaStream: MediaStream) => Promise<string>;
}

export class Base64Helper implements IBase64Helper {
  public async getBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  public async getBase64FromUrl(url: string): Promise<string> {
    return fetch(url)
      .then((response) => response.blob())
      .then((blob) => this.getBase64FromBlob(blob));
  }

  public async getBase64FromBlob(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  public async getBase64FromCanvas(canvas: HTMLCanvasElement): Promise<string> {
    return canvas.toDataURL();
  }

  public async getBase64FromImage(image: HTMLImageElement): Promise<string> {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    context?.drawImage(image, 0, 0);
    return this.getBase64FromCanvas(canvas);
  }

  public async getBase64FromVideo(video: HTMLVideoElement): Promise<string> {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context?.drawImage(video, 0, 0);
    return this.getBase64FromCanvas(canvas);
  }

  public async getBase64FromMediaStream(mediaStream: MediaStream): Promise<string> {
    const video = document.createElement("video");
    video.srcObject = mediaStream;
    await video.play();
    return this.getBase64FromVideo(video);
  }
}

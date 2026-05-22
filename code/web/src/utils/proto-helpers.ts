/**
 * Protobuf 辅助工具函数
 * 包含类型守卫和 bytes 转换工具
 */
import { im_server } from '@/proto/generated';

export function isTextMessage(
  content: im_server.IMessageContent
): content is im_server.IMessageContent & { stringMessage: im_server.IStringMessageInfo } {
  return content.messageType === im_server.MessageType.STRING && !!content.stringMessage;
}

export function isImageMessage(
  content: im_server.IMessageContent
): content is im_server.IMessageContent & { imageMessage: im_server.IImageMessageInfo } {
  return content.messageType === im_server.MessageType.IMAGE && !!content.imageMessage;
}

export function isFileMessage(
  content: im_server.IMessageContent
): content is im_server.IMessageContent & { fileMessage: im_server.IFileMessageInfo } {
  return content.messageType === im_server.MessageType.FILE && !!content.fileMessage;
}

export function isSpeechMessage(
  content: im_server.IMessageContent
): content is im_server.IMessageContent & { speechMessage: im_server.ISpeechMessageInfo } {
  return content.messageType === im_server.MessageType.SPEECH && !!content.speechMessage;
}

export function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function base64ToUint8Array(base64: string): Uint8Array {
  const binary = window.atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function uint8ArrayToBlobURL(bytes: Uint8Array, mimeType: string): string {
  const arrayBuffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  const blob = new Blob([arrayBuffer], { type: mimeType });
  return URL.createObjectURL(blob);
}

export function fileToUint8Array(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      resolve(new Uint8Array(arrayBuffer));
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

/**
 * ID 生成工具
 * 参考 QT 客户端的 ID 生成方式
 */

export function makeRequestId(): string {
  const uuid = crypto.randomUUID();
  const id = uuid.slice(25, 12);
  return `R${id}`;
}

export function makeMessageId(): string {
  const uuid = crypto.randomUUID();
  const id = uuid.slice(25, 12);
  return `M${id}`;
}

export function makeEventId(): string {
  const uuid = crypto.randomUUID();
  const id = uuid.slice(25, 12);
  return `E${id}`;
}

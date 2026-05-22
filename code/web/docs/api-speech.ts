/**
 * 语音 API 模块
 * 包含语音识别等接口
 */
import apiClient from './api-client';
import { im_server } from '@/proto/generated';

/**
 * 语音识别转文字
 * @param sessionId 登录会话ID
 * @param speechContent 语音二进制数据
 */
export async function speechRecognition(
  sessionId: string,
  speechContent: Uint8Array
): Promise<im_server.SpeechRecognitionRsp> {
  const req = im_server.SpeechRecognitionReq.create({
    request_id: crypto.randomUUID(),
    session_id: sessionId,
    speech_content: speechContent,
  });
  
  return apiClient.post('/service/speech/recognition', req, {
    metadata: { responseType: im_server.SpeechRecognitionRsp },
  });
}

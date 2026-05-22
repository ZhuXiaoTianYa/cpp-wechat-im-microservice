/**
 * 文件 API 模块
 * 包含文件上传、下载等接口
 */
import apiClient from './api-client';
import { im_server } from '@/proto/generated';

/**
 * 下载单个文件
 * @param sessionId 登录会话ID
 * @param fileId 文件ID
 */
export async function getSingleFile(
  sessionId: string,
  fileId: string
): Promise<im_server.GetSingleFileRsp> {
  const req = im_server.GetSingleFileReq.create({
    request_id: crypto.randomUUID(),
    session_id: sessionId,
    file_id: fileId,
  });
  
  return apiClient.post('/service/file/get_single_file', req, {
    metadata: { responseType: im_server.GetSingleFileRsp },
  });
}

/**
 * 批量下载文件
 * @param sessionId 登录会话ID
 * @param fileIdList 文件ID列表
 */
export async function getMultiFile(
  sessionId: string,
  fileIdList: string[]
): Promise<im_server.GetMultiFileRsp> {
  const req = im_server.GetMultiFileReq.create({
    request_id: crypto.randomUUID(),
    session_id: sessionId,
    file_id_list: fileIdList,
  });
  
  return apiClient.post('/service/file/get_multi_file', req, {
    metadata: { responseType: im_server.GetMultiFileRsp },
  });
}

/**
 * 上传单个文件
 * @param sessionId 登录会话ID
 * @param fileName 文件名
 * @param fileSize 文件大小
 * @param fileContent 文件二进制数据
 */
export async function putSingleFile(
  sessionId: string,
  fileName: string,
  fileSize: number,
  fileContent: Uint8Array
): Promise<im_server.PutSingleFileRsp> {
  const req = im_server.PutSingleFileReq.create({
    request_id: crypto.randomUUID(),
    session_id: sessionId,
    file_data: {
      file_name: fileName,
      file_size: fileSize,
      file_content: fileContent,
    },
  });
  
  return apiClient.post('/service/file/put_single_file', req, {
    metadata: { responseType: im_server.PutSingleFileRsp },
  });
}

/**
 * 批量上传文件
 * @param sessionId 登录会话ID
 * @param fileDataList 文件数据列表
 */
export async function putMultiFile(
  sessionId: string,
  fileDataList: Array<{
    file_name: string;
    file_size: number;
    file_content: Uint8Array;
  }>
): Promise<im_server.PutMultiFileRsp> {
  const req = im_server.PutMultiFileReq.create({
    request_id: crypto.randomUUID(),
    session_id: sessionId,
    file_data: fileDataList,
  });
  
  return apiClient.post('/service/file/put_multi_file', req, {
    metadata: { responseType: im_server.PutMultiFileRsp },
  });
}

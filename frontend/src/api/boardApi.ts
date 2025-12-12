import axiosClient from './axiosClient'
import type {
  BoardWriteRequest,
  BoardUpdateRequest,
  BoardListItem,
  CommentListItem,
  PaginatedResponse,
  PageableQuery,
} from '@/types/api'

/* 게시판 API - SPEC: /api/board */

// 게시글 목록 조회 - GET /api/board/list
export interface BoardListQuery extends PageableQuery {
  keyword?: string
  category?: string
}
export const fetchBoardList = (params?: BoardListQuery) =>
  axiosClient
    .get<PaginatedResponse<BoardListItem>>('/board/list', { params })
    .then((res) => res.data)

// 게시글 상세 조회 - GET /api/board/{boardNo}
export interface BoardDetail {
  board_no: string
  title: string
  content: string
  writer_id: string
  board_category: string
  view: number
  created_at: string
  updated_at: string
  files?: { file_id: string; file_name: string; file_url: string }[]
}
export const fetchBoardDetail = (boardNo: string) =>
  axiosClient.get<BoardDetail>(`/board/${boardNo}`).then((res) => res.data)

// 게시글 작성 - POST /api/board/write
export const createBoard = (data: BoardWriteRequest) =>
  axiosClient.post<{ board_no: string }>('/board/write', data).then((res) => res.data)

// 게시글 수정 - PUT /api/board/{boardNo}
export const updateBoard = (boardNo: string, data: Omit<BoardUpdateRequest, 'board_no'>) =>
  axiosClient.put<void>(`/board/${boardNo}`, data).then((res) => res.data)

// 게시글 삭제 - DELETE /api/board/{boardNo}
export const deleteBoard = (boardNo: string) =>
  axiosClient.delete<void>(`/board/${boardNo}`).then((res) => res.data)

// 파일 업로드 - POST /api/board/upload
export const uploadBoardFiles = (files: File[]) => {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })
  return axiosClient
    .post<{ fileUrls: string[] }>('/board/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data)
}

// 파일 다운로드 - GET /api/board/file/{fileNo}
export const downloadBoardFile = (fileNo: string) =>
  axiosClient.get<Blob>(`/board/file/${fileNo}`, { responseType: 'blob' }).then((res) => res.data)

/* 댓글 API - SPEC: /api/comments */

// 댓글 목록 조회 - GET /api/comments/board/{boardNo}
export const fetchComments = (boardNo: string) =>
  axiosClient.get<CommentListItem[]>(`/comments/board/${boardNo}`).then((res) => res.data)

// 댓글 작성 - POST /api/comments/board/{boardNo}
export const createComment = (boardNo: string, data: { coComment: string; secretYn?: boolean }) =>
  axiosClient.post<CommentListItem>(`/comments/board/${boardNo}`, data).then((res) => res.data)

// 댓글 수정 - PUT /api/comments/{coNo}
export const updateComment = (coNo: string, data: { coComment: string }) =>
  axiosClient.put<CommentListItem>(`/comments/${coNo}`, data).then((res) => res.data)

// 댓글 삭제 - DELETE /api/comments/{coNo}
export const deleteComment = (coNo: string) =>
  axiosClient.delete<void>(`/comments/${coNo}`).then((res) => res.data)

import axiosClient from './axiosClient'
import type {
  BoardListItem,
  BoardFileItem,
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
  board_no: number
  title: string
  content: string
  writer_id: number
  writer_name: string
  board_category: string
  view: number
  secret_yn: string
  del_yn: string
  reg_date: string
  mod_date: string
  comment_count: number
  files?: BoardFileItem[]
}
export const fetchBoardDetail = (boardNo: string) =>
  axiosClient.get<BoardDetail>(`/board/${boardNo}`).then((res) => res.data)

// 게시글 작성 - POST /api/board/write (multipart/form-data)
export const createBoard = (data: {
  title: string
  content: string
  board_category: string
  secret_yn?: string
}, files?: File[]) => {
  const formData = new FormData()
  formData.append('title', data.title)
  formData.append('content', data.content)
  formData.append('boardCategory', data.board_category)
  formData.append('secretYn', data.secret_yn || 'N')

  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append('uploadFiles', file)
    })
  }

  return axiosClient
    .post<string>('/board/write', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data)
}

// 게시글 수정 - PUT /api/board/{boardNo}
export const updateBoard = (boardNo: string, data: {
  title: string
  content: string
  board_category: string
  secret_yn?: string
}) =>
  axiosClient.put<void>(`/board/${boardNo}`, {
    title: data.title,
    content: data.content,
    boardCategory: data.board_category,
    secretYn: data.secret_yn || 'N',
  }).then((res) => res.data)

// 게시글 삭제 - DELETE /api/board/{boardNo}
export const deleteBoard = (boardNo: string | number) =>
  axiosClient.delete<void>(`/board/${boardNo}`).then((res) => res.data)

// 파일 다운로드 - GET /api/board/file/{fileNo}
export const downloadBoardFile = (fileNo: number) =>
  axiosClient.get<Blob>(`/board/file/${fileNo}`, { responseType: 'blob' }).then((res) => res.data)

// 이미지 미리보기 URL 생성
export const getBoardImageUrl = (fileNo: number) =>
  `${axiosClient.defaults.baseURL}/board/image/${fileNo}`

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

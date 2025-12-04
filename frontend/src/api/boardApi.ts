import axiosClient from './axiosClient'
import type {
  BoardWriteRequest,
  BoardUpdateRequest,
  BoardDeleteRequest,
  BoardListItem,
  CommentWriteRequest,
  CommentUpdateRequest,
  CommentDeleteRequest,
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
    .get<PaginatedResponse<BoardListItem>>('/api/board/list', { params })
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
  axiosClient.get<BoardDetail>(`/api/board/${boardNo}`).then((res) => res.data)

// 게시글 작성 - POST /api/board/write
export const createBoard = (data: BoardWriteRequest) =>
  axiosClient.post<{ board_no: string }>('/api/board/write', data).then((res) => res.data)

// 게시글 수정 - POST /api/board/update
export const updateBoard = (data: BoardUpdateRequest) =>
  axiosClient.post<void>('/api/board/update', data).then((res) => res.data)

// 게시글 삭제 - POST /api/board/delete
export const deleteBoard = (data: BoardDeleteRequest) =>
  axiosClient.post<void>('/api/board/delete', data).then((res) => res.data)

/* 댓글 API - SPEC: /api/comment */

// 댓글 목록 조회 - GET /api/comment/list?boardNo=
export const fetchComments = (boardNo: string) =>
  axiosClient.get<CommentListItem[]>('/api/comment/list', { params: { boardNo } }).then((res) => res.data)

// 댓글 작성 - POST /api/comment/write
export const createComment = (data: CommentWriteRequest) =>
  axiosClient.post<void>('/api/comment/write', data).then((res) => res.data)

// 댓글 수정 - POST /api/comment/update
export const updateComment = (data: CommentUpdateRequest) =>
  axiosClient.post<void>('/api/comment/update', data).then((res) => res.data)

// 댓글 삭제 - POST /api/comment/delete
export const deleteComment = (data: CommentDeleteRequest) =>
  axiosClient.post<void>('/api/comment/delete', data).then((res) => res.data)

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

/* 게시판 API */

// 게시글 목록 조회
export const fetchBoardList = (category: string, params?: PageableQuery) =>
  axiosClient
    .get<PaginatedResponse<BoardListItem>>(`/board/${category}`, { params })
    .then((res) => res.data)

// 게시글 상세 조회
export interface BoardDetail {
  board_no: string
  title: string
  content: string
  writer_id: string
  board_category: string
  view: number
  created_at: string
  updated_at: string
}
export const fetchBoardDetail = (boardNo: string) =>
  axiosClient.get<BoardDetail>(`/board/detail/${boardNo}`).then((res) => res.data)

// 게시글 작성
export const createBoard = (data: BoardWriteRequest) =>
  axiosClient.post<void>('/board', data).then((res) => res.data)

// 게시글 수정
export const updateBoard = (data: BoardUpdateRequest) =>
  axiosClient.put<void>('/board', data).then((res) => res.data)

// 게시글 삭제
export const deleteBoard = (data: BoardDeleteRequest) =>
  axiosClient.delete<void>('/board', { data }).then((res) => res.data)

/* 댓글 API */

// 댓글 목록 조회
export const fetchComments = (boardNo: string) =>
  axiosClient.get<CommentListItem[]>(`/comment/${boardNo}`).then((res) => res.data)

// 댓글 작성
export const createComment = (data: CommentWriteRequest) =>
  axiosClient.post<void>('/comment', data).then((res) => res.data)

// 댓글 수정
export const updateComment = (data: CommentUpdateRequest) =>
  axiosClient.put<void>('/comment', data).then((res) => res.data)

// 댓글 삭제
export const deleteComment = (data: CommentDeleteRequest) =>
  axiosClient.delete<void>('/comment', { data }).then((res) => res.data)

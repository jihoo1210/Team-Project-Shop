import axiosClient from './axiosClient'

// 백엔드 응답 형식: { success: boolean, result: T, message?: string }
interface ApiResponse<T> {
  success: boolean
  result: T
  message?: string
}

/* 배송지 타입 */
export interface Address {
  addrNo: number
  addrName: string       // 배송지명 (예: 집, 회사)
  receiverName: string   // 수령인 이름
  receiverPhone: string  // 수령인 연락처
  zipcode: string        // 우편번호
  address: string        // 기본 주소
  addrDetail: string     // 상세 주소
  isDefault: 'Y' | 'N'   // 기본 배송지 여부
}

export interface AddressRequest {
  addrName: string
  receiverName: string
  receiverPhone: string
  zipcode: string
  address: string
  addrDetail?: string
}

/* 배송지 API - SPEC: /api/address */

// 내 배송지 목록 조회 - GET /api/address
export const fetchAddresses = () =>
  axiosClient.get<ApiResponse<Address[]>>('/address').then((res) => res.data.result)

// 배송지 추가 - POST /api/address (최대 3개)
export const addAddress = (data: AddressRequest) =>
  axiosClient.post<ApiResponse<void>>('/address', data).then((res) => res.data.result)

// 배송지 수정 - PUT /api/address/{addrNo}
export const updateAddress = (addrNo: number, data: AddressRequest) =>
  axiosClient.put<ApiResponse<void>>(`/address/${addrNo}`, data).then((res) => res.data.result)

// 배송지 삭제 - DELETE /api/address/{addrNo}
export const deleteAddress = (addrNo: number) =>
  axiosClient.delete<ApiResponse<void>>(`/address/${addrNo}`).then((res) => res.data.result)

// 기본 배송지 설정 - PUT /api/address/{addrNo}/default
export const setDefaultAddress = (addrNo: number) =>
  axiosClient.put<ApiResponse<void>>(`/address/${addrNo}/default`).then((res) => res.data.result)

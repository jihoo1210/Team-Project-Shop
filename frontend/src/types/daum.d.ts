// 다음 우편번호 API 타입 선언
declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeData) => void
        onclose?: () => void
        width?: string | number
        height?: string | number
      }) => {
        open: () => void
        embed: (element: HTMLElement) => void
      }
    }
  }
}

export interface DaumPostcodeData {
  zonecode: string // 우편번호
  address: string // 기본 주소
  addressEnglish: string // 영문 주소
  addressType: 'R' | 'J' // R: 도로명, J: 지번
  userSelectedType: 'R' | 'J'
  noSelected: 'Y' | 'N'
  userLanguageType: 'K' | 'E'
  roadAddress: string // 도로명 주소
  roadAddressEnglish: string
  jibunAddress: string // 지번 주소
  jibunAddressEnglish: string
  autoRoadAddress: string
  autoRoadAddressEnglish: string
  autoJibunAddress: string
  autoJibunAddressEnglish: string
  buildingCode: string
  buildingName: string
  apartment: 'Y' | 'N'
  sido: string // 시/도
  sigungu: string // 시/군/구
  sigunguCode: string
  roadnameCode: string
  bcode: string // 법정동 코드
  roadname: string // 도로명
  bname: string // 법정동/법정리
  bname1: string
  bname2: string
  hname: string // 행정동
  query: string
}

export {}

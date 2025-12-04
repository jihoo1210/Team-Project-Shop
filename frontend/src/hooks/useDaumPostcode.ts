import { useCallback } from 'react'
import type { DaumPostcodeData } from '@/types/daum.d'

interface AddressResult {
  zonecode: string
  address: string
  roadAddress: string
  jibunAddress: string
  buildingName: string
}

/**
 * 다음 우편번호 API 훅
 * SPEC: 주소 검색 (다음 API 연동) [우편번호만]
 */
export const useDaumPostcode = () => {
  const openPostcode = useCallback((onComplete: (result: AddressResult) => void) => {
    // 다음 우편번호 스크립트 동적 로드
    const script = document.createElement('script')
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.async = true
    
    script.onload = () => {
      new window.daum.Postcode({
        oncomplete: (data: DaumPostcodeData) => {
          // 도로명 주소 우선, 없으면 지번 주소
          const address = data.roadAddress || data.jibunAddress
          
          onComplete({
            zonecode: data.zonecode,
            address: address,
            roadAddress: data.roadAddress,
            jibunAddress: data.jibunAddress,
            buildingName: data.buildingName,
          })
        },
      }).open()
    }
    
    // 이미 스크립트가 로드되어 있는 경우
    if (window.daum?.Postcode) {
      new window.daum.Postcode({
        oncomplete: (data: DaumPostcodeData) => {
          const address = data.roadAddress || data.jibunAddress
          
          onComplete({
            zonecode: data.zonecode,
            address: address,
            roadAddress: data.roadAddress,
            jibunAddress: data.jibunAddress,
            buildingName: data.buildingName,
          })
        },
      }).open()
    } else {
      document.head.appendChild(script)
    }
  }, [])

  return { openPostcode }
}

export default useDaumPostcode

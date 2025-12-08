import { useCallback, useEffect, useState } from 'react'
import type { DaumPostcodeData } from '@/types/daum.d'

interface AddressResult {
  zonecode: string
  address: string
  roadAddress: string
  jibunAddress: string
  buildingName: string
}

const DAUM_POSTCODE_SCRIPT = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'

/**
 * 다음 우편번호 API 훅
 * SPEC: 주소 검색 (다음 API 연동) [우편번호만]
 */
export const useDaumPostcode = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  // 컴포넌트 마운트 시 스크립트 미리 로드
  useEffect(() => {
    // 이미 로드되어 있는지 확인
    if (window.daum?.Postcode) {
      setIsLoaded(true)
      return
    }

    // 이미 로드 중인 스크립트가 있는지 확인
    const existingScript = document.querySelector(`script[src="${DAUM_POSTCODE_SCRIPT}"]`)
    if (existingScript) {
      existingScript.addEventListener('load', () => setIsLoaded(true))
      return
    }

    const script = document.createElement('script')
    script.src = DAUM_POSTCODE_SCRIPT
    script.async = true
    script.onload = () => {
      setIsLoaded(true)
    }
    script.onerror = () => {
      console.error('다음 우편번호 스크립트 로드 실패')
    }
    document.head.appendChild(script)
  }, [])

  const openPostcode = useCallback((onComplete: (result: AddressResult) => void) => {
    // 스크립트가 로드되지 않았으면 로드 후 실행
    if (!window.daum?.Postcode) {
      // 스크립트 로드 대기 후 재시도
      const checkAndOpen = () => {
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
          // 100ms 후 재시도 (최대 3초)
          setTimeout(checkAndOpen, 100)
        }
      }
      
      // 스크립트가 없으면 로드
      if (!document.querySelector(`script[src="${DAUM_POSTCODE_SCRIPT}"]`)) {
        const script = document.createElement('script')
        script.src = DAUM_POSTCODE_SCRIPT
        script.async = true
        script.onload = checkAndOpen
        document.head.appendChild(script)
      } else {
        checkAndOpen()
      }
      return
    }

    // 스크립트가 이미 로드된 경우
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
  }, [])

  return { openPostcode, isLoaded }
}

export default useDaumPostcode

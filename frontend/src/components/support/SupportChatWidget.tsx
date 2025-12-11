import { useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import { supportFaqs, type SupportFaq } from './supportFaq'

type Message = {
  id: string
  sender: 'user' | 'bot'
  text: string
  createdAt: number
}

const fallbackAnswer =
  '죄송합니다, 아직 해당 질문에 대한 자동 답변이 준비되지 않았어요. 혹시 다른 키워드로 다시 질문하시거나 자주 묻는 질문 버튼을 눌러 확인해 보시겠어요? 추가 문의는 하단 고객센터 이메일 또는 1:1 문의로 남겨주시면 빠르게 도와드릴게요.'

const SupportChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isSending, setIsSending] = useState(false)

  const initialMessages = useMemo<Message[]>(
    () => [
      {
        id: 'welcome-1',
        sender: 'bot',
        text: '안녕하세요, 옷 쇼핑몰 고객센터입니다.',
        createdAt: Date.now(),
      },
      {
        id: 'welcome-2',
        sender: 'bot',
        text: '자주 묻는 질문 버튼을 선택하거나, 아래에 직접 질문을 입력해 주세요.',
        createdAt: Date.now() + 1,
      },
    ],
    [],
  )
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isOpen) return
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen])

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isOpen])

  const appendMessage = (sender: Message['sender'], text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${sender}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        sender,
        text,
        createdAt: Date.now(),
      },
    ])
  }

  const handleToggle = () => {
    setIsOpen((prev) => !prev)
  }

  const handleFaqSelect = (faq: SupportFaq) => {
    appendMessage('user', faq.question)
    appendMessage('bot', faq.answer)
    setInputValue('')
  }

  const getAnswerForInput = (text: string) => {
    const normalized = text.trim().toLowerCase()
    const matchedFaq = supportFaqs.find((faq) =>
      faq.keywords.some((keyword) => normalized.includes(keyword)),
    )
    return matchedFaq?.answer ?? fallbackAnswer
  }

  const callSupportApi = async (text: string) => {
    try {
      const res = await fetch('/api/ai/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purpose: 'support',
          messages: [
            { role: 'system', content: '너는 패션 쇼핑몰 고객센터 상담원이다. 짧고 친절하게 한국어로 답변해.' },
            { role: 'user', content: text },
          ],
        }),
      })
      if (!res.ok) {
        throw new Error('API 응답 오류')
      }
      const data = (await res.json()) as { success?: boolean; data?: { content?: string }; content?: string }
      // ResponseController.success() 형식 또는 직접 content 형식 모두 지원
      const content = data.data?.content ?? data.content
      return content?.trim()
    } catch (error) {
      console.error('SupportChatWidget API error:', error)
      return null
    }
  }

  const handleSend = async () => {
    const userText = inputValue.trim()
    if (!userText || isSending) return

    appendMessage('user', userText)
    setInputValue('')

    const matched = getAnswerForInput(userText)
    if (matched !== fallbackAnswer) {
      appendMessage('bot', matched)
      return
    }

    setIsSending(true)
    const loadingId = `bot-loading-${Date.now()}`
    setMessages((prev) => [
      ...prev,
      {
        id: loadingId,
        sender: 'bot',
        text: '답변을 불러오는 중입니다...',
        createdAt: Date.now(),
      },
    ])

    const apiReply = await callSupportApi(userText)
    setIsSending(false)

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === loadingId
          ? {
              ...msg,
              text: apiReply || fallbackAnswer,
            }
          : msg,
      ),
    )
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        right: 24,
        bottom: 24,
        zIndex: (theme) => theme.zIndex.modal + 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 1.5,
      }}
    >
      {isOpen && (
        <Paper
          elevation={6}
          sx={{
            width: 360,
            maxWidth: '92vw',
            height: '62vh',
            minHeight: 420,
            maxHeight: 560,
            borderRadius: 3,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: (theme) => theme.shadows[6],
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                고객센터 챗봇
              </Typography>
              <Typography variant="body2" color="text.secondary">
                옷 쇼핑몰 CS 전용 FAQ
              </Typography>
            </Box>
            <IconButton aria-label="챗봇 닫기" onClick={() => setIsOpen(false)} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box
            ref={scrollRef}
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              bgcolor: 'background.default',
            }}
          >
            <Stack spacing={1.5}>
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '80%',
                      bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.100',
                      color: message.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                      px: 1.5,
                      py: 1,
                      borderRadius: 2,
                      boxShadow: (theme) => (message.sender === 'bot' ? theme.shadows[1] : 'none'),
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {message.text}
                    </Typography>
                  </Box>
                </Box>
              ))}

              <Box>
                <Typography variant="caption" color="text.secondary">
                  자주 묻는 질문
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" mt={0.5}>
                  {supportFaqs.slice(0, 6).map((faq) => (
                    <Chip
                      key={faq.id}
                      label={faq.question}
                      size="small"
                      onClick={() => handleFaqSelect(faq)}
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Box>

          <Box
            sx={{
              p: 1.5,
              borderTop: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              display: 'flex',
              gap: 1,
            }}
          >
            <TextField
              size="small"
              placeholder="문의 내용을 입력하세요"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={handleKeyDown}
              fullWidth
              aria-label="문의 입력"
              disabled={isSending}
            />
            <Button
              variant="contained"
              onClick={handleSend}
              endIcon={<SendIcon fontSize="small" />}
              sx={{ flexShrink: 0 }}
              disabled={isSending}
            >
              전송
            </Button>
          </Box>
        </Paper>
      )}

      {/* 귀여운 파스텔 로봇 */}
      <Box
        onClick={handleToggle}
        aria-label="고객센터 챗봇 열기"
        sx={{
          cursor: 'pointer',
          position: 'relative',
          width: 70,
          height: 82,
          '&:hover .robot-body': {
            transform: 'scale(1.1)',
          },
        }}
      >
        {isOpen ? (
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              bgcolor: '#7EC8E3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(126, 200, 227, 0.4)',
              ml: 'auto',
              mt: 'auto',
            }}
          >
            <CloseIcon sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
        ) : (
          <Box
            className="robot-body"
            sx={{
              position: 'relative',
              transition: 'transform 0.2s ease',
              width: 70,
              height: 82,
            }}
          >
            {/* 왼쪽 팔 */}
            <Box
              sx={{
                position: 'absolute',
                top: 42,
                left: 5,
                width: 12,
                height: 20,
                zIndex: 1,
                bgcolor: '#7EC8E3',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(126, 200, 227, 0.3)',
              }}
            />

            {/* 오른쪽 팔 */}
            <Box
              sx={{
                position: 'absolute',
                top: 42,
                right: 5,
                width: 12,
                height: 20,
                zIndex: 1,
                bgcolor: '#7EC8E3',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(126, 200, 227, 0.3)',
              }}
            />

            {/* 몸통 */}
            <Box
              sx={{
                position: 'absolute',
                top: 40,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 36,
                height: 34,
                zIndex: 2,
                bgcolor: '#7EC8E3',
                borderRadius: '12px 12px 18px 18px',
                boxShadow: '0 4px 12px rgba(126, 200, 227, 0.35)',
              }}
            />

            {/* 머리 */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 50,
                height: 46,
                zIndex: 10,
                bgcolor: '#7EC8E3',
                borderRadius: '16px',
                boxShadow: '0 4px 15px rgba(126, 200, 227, 0.4)',
              }}
            >
              {/* 얼굴 화면 */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 7,
                  left: 5,
                  right: 5,
                  height: 32,
                  bgcolor: '#1a1a2e',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* 눈 */}
                <Box sx={{ display: 'flex', gap: '10px', mb: 0.5 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      bgcolor: '#fff',
                      borderRadius: '50%',
                    }}
                  />
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      bgcolor: '#fff',
                      borderRadius: '50%',
                    }}
                  />
                </Box>
                {/* 미소 */}
                <Box
                  sx={{
                    width: 12,
                    height: 6,
                    borderBottom: '2px solid #fff',
                    borderRadius: '0 0 6px 6px',
                  }}
                />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default SupportChatWidget

import { useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import {
  Box,
  Chip,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import HomeIcon from '@mui/icons-material/Home'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { supportFaqs, type SupportFaq } from './supportFaq'

type Message = {
  id: string
  sender: 'user' | 'bot'
  text: string
  createdAt: number
}

type TabType = 'home' | 'messages' | 'help'

const fallbackAnswer =
  '죄송합니다, 아직 해당 질문에 대한 자동 답변이 준비되지 않았어요. 혹시 다른 키워드로 다시 질문하시거나 자주 묻는 질문 버튼을 눌러 확인해 보시겠어요? 추가 문의는 하단 고객센터 이메일 또는 1:1 문의로 남겨주시면 빠르게 도와드릴게요.'

const SupportChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('home')

  const initialMessages = useMemo<Message[]>(
    () => [
      {
        id: 'welcome-1',
        sender: 'bot',
        text: '안녕하세요! 무엇을 도와드릴까요?',
        createdAt: Date.now(),
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
    setActiveTab('messages')
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

    setActiveTab('messages')
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

  // 홈 탭 콘텐츠
  const renderHomeTab = () => (
    <Box sx={{ p: 3 }}>
      {/* 메시지 입력 카드 */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          border: '1px solid #E5E7EB',
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': {
            borderColor: '#4F7DF3',
            boxShadow: '0 2px 8px rgba(79, 125, 243, 0.15)',
          },
        }}
        onClick={() => setActiveTab('messages')}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography color="text.secondary">메시지를 보내주세요</Typography>
          <SendIcon sx={{ color: '#4F7DF3' }} />
        </Box>
      </Paper>

      {/* 쇼핑몰 소개 카드 */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid #E5E7EB',
        }}
      >

        <Box sx={{ p: 2 }}>
          <Typography fontWeight={600} sx={{ mb: 0.5 }}>
            패션 쇼핑몰 고객센터
          </Typography>
          <Typography variant="body2" color="text.secondary">
            배송, 교환, 환불 등 궁금한 점이 있으시면 언제든 문의해주세요.
          </Typography>
        </Box>
      </Paper>

      {/* 자주 묻는 질문 */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5, color: '#374151' }}>
          자주 묻는 질문
        </Typography>
        <Stack spacing={1}>
          {supportFaqs.slice(0, 4).map((faq) => (
            <Paper
              key={faq.id}
              elevation={0}
              onClick={() => handleFaqSelect(faq)}
              sx={{
                p: 1.5,
                borderRadius: 2,
                border: '1px solid #E5E7EB',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: '#4F7DF3',
                  bgcolor: '#F8FAFF',
                },
              }}
            >
              <Typography variant="body2">{faq.question}</Typography>
            </Paper>
          ))}
        </Stack>
      </Box>
    </Box>
  )

  // 메시지 탭 콘텐츠
  const renderMessagesTab = () => (
    <Box
      ref={scrollRef}
      sx={{
        flex: 1,
        overflowY: 'auto',
        p: 2,
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
                bgcolor: message.sender === 'user' ? '#4F7DF3' : '#F3F4F6',
                color: message.sender === 'user' ? '#fff' : '#1F2937',
                px: 2,
                py: 1.5,
                borderRadius: message.sender === 'user'
                  ? '18px 18px 4px 18px'
                  : '18px 18px 18px 4px',
              }}
            >
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {message.text}
              </Typography>
            </Box>
          </Box>
        ))}

        {/* FAQ 칩스 */}
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {supportFaqs.slice(0, 4).map((faq) => (
              <Chip
                key={faq.id}
                label={faq.question}
                size="small"
                onClick={() => handleFaqSelect(faq)}
                sx={{
                  mb: 1,
                  bgcolor: '#fff',
                  border: '1px solid #E5E7EB',
                  '&:hover': {
                    bgcolor: '#F8FAFF',
                    borderColor: '#4F7DF3',
                  },
                }}
              />
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  )

  // 도움말 탭 콘텐츠
  const renderHelpTab = () => (
    <Box sx={{ p: 3 }}>
      <Typography fontWeight={600} sx={{ mb: 2 }}>
        도움말
      </Typography>
      <Stack spacing={2}>
        {supportFaqs.map((faq) => (
          <Paper
            key={faq.id}
            elevation={0}
            onClick={() => handleFaqSelect(faq)}
            sx={{
              p: 2,
              borderRadius: 2,
              border: '1px solid #E5E7EB',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: '#4F7DF3',
                bgcolor: '#F8FAFF',
              },
            }}
          >
            <Typography variant="body2" fontWeight={500}>
              {faq.question}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </Box>
  )

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
          elevation={8}
          sx={{
            width: 380,
            maxWidth: '92vw',
            height: '70vh',
            minHeight: 500,
            maxHeight: 650,
            borderRadius: 4,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* 헤더 - 그라데이션 */}
          <Box>
            <IconButton
              aria-label="챗봇 닫기"
              onClick={() => setIsOpen(false)}
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>

            <Typography variant="h5" fontWeight={600} sx={{ mb: 0.5 }}>
              안녕하세요 
            </Typography>
            <Typography variant="h6" fontWeight={400}>
              도움이 필요하신가요?
            </Typography>
          </Box>

          {/* 콘텐츠 영역 */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              bgcolor: '#FAFBFC',
            }}
          >
            {activeTab === 'home' && renderHomeTab()}
            {activeTab === 'messages' && renderMessagesTab()}
            {activeTab === 'help' && renderHelpTab()}
          </Box>

          {/* 입력 필드 (메시지 탭에서만) */}
          {activeTab === 'messages' && (
            <Box
              sx={{
                p: 2,
                borderTop: '1px solid #E5E7EB',
                bgcolor: 'white',
              }}
            >
              <TextField
                size="small"
                placeholder="메시지를 입력하세요..."
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={handleKeyDown}
                fullWidth
                disabled={isSending}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 6,
                    bgcolor: '#F3F4F6',
                    '& fieldset': { border: 'none' },
                    '&:hover fieldset': { border: 'none' },
                    '&.Mui-focused fieldset': { border: '2px solid #4F7DF3' },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleSend}
                        disabled={isSending || !inputValue.trim()}
                        sx={{ color: '#4F7DF3' }}
                      >
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          )}

          {/* 하단 탭 바 */}
          <Box
            sx={{
              display: 'flex',
              borderTop: '1px solid #E5E7EB',
              bgcolor: 'white',
            }}
          >
            <Box
              onClick={() => setActiveTab('home')}
              sx={{
                flex: 1,
                py: 1.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                color: activeTab === 'home' ? '#4F7DF3' : '#9CA3AF',
                transition: 'color 0.2s',
                '&:hover': { color: '#4F7DF3' },
              }}
            >
              <HomeIcon fontSize="small" />
              <Typography variant="caption" sx={{ mt: 0.5 }}>
                홈
              </Typography>
            </Box>
            <Box
              onClick={() => setActiveTab('messages')}
              sx={{
                flex: 1,
                py: 1.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                color: activeTab === 'messages' ? '#4F7DF3' : '#9CA3AF',
                transition: 'color 0.2s',
                '&:hover': { color: '#4F7DF3' },
              }}
            >
              <ChatBubbleOutlineIcon fontSize="small" />
              <Typography variant="caption" sx={{ mt: 0.5 }}>
                메시지
              </Typography>
            </Box>
            <Box
              onClick={() => setActiveTab('help')}
              sx={{
                flex: 1,
                py: 1.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                color: activeTab === 'help' ? '#4F7DF3' : '#9CA3AF',
                transition: 'color 0.2s',
                '&:hover': { color: '#4F7DF3' },
              }}
            >
              <HelpOutlineIcon fontSize="small" />
              <Typography variant="caption" sx={{ mt: 0.5 }}>
                도움말
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}

      {/* 플로팅 버튼 */}
      <Box
        onClick={handleToggle}
        aria-label="고객센터 챗봇 열기"
        sx={{
          cursor: 'pointer',
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4F7DF3 0%, #6366F1 50%, #8B5CF6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(79, 125, 243, 0.4)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: '0 6px 25px rgba(79, 125, 243, 0.5)',
          },
        }}
      >
        {isOpen ? (
          <CloseIcon sx={{ color: 'white', fontSize: 28 }} />
        ) : (
          <ChatBubbleOutlineIcon sx={{ color: 'white', fontSize: 28 }} />
        )}
      </Box>
    </Box>
  )
}

export default SupportChatWidget

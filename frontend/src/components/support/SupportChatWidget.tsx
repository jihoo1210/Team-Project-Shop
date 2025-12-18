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
  Avatar,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import HomeIcon from '@mui/icons-material/Home'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import StraightenIcon from '@mui/icons-material/Straighten'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import { supportFaqs, type SupportFaq } from './supportFaq'
import { glassmorphism } from '@/theme/tokens'

type Message = {
  id: string
  sender: 'user' | 'bot'
  text: string
  createdAt: number
}

type TabType = 'home' | 'messages' | 'help'

const fallbackAnswer =
  '죄송합니다, 아직 해당 질문에 대한 자동 답변이 준비되지 않았어요. 혹시 다른 키워드로 다시 질문하시거나 자주 묻는 질문 버튼을 눌러 확인해 보시겠어요? 추가 문의는 하단 고객센터 이메일 또는 1:1 문의로 남겨주시면 빠르게 도와드릴게요.'

// FAQ 아이콘 매핑
const faqIcons: Record<number, React.ReactNode> = {
  0: <LocalShippingOutlinedIcon sx={{ fontSize: 18 }} />,
  1: <SwapHorizIcon sx={{ fontSize: 18 }} />,
  2: <StraightenIcon sx={{ fontSize: 18 }} />,
  3: <CardGiftcardIcon sx={{ fontSize: 18 }} />,
}

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
        text: '안녕하세요! 무엇을 도와드릴까요? 😊',
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
    <Box sx={{ p: 2.5 }}>
      {/* 메시지 입력 카드 */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2.5,
          borderRadius: 3,
          bgcolor: 'white',
          border: '1px solid #E5E8EB',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: '#374151',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-1px)',
          },
        }}
        onClick={() => setActiveTab('messages')}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ color: '#9CA3AF', fontSize: '0.95rem' }}>
            무엇이든 물어보세요...
          </Typography>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: '#1F2937',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SendIcon sx={{ color: 'white', fontSize: 16 }} />
          </Box>
        </Box>
      </Paper>

      {/* 고객센터 안내 카드 */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: 'linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)',
          border: '1px solid #E5E8EB',
          mb: 2.5,
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 44,
              height: 44,
              bgcolor: '#1F2937',
            }}
          >
            <SupportAgentIcon sx={{ fontSize: 24 }} />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#1F2937', mb: 0.3 }}>
              MyShop 고객센터
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#6B7280' }}>
              평일 09:00 - 18:00 (주말/공휴일 휴무)
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* 자주 묻는 질문 */}
      <Box>
        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#6B7280', mb: 1.5, letterSpacing: '0.02em' }}>
          자주 묻는 질문
        </Typography>
        <Stack spacing={1}>
          {supportFaqs.slice(0, 4).map((faq, index) => (
            <Paper
              key={faq.id}
              elevation={0}
              onClick={() => handleFaqSelect(faq)}
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'white',
                border: '1px solid #E5E8EB',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                '&:hover': {
                  borderColor: '#374151',
                  bgcolor: '#F9FAFB',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  bgcolor: '#F3F4F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#374151',
                  flexShrink: 0,
                }}
              >
                {faqIcons[index] || <HelpOutlineIcon sx={{ fontSize: 18 }} />}
              </Box>
              <Typography sx={{ fontSize: '0.875rem', color: '#374151', fontWeight: 500 }}>
                {faq.question}
              </Typography>
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
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack spacing={2} sx={{ flex: 1 }}>
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-end',
              gap: 1,
            }}
          >
            {message.sender === 'bot' && (
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: '#1F2937',
                  flexShrink: 0,
                }}
              >
                <SupportAgentIcon sx={{ fontSize: 16 }} />
              </Avatar>
            )}
            <Box
              sx={{
                maxWidth: '75%',
                bgcolor: message.sender === 'user' ? '#1F2937' : 'white',
                color: message.sender === 'user' ? '#fff' : '#1F2937',
                px: 2,
                py: 1.5,
                borderRadius: message.sender === 'user'
                  ? '16px 16px 4px 16px'
                  : '16px 16px 16px 4px',
                boxShadow: message.sender === 'user'
                  ? 'none'
                  : '0 1px 2px rgba(0,0,0,0.05)',
                border: message.sender === 'user' ? 'none' : '1px solid #E5E8EB',
              }}
            >
              <Typography sx={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                {message.text}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>

      {/* FAQ 빠른 선택 */}
      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #E5E8EB' }}>
        <Typography sx={{ fontSize: '0.75rem', color: '#9CA3AF', mb: 1 }}>
          빠른 질문
        </Typography>
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
          {supportFaqs.slice(0, 3).map((faq) => (
            <Chip
              key={faq.id}
              label={faq.question.replace('?', '')}
              size="small"
              onClick={() => handleFaqSelect(faq)}
              sx={{
                mb: 0.5,
                height: 28,
                fontSize: '0.75rem',
                bgcolor: 'white',
                border: '1px solid #E5E8EB',
                '&:hover': {
                  bgcolor: '#F3F4F6',
                  borderColor: '#374151',
                },
              }}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  )

  // 도움말 탭 콘텐츠
  const renderHelpTab = () => (
    <Box sx={{ p: 2.5 }}>
      <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#1F2937', mb: 2 }}>
        자주 묻는 질문 전체보기
      </Typography>
      <Stack spacing={1.5}>
        {supportFaqs.map((faq, index) => (
          <Paper
            key={faq.id}
            elevation={0}
            onClick={() => handleFaqSelect(faq)}
            sx={{
              p: 2,
              borderRadius: 2.5,
              bgcolor: 'white',
              border: '1px solid #E5E8EB',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#374151',
                bgcolor: '#F9FAFB',
                transform: 'translateX(4px)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '10px',
                  bgcolor: '#F3F4F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#374151',
                  flexShrink: 0,
                }}
              >
                {faqIcons[index] || <HelpOutlineIcon sx={{ fontSize: 18 }} />}
              </Box>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 500, color: '#374151' }}>
                {faq.question}
              </Typography>
            </Box>
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
          elevation={16}
          sx={{
            width: 380,
            maxWidth: '92vw',
            height: '70vh',
            minHeight: 500,
            maxHeight: 650,
            borderRadius: 2,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* 헤더 - 다크 테마 */}
          <Box
            sx={{
              position: 'relative',
              background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
              p: 2.5,
              pt: 3,
            }}
          >
            <IconButton
              aria-label="챗봇 닫기"
              onClick={() => setIsOpen(false)}
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                color: 'rgba(255,255,255,0.8)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.15)',
                  color: 'white',
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <SupportAgentIcon sx={{ fontSize: 22, color: 'white' }} />
              </Avatar>
              <Box>
                <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.2 }}>
                  안녕하세요!
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
                  무엇을 도와드릴까요?
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* 콘텐츠 영역 */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              bgcolor: '#F9FAFB',
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
                borderTop: '1px solid #E5E8EB',
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
                    borderRadius: 3,
                    bgcolor: '#F3F4F6',
                    '& fieldset': { border: 'none' },
                    '&:hover fieldset': { border: 'none' },
                    '&.Mui-focused fieldset': { border: '2px solid #374151' },
                    '&.Mui-focused': { bgcolor: 'white' },
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '0.9rem',
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleSend}
                        disabled={isSending || !inputValue.trim()}
                        sx={{
                          bgcolor: inputValue.trim() ? '#1F2937' : 'transparent',
                          color: inputValue.trim() ? 'white' : '#9CA3AF',
                          width: 32,
                          height: 32,
                          '&:hover': {
                            bgcolor: inputValue.trim() ? '#374151' : 'transparent',
                          },
                          '&.Mui-disabled': {
                            color: '#D1D5DB',
                          },
                        }}
                      >
                        <SendIcon sx={{ fontSize: 18 }} />
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
              borderTop: '1px solid #E5E8EB',
              bgcolor: 'white',
            }}
          >
            {[
              { key: 'home', icon: HomeIcon, label: '홈' },
              { key: 'messages', icon: ChatBubbleOutlineIcon, label: '메시지' },
              { key: 'help', icon: HelpOutlineIcon, label: '도움말' },
            ].map(({ key, icon: Icon, label }) => (
              <Box
                key={key}
                onClick={() => setActiveTab(key as TabType)}
                sx={{
                  flex: 1,
                  py: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: activeTab === key ? '#1F2937' : '#9CA3AF',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  '&:hover': { color: '#1F2937' },
                  '&::before': activeTab === key ? {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 24,
                    height: 2,
                    bgcolor: '#1F2937',
                    borderRadius: 1,
                  } : {},
                }}
              >
                <Icon sx={{ fontSize: 20 }} />
                <Typography sx={{ fontSize: '0.7rem', fontWeight: activeTab === key ? 600 : 400, mt: 0.3 }}>
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      )}

      {/* 플로팅 버튼 - 글래스모피즘 */}
      <Box
        onClick={handleToggle}
        aria-label="고객센터 챗봇 열기"
        sx={{
          cursor: 'pointer',
          width: 56,
          height: 56,
          borderRadius: '50%',
          bgcolor: glassmorphism.light.background,
          backdropFilter: glassmorphism.light.backdropFilter,
          border: glassmorphism.light.border,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: glassmorphism.light.boxShadow,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.08)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
            bgcolor: 'rgba(255, 255, 255, 0.9)',
          },
        }}
      >
        {isOpen ? (
          <CloseIcon sx={{ color: '#1F2937', fontSize: 24 }} />
        ) : (
          <ChatBubbleOutlineIcon sx={{ color: '#1F2937', fontSize: 24 }} />
        )}
      </Box>
    </Box>
  )
}

export default SupportChatWidget

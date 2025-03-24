import { format, formatDistance, formatRelative } from 'date-fns'
import zhCN from 'date-fns/locale/zh-CN'

export function formatNumber(value) {
  if (value === null || value === undefined) return '-'
  return new Intl.NumberFormat('zh-CN').format(value)
}

export function formatCurrency(value) {
  if (value === null || value === undefined) return '-'
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

export function formatTime(date) {
  if (!date) return '-'
  return formatDistance(new Date(date), new Date(), { addSuffix: true, locale: zhCN })
}

export function formatFullDate(date) {
  if (!date) return '-'
  return format(new Date(date), 'yyyy-MM-dd HH:mm:ss', { locale: zhCN })
}

export function shortAddress(address) {
  if (!address) return '-'
  return `${address.substring(0, 8)}...${address.substring(address.length - 6)}`
}

export function shortHash(hash) {
  if (!hash) return '-'
  return `${hash.substring(0, 8)}...${hash.substring(hash.length - 6)}`
}

export function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      // 可以在这里添加复制成功的通知逻辑
      console.log('已复制到剪贴板')
    })
    .catch(err => {
      console.error('复制失败:', err)
    })
} 
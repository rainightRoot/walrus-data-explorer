import { format, formatDistance, formatRelative } from 'date-fns'
import enUS from 'date-fns/locale/en-US'

export function formatNumber(value) {
  if (value === null || value === undefined) return '-'
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatCurrency(value) {
  if (value === null || value === undefined) return '-'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

export function formatTime(date) {
  if (!date) return '-'
  return formatDistance(new Date(date), new Date(), { addSuffix: true, locale: enUS })
}

export function formatFullDate(date) {
  if (!date) return '-'
  return format(new Date(date), 'yyyy-MM-dd HH:mm:ss', { locale: enUS })
}

export function shortAddress(address) {
  if (!address) return '-'
  return `${address.substring(0, 8)}...${address.substring(address.length - 6)}`
}

export function shortHash(hash) {
  if (!hash) return '-'
  return `${hash.substring(0, 8)}...${hash.substring(hash.length - 6)}`
}
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  const value = bytes / Math.pow(k, i);
  return parseFloat(value.toFixed(decimals)) + ' ' + sizes[i];
}

export function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      // Notification logic could be added here
      console.log('Copied to clipboard')
    })
    .catch(err => {
      console.error('Copy failed:', err)
    })
} 
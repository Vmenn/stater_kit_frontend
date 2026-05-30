import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(localizedFormat)

export function formatDate(date: string | Date, format = 'DD MMM YYYY'): string {
  return dayjs(date).format(format)
}

export function formatDateTime(date: string | Date): string {
  return dayjs(date).format('DD MMM YYYY, HH:mm')
}

export function fromNow(date: string | Date): string {
  return dayjs(date).fromNow()
}

export function isExpired(date: string | Date): boolean {
  return dayjs(date).isBefore(dayjs())
}

export function toISO(date: string | Date): string {
  return dayjs(date).toISOString()
}

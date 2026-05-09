import type { AvatarProps } from '@nuxt/ui'

export type UserStatus = 'subscribed' | 'unsubscribed' | 'bounced'
export type SaleStatus = 'paid' | 'failed' | 'refunded'

export interface User {
  id: number
  name: string
  email: string
  avatar?: AvatarProps
  status: UserStatus
  location: string
}

export interface Mail {
  id: number
  unread?: boolean
  from: User
  subject: string
  body: string
  date: string
}

export interface Member {
  name: string
  username: string
  role: 'member' | 'owner'
  avatar: AvatarProps
}

export interface Stat {
  title: string
  icon: string
  value: number | string
  variation: number
  formatter?: (value: number) => string
}

export interface Sale {
  id: string
  date: string
  status: SaleStatus
  email: string
  amount: number
}

export interface Notification {
  id: number
  unread?: boolean
  sender: User
  body: string
  date: string
}

export interface AuthUser {
  id: number
  name: string
  email: string
  emailVerified: boolean
}

export interface AuthResponse {
  user: AuthUser
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  name: string
}

export interface OtpRequestPayload {
  email: string
}

export interface OtpVerifyPayload {
  email: string
  code: string
}

export interface OtpRequestResponse {
  challengeId: string
  expiresIn: number
  devCode?: string
}

export type AuthMethod = 'password' | 'otp' | 'passkey'
export type AuthProvider = 'google' | 'github'

export interface ApiErrorData {
  message?: string
  statusCode?: number
  [key: string]: unknown
}

export type AuthStatus = 'unknown' | 'authenticated' | 'anonymous'
export type QueryStatus = 'idle' | 'pending' | 'success' | 'error'
export type MutationStatus = QueryStatus

export type Period = 'daily' | 'weekly' | 'monthly'

export interface Range {
  start: Date
  end: Date
}

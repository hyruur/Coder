export interface User {
  id: string
  openid?: string
  phone?: string
  email?: string
  name?: string
  avatar?: string
  role: 'CLIENT' | 'DEVELOPER' | 'ADMIN'
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED'
  verified: boolean
  creditScore: number
  balance: number
  createdAt: Date
  updatedAt: Date
  clientProfile?: ClientProfile
  developerProfile?: DeveloperProfile
}

export interface ClientProfile {
  id: string
  userId: string
  company?: string
  industry?: string
  description?: string
  businessLicense?: string
}

export interface DeveloperProfile {
  id: string
  userId: string
  bio?: string
  experience?: number
  skills: string
  portfolio?: string
  github?: string
  hourlyRate?: number
  availability: boolean
  level: 'JUNIOR' | 'MIDDLE' | 'SENIOR' | 'EXPERT'
}

export interface Project {
  id: string
  title: string
  description: string
  budget: number
  duration: number
  techStack: string
  attachments?: string
  status: 'DRAFT' | 'PUBLISHED' | 'BIDDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'SUSPENDED'
  visibility: 'PUBLIC' | 'PRIVATE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  clientId: string
  assignedTo?: string
  deadline?: Date
  viewCount: number
  bidCount: number
  createdAt: Date
  updatedAt: Date
  client: User
  developer?: User
  tags: ProjectTag[]
}

export interface ProjectTag {
  id: string
  projectId: string
  tag: string
}

export interface Bid {
  id: string
  projectId: string
  developerId: string
  amount: number
  duration: number
  proposal: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN'
  createdAt: Date
  updatedAt: Date
  project: Project
  developer: User
}

export interface Order {
  id: string
  orderNo: string
  projectId: string
  clientId: string
  developerId: string
  bidId?: string
  amount: number
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'REVIEWING' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED'
  paymentStatus: 'UNPAID' | 'PAID' | 'REFUNDED' | 'PARTIAL'
  progress: number
  deadline?: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
  project: Project
  client: User
  developer: User
  reviews: Review[]
  payments: Payment[]
  deliverables: Deliverable[]
}

export interface Deliverable {
  id: string
  orderId: string
  title: string
  description?: string
  fileUrl?: string
  status: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'
  submittedAt?: Date
  reviewedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  id: string
  orderId: string
  fromUserId: string
  toUserId: string
  rating: number
  comment?: string
  tags?: string
  createdAt: Date
  order: Order
  fromUser: User
  toUser: User
}

export interface Payment {
  id: string
  orderId: string
  userId: string
  amount: number
  paymentMethod: 'WECHAT' | 'ALIPAY' | 'BANK' | 'BALANCE'
  transactionId?: string
  status: 'UNPAID' | 'PAID' | 'REFUNDED' | 'PARTIAL'
  createdAt: Date
  updatedAt: Date
  order: Order
  user: User
}

export interface Withdrawal {
  id: string
  userId: string
  amount: number
  method: 'WECHAT' | 'BANK'
  accountInfo: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSING' | 'COMPLETED'
  processedAt?: Date
  remark?: string
  createdAt: Date
  updatedAt: Date
  user: User
}

export interface SystemConfig {
  id: string
  key: string
  value: string
  description?: string
  updatedAt: Date
}

export * from './conversion'

import { Metadata } from 'next'
import { ProfileContent } from './profile-content'

export const metadata: Metadata = {
  title: 'Личный кабинет | AeroLuxe',
  description: 'Управление личными данными и просмотр бронирований в AeroLuxe',
}

export default function ProfilePage() {
  return <ProfileContent />
}


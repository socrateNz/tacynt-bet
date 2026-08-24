import type { Metadata } from 'next';

import { ProfilePageContent } from './profile-content';

export const metadata: Metadata = {
  title: 'Profil | Tacynt Bet',
};

export default function ProfilePage() {
  return <ProfilePageContent />;
}

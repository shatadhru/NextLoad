import { Metadata } from 'next'
import { LegalPageContent } from '@/components/legal/LegalPageContent'
import { SiteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Privacy Policy | ${SiteConfig.site.name}`,
  description: `Privacy Policy and data protection guidelines for ${SiteConfig.site.name}.`,
}

const defaultPrivacyContent = `## 1. Information We Collect
We collect personal information that you provide when registering an account, subscribing to newsletters, or making purchases. This may include your name, email address, payment details, and device identifiers.

## 2. How We Use Information
We use your information to operate and maintain your account, process transactions, deliver customer support, send transactional communications, and ensure application security.

## 3. Data Protection & Security
We implement robust encryption, secure session tokens, and strict access controls to safeguard your data. We never sell your personal information to third parties.

## 4. Cookies & Tracking
We utilize essential and functional cookies to remember your preferences and ensure security. You can manage or disable optional cookies via our Cookie Preferences modal at any time.

## 5. Contact Us
If you have any questions or data deletion requests regarding this Privacy Policy, please contact our privacy compliance team via our support channels.`

export default function PrivacyPage() {
  return (
    <LegalPageContent
      type="privacy"
      defaultTitle="Privacy Policy"
      defaultLastUpdated="September 2026"
      defaultContent={defaultPrivacyContent}
    />
  )
}

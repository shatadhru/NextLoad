import { Metadata } from 'next'
import { LegalPageContent } from '@/components/basic/legal/LegalPageContent'
import { SiteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Terms of Service | ${SiteConfig.site.name}`,
  description: `Terms of Service and user agreements for ${SiteConfig.site.name}.`,
}

const defaultTermsContent = `## 1. Acceptance of Terms
By accessing or using this platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree, you may not use our services.

## 2. User Accounts & Responsibilities
You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use.

## 3. Acceptable Use Policy
You agree not to engage in any activity that interferes with, disrupts, or compromises the security or integrity of our application, servers, or connected networks.

## 4. Intellectual Property
All content, features, trademarks, and code on this platform are the exclusive property of the company and protected by intellectual property laws.

## 5. Limitation of Liability
To the maximum extent permitted by applicable law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your access to or use of the service.`

export default function TermsPage() {
  return (
    <LegalPageContent
      type="terms"
      defaultTitle="Terms of Service"
      defaultLastUpdated="September 2026"
      defaultContent={defaultTermsContent}
    />
  )
}

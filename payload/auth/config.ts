import type { BetterAuthOptions } from 'better-auth'
import {
  sendResetPasswordEmail,
  sendPasswordChangedEmail,
} from '@/utils/sendEmail'

export const betterAuthOptions: Partial<BetterAuthOptions> = {
  user: {
    additionalFields: {
      // input: false keeps `role` server-only — clients cannot set it at sign-up.
      role: { type: 'string', defaultValue: 'user', input: false },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }) => {
      await sendResetPasswordEmail({
        to: user.email,
        name: user.name,
        resetUrl: url,
        token,
      })
    },
    // Callback after successful reset
    onPasswordReset: async ({ user }) => {
      console.log(`Password for ${user.email} has been reset.`)
      await sendPasswordChangedEmail({
        to: user.email,
        name: user.name,
      })
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },

  	account: {
		accountLinking: {
			enabled: true, // default
			trustedProviders: ["google"], // optional: auto-link even if email not verified
			disableImplicitLinking: true, // set to true to require explicit linking
			allowDifferentEmails: false, // allow linking accounts with different emails
			updateUserInfoOnLink: false, // update user profile when linking
			allowUnlinkingAll: false, // prevent unlinking the last account
		}
	},
}


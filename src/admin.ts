export const ADMIN_EMAIL = 'careershelf.help@gmail.com'

export function isAdminEmail(email: string | null | undefined): boolean {
  return email?.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()
}

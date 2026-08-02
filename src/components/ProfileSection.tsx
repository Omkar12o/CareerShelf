import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Camera, Loader2, Trash2 } from 'lucide-react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../useAuth'
import { Button } from './Button'

const AVATAR_BUCKET = 'avatars'
const MAX_AVATAR_MB = 5

export function ProfileSection() {
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [notice, setNotice] = useState<{
    tone: 'success' | 'error'
    text: string
  } | null>(null)

  if (!user) return null

  const avatarUrl = String(user.user_metadata?.avatar_url ?? '')
  const fullName = String(user.user_metadata?.full_name ?? '').trim()
  const displayName = fullName || user.email || 'My Account'
  const initials = (
    fullName
      ? fullName
          .split(' ')
          .map((part) => part[0])
          .join('')
      : (user.email ?? 'My Account').slice(0, 2)
  )
    .toUpperCase()
    .slice(0, 2)
  const memberSince = new Date(user.created_at).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const uploadAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setNotice({
        tone: 'error',
        text: 'Please choose an image file (JPG, PNG, etc.).',
      })
      return
    }
    if (file.size > MAX_AVATAR_MB * 1024 * 1024) {
      setNotice({
        tone: 'error',
        text: `Photo must be ${MAX_AVATAR_MB}MB or smaller.`,
      })
      return
    }

    setUploading(true)
    setNotice(null)

    const ext = (file.name.split('.').pop() ?? 'jpg')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
    const filePath = `${user.id}/avatar-${Date.now()}.${ext || 'jpg'}`

    const { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      setUploading(false)
      setNotice({
        tone: 'error',
        text: /bucket|row-level|not found/i.test(uploadError.message)
          ? 'Avatar uploads are not set up yet. Run the "avatars" storage SQL in Supabase, then try again.'
          : uploadError.message,
      })
      return
    }

    const { data: urlData } = supabase.storage
      .from(AVATAR_BUCKET)
      .getPublicUrl(filePath)

    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: urlData.publicUrl },
    })

    setUploading(false)
    if (updateError) {
      setNotice({ tone: 'error', text: updateError.message })
      return
    }

    setNotice({ tone: 'success', text: 'Profile photo updated.' })
  }

  const removeAvatar = async () => {
    if (!avatarUrl) return
    setUploading(true)
    setNotice(null)

    try {
      const pathFromUrl = new URL(avatarUrl).pathname
        .split('/object/public/avatars/')[1]
      if (pathFromUrl) {
        await supabase.storage
          .from(AVATAR_BUCKET)
          .remove([decodeURIComponent(pathFromUrl)])
      }
    } catch {
      // Ignore storage cleanup failures — the metadata removal below still runs.
    }

    const { error } = await supabase.auth.updateUser({
      data: { avatar_url: '' },
    })

    setUploading(false)
    if (error) {
      setNotice({ tone: 'error', text: error.message })
      return
    }
    setNotice({ tone: 'success', text: 'Profile photo removed.' })
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${displayName}'s profile photo`}
                className="size-16 rounded-full border border-gray-200 object-cover"
              />
            ) : (
              <span className="grid size-16 place-items-center rounded-full bg-brand-600 text-lg font-semibold text-white">
                {initials}
              </span>
            )}
            {uploading ? (
              <span className="absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-full border-2 border-white bg-brand-600 text-white">
                <Loader2 className="size-4 animate-spin" />
              </span>
            ) : null}
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-gray-900">
              {displayName}
            </p>
            <p className="truncate text-sm text-gray-500">{user.email}</p>
            <p className="mt-0.5 text-xs text-gray-400">
              Member since {memberSince}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => void uploadAvatar(e)}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Camera className="size-4" />
            {uploading ? 'Uploading…' : avatarUrl ? 'Change photo' : 'Add photo'}
          </Button>
          {avatarUrl ? (
            <Button
              variant="outline"
              onClick={() => void removeAvatar()}
              disabled={uploading}
            >
              <Trash2 className="size-4" />
              Remove
            </Button>
          ) : null}
        </div>
      </div>

      {notice ? (
        <p
          className={`mt-4 rounded-xl px-4 py-3 text-sm ${
            notice.tone === 'success'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-600'
          }`}
        >
          {notice.text}
        </p>
      ) : null}
    </section>
  )
}

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../supabaseClient'

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Phone required'),
  projectType: z.string().min(1, 'Select project type'),
  techPreference: z.string().optional(),
  budget: z.string().optional(),
  deadline: z.string().optional(),
  description: z.string().min(10, 'Describe your requirement'),
})

type FormValues = z.infer<typeof schema>

export function RequirementForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (values: FormValues) => {
    try {
      await supabase.from('service_requests').insert({
        name: values.name,
        email: values.email,
        phone: values.phone,
        project_type: values.projectType,
        tech_preference: values.techPreference,
        budget: values.budget,
        deadline: values.deadline,
        description: values.description,
        status: 'new',
      })
    } catch (e) {
      // ignore if table missing
    }
    onSubmitted?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <div>
        <input {...register('name')} placeholder="Name" className="w-full bg-[#FAF8F5] border border-[#D8D1C5] rounded px-3 py-2 text-xs text-[#141414]" />
        {errors.name && <p className="text-[10px] text-red-600">{errors.name.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <input {...register('email')} placeholder="Email" className="w-full bg-[#FAF8F5] border border-[#D8D1C5] rounded px-3 py-2 text-xs text-[#141414]" />
          {errors.email && <p className="text-[10px] text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <input {...register('phone')} placeholder="Phone" className="w-full bg-[#FAF8F5] border border-[#D8D1C5] rounded px-3 py-2 text-xs text-[#141414]" />
          {errors.phone && <p className="text-[10px] text-red-600">{errors.phone.message}</p>}
        </div>
      </div>
      <div>
        <select {...register('projectType')} className="w-full bg-[#FAF8F5] border border-[#D8D1C5] rounded px-3 py-2 text-xs text-[#5C564E]">
          <option value="">Project type</option>
          <option value="normal">Normal Project</option>
          <option value="fullstack">Frontend + Backend</option>
          <option value="custom">Big / Custom</option>
          <option value="uiux">UI/UX Design</option>
          <option value="flutter">Flutter App</option>
        </select>
        {errors.projectType && <p className="text-[10px] text-red-600">{errors.projectType.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input {...register('techPreference')} placeholder="Tech preference" className="w-full bg-[#FAF8F5] border border-[#D8D1C5] rounded px-3 py-2 text-xs text-[#141414]" />
        <input {...register('budget')} placeholder="Budget" className="w-full bg-[#FAF8F5] border border-[#D8D1C5] rounded px-3 py-2 text-xs text-[#141414]" />
      </div>
      <input {...register('deadline')} placeholder="Deadline" className="w-full bg-[#FAF8F5] border border-[#D8D1C5] rounded px-3 py-2 text-xs text-[#141414]" />
      <div>
        <textarea {...register('description')} placeholder="Description" className="w-full bg-[#FAF8F5] border border-[#D8D1C5] rounded px-3 py-2 text-xs text-[#141414] resize-y" rows={2} />
        {errors.description && <p className="text-[10px] text-red-600">{errors.description.message}</p>}
      </div>
      <input type="file" className="block w-full text-xs text-[#6B665F]" />
      <button type="submit" disabled={isSubmitting} className="w-full bg-[#141414] hover:bg-[#2C2B29] text-white py-2 rounded text-xs font-medium tracking-wide transition disabled:opacity-50">
        {isSubmitting ? 'Submitting...' : 'Submit enquiry'}
      </button>
    </form>
  )
}

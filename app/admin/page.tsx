import { createServiceRoleClient } from '@/lib/supabase-server'
import { Users, FileText, TrendingUp, UserCheck } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ComponentType<{ className?: string }>
  color: string
  href?: string
}

function StatCard({ title, value, icon: Icon, color, href }: StatCardProps) {
  const content = (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }
  return content
}

export default async function AdminOverviewPage() {
  const service = createServiceRoleClient()

  const [
    { count: totalUsers },
    { count: totalReviews },
    { count: soloUsers },
    { count: adminUsers },
    { data: recentSignups },
    { data: recentReviews },
  ] = await Promise.all([
    service.from('profiles').select('*', { count: 'exact', head: true }),
    service.from('reviews').select('*', { count: 'exact', head: true }),
    service.from('profiles').select('*', { count: 'exact', head: true }).eq('plan', 'solo'),
    service.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'admin'),
    service.from('profiles').select('id, email, plan, role, created_at').order('created_at', { ascending: false }).limit(5),
    service.from('reviews').select('id, file_name, overall_risk_score, status, created_at, user_id').order('created_at', { ascending: false }).limit(5),
  ])

  const stats = [
    { title: 'Total Users', value: totalUsers ?? 0, icon: Users, color: 'bg-blue-500', href: '/admin/users' },
    { title: 'Total Reviews', value: totalReviews ?? 0, icon: FileText, color: 'bg-green-500', href: '/admin/reviews' },
    { title: 'Solo Plan', value: soloUsers ?? 0, icon: TrendingUp, color: 'bg-purple-500' },
    { title: 'Admins', value: adminUsers ?? 0, icon: UserCheck, color: 'bg-orange-500' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Platform-wide statistics and recent activity</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent signups */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Signups</h2>
            <Link href="/admin/users" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentSignups?.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.email}</p>
                  <p className="text-xs text-gray-400">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    user.plan === 'solo' ? 'bg-purple-100 text-purple-700' :
                    user.plan === 'pro' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {user.plan}
                  </span>
                  {user.role === 'admin' && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700">admin</span>
                  )}
                </div>
              </div>
            ))}
            {!recentSignups?.length && (
              <p className="text-sm text-gray-400">No signups yet</p>
            )}
          </div>
        </div>

        {/* Recent reviews */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Reviews</h2>
            <Link href="/admin/reviews" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentReviews?.map((review) => (
              <div key={review.id} className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{review.file_name || 'Untitled'}</p>
                  <p className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                  {review.overall_risk_score !== null && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      review.overall_risk_score >= 7 ? 'bg-red-100 text-red-700' :
                      review.overall_risk_score >= 4 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {review.overall_risk_score}/10
                    </span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    review.status === 'complete' ? 'bg-green-100 text-green-700' :
                    review.status === 'error' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {review.status}
                  </span>
                </div>
              </div>
            ))}
            {!recentReviews?.length && (
              <p className="text-sm text-gray-400">No reviews yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

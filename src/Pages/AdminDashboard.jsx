// File: src/Pages/AdminDashboard.jsx

import { useState, useEffect } from 'react'
import Cookie from 'js-cookie'
import {
  Briefcase,
  UserCheck,
  UsersRound,
  Building2,
  TrendingUp,
  BookUser,
  School,
  Award,
} from 'lucide-react'
import api from '../api/axios' // Import the central axios instance
import './AdminDashboard.css'
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell, // Cell is needed for custom pie chart colors
} from 'recharts'
import RecentActivity from '../Components/RecentActivity'

// Helper function to capitalize the first letter of a string
const capitalize = (s) => {
  if (typeof s !== 'string' || !s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function AdminDashboard() {
  const [user, setUser] = useState({})
  const [applications, setApplications] = useState([])
  const [stats, setStats] = useState({
    totalCandidates: 0,
    activeJobs: 0,
    benchRequests: 0,
    partnerCompanies: 0,
    colleges: 0,
    placements: 0,
    interviews: 0,
  })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    // Logic to get user info from cookie
    const userData = Cookie.get('user')
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Invalid user data in cookie:', error)
      }
    }

    // Fetches the most recent applications for the table
    const fetchApplications = async () => {
      try {
        const response = await api.get('/applications')
        setApplications(response.data)
      } catch (err) {
        console.error('Failed to fetch applications:', err)
      }
    }

    // Fetches all statistics for the top cards
    const fetchStats = async () => {
      try {
        const [
          candidatesResponse,
          jobsResponse,
          requestsResponse,
          companiesResponse,
          interviewsResponse,
          collegeResponse,
        ] = await Promise.all([
          api.get('/candidates').catch((e) => ({ data: [] })),
          api.get('/jobs').catch((e) => ({ data: [] })),
          api.get('/candidates/pendings').catch((e) => ({ data: [] })),
          api.get('/company').catch((e) => ({ data: [] })),
          api.get('/interview/all').catch((e) => ({ data: [] })),
          api.get('/college-connect').catch((e) => ({ data: [] })),
        ])

        const pendingRequests = requestsResponse.data.filter(
          (req) => req.status === 'pending',
        )
        const placedCandidates = interviewsResponse.data.filter(
          (req) => req.status === 'placed',
        )

        setStats({
          totalCandidates: candidatesResponse.data.length,
          activeJobs: jobsResponse.data.length,
          benchRequests: pendingRequests.length,
          partnerCompanies: companiesResponse.data.length,
          colleges: collegeResponse.data.length,
          placements: placedCandidates.length, // Logic: a placement is an approved request
          interviews: interviewsResponse.data.length,
        })
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
      } finally {
        setLoadingStats(false)
      }
    }

    fetchStats()
    fetchApplications()
  }, [])

  // --- Data and configuration for Charts ---

  // Data for the Area Chart (Application Trends)
  const applicationsTrend = [
    { month: 'Jan', applications: 45, interviews: 12, hired: 3 },
    { month: 'Feb', applications: 52, interviews: 18, hired: 5 },
    { month: 'Mar', applications: 78, interviews: 25, hired: 8 },
    { month: 'Apr', applications: 95, interviews: 32, hired: 12 },
    { month: 'May', applications: 115, interviews: 38, hired: 15 },
    { month: 'Jun', applications: 128, interviews: 45, hired: 18 },
  ]

  // Data for the Pie Chart (Job Status Distribution)
  const pieChartData = [
    { name: 'Candidates', value: stats.totalCandidates },
    { name: 'Active Jobs', value: stats.activeJobs },
    { name: 'Placements', value: stats.placements },
    { name: 'Interviews', value: stats.interviews },
  ]

  const PIE_CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
  const RADIAN = Math.PI / 180

  // Custom label renderer for the Pie Chart
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill='white'
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline='central'>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  // Reusable StatCard component
  const StatCard = ({ title, value, subtext, icon, percentage, path }) => (
    <a href={path}>
      <div className='bg-white rounded-2xl p-4 hover:shadow-xl flex flex-col gap-1'>
        <div className='flex items-center justify-between'>
          <div className='bg-[#7eade0] p-2 rounded-lg'>{icon}</div>
          {percentage && <p className='text-[#16a34a]'>{percentage}</p>}
        </div>
        <div>
          <h1 className='text-3xl font-bold mt-3'>
            {loadingStats ? '...' : value}
          </h1>
          <p className='text-lg font-semibold text-[#267edc]'>{title}</p>
          <p className='text-sm text-[#64748b]'>{subtext}</p>
        </div>
      </div>
    </a>
  )

  return (
    <div className='flex flex-col gap-4 overflow-auto'>
      <div className='admin-main flex-1 rounded-2xl p-6 border-border flex flex-col md:flex-row items-start md:items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>
            Welcome back, {capitalize(user.name) || 'Admin'}!
          </h1>
          <span>Here&apos;s your {user.role} dashboard today.</span>
        </div>
      </div>

      {/* Card Container */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
        <StatCard
          title='Total Candidates'
          value={stats.totalCandidates}
          subtext='on bench'
          icon={<UsersRound className='stroke-[#0b325b] stroke-2' />}
          percentage='+12%'
          path='manage-candidates'
        />
        <StatCard
          title='Active Jobs'
          value={stats.activeJobs}
          subtext='new this week'
          icon={<Briefcase className='stroke-[#0b325b] stroke-2' />}
          percentage='+3%'
          path='manage-jobs'
        />
        {user.role !== 'recruiter' && (
          <StatCard
            title='Bench Requests'
            value={stats.benchRequests}
            subtext='awaiting approval'
            icon={<UserCheck className='stroke-[#0b325b] stroke-2' />}
            percentage={`+${stats.benchRequests}`}
            path='candidateList'
          />
        )}
        {user.role !== 'recruiter' && (
          <StatCard
            title='Partner Companies'
            value={stats.partnerCompanies}
            subtext='actively hiring'
            icon={<Building2 className='stroke-[#0b325b] stroke-2' />}
            percentage='+12%'
            path='companies'
          />
        )}
        <StatCard
          title='Colleges'
          value={stats.colleges}
          subtext='Colleges under us'
          icon={<School className='stroke-[#0b325b] stroke-2' />}
          percentage='+12%'
        />
        {user.role !== 'recruiter' && (<StatCard
          title='Interviews'
          value={stats.interviews}
          subtext='Interviews scheduled so far'
          icon={<BookUser className='stroke-[#0b325b] stroke-2' />}
          percentage='+12%'
          path='interviews'
        />)}
        <StatCard
          title='Placements'
          value={stats.placements}
          subtext='Candidates Placed'
          icon={<Award className='stroke-[#0b325b] stroke-2' />}
          percentage='+12%'
          path='placedcandidates'
        />
      </div>

      {/* Charts */}
      <div className='flex flex-col md:flex-row gap-4 mt-4'>
        {/* Area Chart */}
        <div className='bg-white rounded-xl w-full md:w-1/2 p-4'>
          <div className='flex gap-2 text-xl font-bold mb-4'>
            <TrendingUp className='stroke-2 stroke-[#0b325b]' />
            Application Trends
          </div>
          <ResponsiveContainer height={300} width='100%'>
            <BarChart
              data={applicationsTrend}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id='applications' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#d5963eff' stopOpacity={0.8} />
                  <stop offset='95%' stopColor='#d6a258ff' stopOpacity={0} />
                </linearGradient>
                <linearGradient id='interviews' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#63bee8ff' stopOpacity={0.8} />
                  <stop offset='95%' stopColor='#63bee8ff' stopOpacity={0} />
                </linearGradient>
                <linearGradient id='hired' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#319154ff' stopOpacity={0.8} />
                  <stop offset='95%' stopColor='#319154ff' stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey='month' />
              <YAxis />
              <CartesianGrid
                horizontal={false}
                vertical={false}
                strokeDasharray='3 3'
              />
              <Tooltip />
              <Bar
                type='monotone'
                dataKey='applications'
                stroke='#d6a258ff'
                fillOpacity={1}
                fill='url(#applications)'
              />
              <Bar
                type='monotone'
                dataKey='interviews'
                stroke='#0da2e7'
                fillOpacity={1}
                fill='url(#interviews)'
              />
              <Bar
                type='monotone'
                dataKey='hired'
                stroke='#16a34a'
                fillOpacity={1}
                fill='url(#hired)'
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className='bg-white rounded-xl w-full md:w-1/2 p-4'>
          <div className='flex gap-2 text-xl font-bold mb-4'>
            <Briefcase className='stroke-2 stroke-[#0b325b]' />
            Hiring Overview
          </div>
          <ResponsiveContainer height={300} width='100%'>
            <PieChart>
              <Pie
                data={pieChartData}
                cx='50%'
                cy='50%'
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                fill='#8884d8'
                dataKey='value'>
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>


            {/* <<< 2. INSERT RECENT ACTIVITY COMPONENT HERE >>> */}
      <RecentActivity />
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { Activity } from 'react'
import { Card, Button, Statistic, Progress, Badge } from 'antd'
import {
  DashboardOutlined,
  BarChartOutlined,
  SettingOutlined,
  BellOutlined,
  ClockCircleOutlined,
  FireOutlined
} from '@ant-design/icons'

/**
 * ActivityDashboard - Demonstrates React 19.2's <Activity> Component Benefits
 *
 * Key Features Demonstrated:
 * 1. Selective Hydration: Each section can hydrate independently
 * 2. State Preservation: Component state persists when section is hidden
 * 3. Effect Management: useEffect cleanup when hidden, restart when visible
 * 4. Performance: Hidden sections defer updates until React is idle
 * 5. Memory Trade-off: ~2x memory for faster navigation
 *
 * Use Cases:
 * - Multi-section dashboards with heavy data
 * - Tab interfaces with expensive components
 * - Pre-rendering content for faster navigation
 * - Optimizing initial page load with selective hydration
 */

// Simulates an expensive component with live data
const LiveStatsPanel = ({ title, color }: { title: string; color: string }) => {
  const [counter, setCounter] = useState(0)
  const [data, setData] = useState<number[]>([])

  console.log(`🔵 ${title} - Rendering (counter: ${counter})`)

  useEffect(() => {
    console.log(`✅ ${title} - Effect mounted`)
    const interval = setInterval(() => {
      setCounter((prev) => prev + 1)
      setData((prev) => [...prev, Math.floor(Math.random() * 100)])
    }, 1000)

    return () => {
      console.log(`❌ ${title} - Effect unmounted (cleanup)`)
      clearInterval(interval)
    }
  }, [title])

  const average = data.length > 0 ? Math.floor(data.reduce((a, b) => a + b, 0) / data.length) : 0

  return (
    <Card
      className='shadow-lg hover:shadow-xl transition-shadow'
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold' style={{ color }}>
          {title}
        </h3>
        <Badge count={counter} style={{ backgroundColor: color }} />
      </div>

      <div className='grid grid-cols-2 gap-4 mb-4'>
        <Statistic
          title='Live Counter'
          value={counter}
          prefix={<ClockCircleOutlined />}
          valueStyle={{ color }}
        />
        <Statistic
          title='Data Points'
          value={data.length}
          prefix={<FireOutlined />}
          valueStyle={{ color }}
        />
      </div>

      <div className='mb-2'>
        <p className='text-sm text-gray-600 mb-1'>Average Value: {average}%</p>
        <Progress percent={average} strokeColor={color} status='active' />
      </div>

      <div className='mt-4 p-3 bg-gray-50 rounded'>
        <p className='text-xs text-gray-500'>
          💡 <strong>Activity Benefit:</strong> This component's timer pauses when hidden,
          preserving state and saving CPU resources. When visible again, it resumes exactly where it
          left off!
        </p>
      </div>

      <div className='mt-2 text-xs text-gray-400'>
        Last {Math.min(5, data.length)} values: {data.slice(-5).join(', ')}
      </div>
    </Card>
  )
}

// Simulates expensive data fetching
const DataFetchPanel = ({ title, apiEndpoint }: { title: string; apiEndpoint: string }) => {
  const [loading, setLoading] = useState(true)
  const [fetchedData, setFetchedData] = useState<any>(null)
  const [fetchCount, setFetchCount] = useState(0)

  console.log(`🟢 ${title} - Rendering (fetchCount: ${fetchCount})`)

  useEffect(() => {
    console.log(`📡 ${title} - Fetching data...`)
    setLoading(true)

    // Simulate API call
    const timeout = setTimeout(() => {
      setFetchedData({
        items: Math.floor(Math.random() * 100),
        revenue: Math.floor(Math.random() * 10000),
        users: Math.floor(Math.random() * 500)
      })
      setFetchCount((prev) => prev + 1)
      setLoading(false)
      console.log(`✅ ${title} - Data fetched successfully`)
    }, 1500)

    return () => {
      console.log(`🚫 ${title} - Fetch cancelled (cleanup)`)
      clearTimeout(timeout)
    }
  }, [title, apiEndpoint])

  return (
    <Card className='shadow-lg' loading={loading}>
      <div className='flex items-center mb-4'>
        <BarChartOutlined className='text-2xl text-green-500 mr-3' />
        <h3 className='text-lg font-semibold'>{title}</h3>
      </div>

      {fetchedData && (
        <div className='grid grid-cols-3 gap-4'>
          <Statistic title='Items' value={fetchedData.items} />
          <Statistic title='Revenue' value={fetchedData.revenue} prefix='$' />
          <Statistic title='Users' value={fetchedData.users} suffix='👥' />
        </div>
      )}

      <div className='mt-4 p-3 bg-green-50 rounded'>
        <p className='text-xs text-green-700'>
          🚀 <strong>Hydration Optimization:</strong> This section can hydrate independently,
          improving perceived performance. Fetch count: {fetchCount}
        </p>
      </div>
    </Card>
  )
}

const ActivityDashboard = () => {
  const [visibleSection, setVisibleSection] = useState<'stats' | 'analytics' | 'settings' | 'all'>(
    'stats'
  )

  const sections = [
    { key: 'stats', label: 'Live Stats', icon: <DashboardOutlined /> },
    { key: 'analytics', label: 'Analytics', icon: <BarChartOutlined /> },
    { key: 'settings', label: 'Settings', icon: <SettingOutlined /> },
    { key: 'all', label: 'Show All', icon: <BellOutlined /> }
  ]

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      {/* Header */}
      <div className='mb-6 bg-white p-6 rounded-lg shadow'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>
           Activity Dashboard
        </h1>
        <p className='text-gray-600 mb-4'>
          Demonstration of <code className='bg-gray-100 px-2 py-1 rounded'>&lt;Activity&gt;</code>{' '}
          component's selective hydration and state management capabilities
        </p>

        {/* Section Toggle Buttons */}
        <div className='flex gap-2 flex-wrap'>
          {sections.map((section) => (
            <Button
              key={section.key}
              type={visibleSection === section.key ? 'primary' : 'default'}
              icon={section.icon}
              onClick={() => setVisibleSection(section.key as any)}
              size='large'
            >
              {section.label}
            </Button>
          ))}
        </div>
      </div>

            {/* Current Section Indicator */}
      <div className='mb-4 p-3 bg-purple-50 border border-purple-200 rounded'>
        <p className='text-sm text-purple-800'>
          👁️ <strong>Currently Viewing:</strong>{' '}
          {visibleSection === 'all' ? 'All Sections' : visibleSection.toUpperCase()}
          <span className='ml-3 text-xs text-purple-600'>
            (Open browser console to see Activity lifecycle logs)
          </span>
        </p>
      </div>

      {/* Activity-Wrapped Sections */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Live Stats Section */}
        <Activity mode={visibleSection === 'stats' || visibleSection === 'all' ? 'visible' : 'hidden'}>
          <div className='space-y-4'>
            <LiveStatsPanel title='Sales Statistics' color='#1890ff' />
            <LiveStatsPanel title='User Activity' color='#52c41a' />
          </div>
        </Activity>

        {/* Analytics Section */}
        <Activity
          mode={visibleSection === 'analytics' || visibleSection === 'all' ? 'visible' : 'hidden'}
        >
          <div className='space-y-4'>
            <DataFetchPanel title='Monthly Reports' apiEndpoint='/api/reports/monthly' />
            <DataFetchPanel title='Product Analytics' apiEndpoint='/api/analytics/products' />
          </div>
        </Activity>

        {/* Settings Section */}
        <Activity
          mode={visibleSection === 'settings' || visibleSection === 'all' ? 'visible' : 'hidden'}
        >
          <Card className='shadow-lg'>
            <div className='flex items-center mb-4'>
              <SettingOutlined className='text-2xl text-orange-500 mr-3' />
              <h3 className='text-lg font-semibold'>Configuration Settings</h3>
            </div>
            <div className='space-y-3'>
              <p className='text-gray-600'>
                This section demonstrates how Activity preserves form state and settings when
                toggling visibility.
              </p>
              <div className='p-4 bg-orange-50 rounded'>
                <p className='text-sm text-orange-700'>
                  ⚙️ <strong>Performance Note:</strong> Activity trades ~2x memory for instant
                  navigation speed. Hidden content stays in memory but effects are cleaned up.
                </p>
              </div>
            </div>
          </Card>
        </Activity>

        {/* Performance Metrics */}
        <Activity
          mode={visibleSection === 'all' ? 'visible' : 'hidden'}
        >
          <Card className='shadow-lg bg-gradient-to-br from-purple-50 to-pink-50'>
            <h3 className='text-lg font-semibold mb-4 text-purple-800'>
              🎯 Performance Metrics
            </h3>
            <div className='space-y-3'>
              <div className='flex justify-between items-center'>
                <span>Memory Usage</span>
                <Badge count='~2x' style={{ backgroundColor: '#722ed1' }} />
              </div>
              <div className='flex justify-between items-center'>
                <span>Hydration Speed</span>
                <Badge count='Fast' style={{ backgroundColor: '#52c41a' }} />
              </div>
              <div className='flex justify-between items-center'>
                <span>State Preservation</span>
                <Badge count='✓ Active' style={{ backgroundColor: '#1890ff' }} />
              </div>
            </div>
          </Card>
        </Activity>
      </div>

      {/* Footer Info */}
      <div className='mt-6 p-4 bg-white rounded-lg shadow'>
        <h4 className='font-semibold mb-2'>🔍 How to Test Activity Benefits:</h4>
        <ol className='text-sm text-gray-700 space-y-1 list-decimal list-inside'>
          <li>Click "Live Stats" and watch the counters increment</li>
          <li>Switch to "Analytics" (counters pause, check console for unmount logs)</li>
          <li>Switch back to "Live Stats" (counters resume from where they left off!)</li>
          <li>Click "Show All" to see all sections render simultaneously</li>
          <li>Open browser DevTools Console to see Activity lifecycle events</li>
        </ol>
      </div>
    </div>
  )
}

export default ActivityDashboard

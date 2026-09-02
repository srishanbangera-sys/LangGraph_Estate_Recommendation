/**
 * Mock Real Estate CRM & Market Intelligence Data
 * Corresponds to Dashboard Analytics View (Reference Image 2)
 */

export const ANALYTICS_METRICS = {
  activityGauge: {
    percentage: 35,
    label: '% with Activity',
    period: '*Past 30 days',
    scale: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    color: '#a855f7' // Purple gradient
  },
  subscribedGauge: {
    percentage: 50,
    label: '% Subscribed',
    period: '',
    scale: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    color: '#06b6d4' // Cyan/Teal
  },
  pipelineFunnel: [
    { stage: 'Not Contacted', count: 142, color: '#ef4444', percentage: 100 },
    { stage: 'Attempted Contact', count: 102, color: '#f97316', percentage: 72 },
    { stage: 'Nurturing', count: 55, color: '#f59e0b', percentage: 39 },
    { stage: 'Under Contract', count: 38, color: '#ec4899', percentage: 27 },
    { stage: 'Closed YTD', count: 13, color: '#10b981', percentage: 9 }
  ],
  leadSources: [
    { label: 'Zillow MLS', count: 312, percentage: 38, color: '#3b82f6' },
    { label: 'Website Direct', count: 240, percentage: 29, color: '#10b981' },
    { label: 'Social & AI Ads', count: 160, percentage: 19, color: '#8b5cf6' },
    { label: 'Referrals', count: 115, percentage: 14, color: '#06b6d4' }
  ],
  actionCenter: {
    past7Days: [
      { id: 'act-1', count: 7, label: 'calls logged', color: '#9333ea', bg: '#f3e8ff' },
      { id: 'act-2', count: 2, label: 'subscribers added', color: '#ea580c', bg: '#ffedd5' },
      { id: 'act-3', count: 10, label: 'leads updated', color: '#16a34a', bg: '#dcfce7' }
    ],
    today: [
      { id: 'td-1', icon: 'PhoneCall', text: 'Call 5 uncontacted leads', tag: 'High Priority' },
      { id: 'td-2', icon: 'Mail', text: 'Nurture 7 unsubscribed leads', tag: 'Campaign' },
      { id: 'td-3', icon: 'CheckSquare', text: "Update 10 leads' statuses", tag: 'CRM Sync' }
    ]
  },
  tasksThisWeek: [
    {
      id: 'task-1',
      title: 'Appointment with Mr/Ms McGregor (Villa Royale)',
      tag: 'Appointment',
      tagColor: 'bg-blue-100 text-blue-700',
      dueDate: 'Tues Oct 14',
      completed: false
    },
    {
      id: 'task-2',
      title: 'File paperwork for title at Ewan and Co.',
      tag: 'Call Back',
      tagColor: 'bg-emerald-100 text-emerald-700',
      dueDate: 'Wed Oct 15',
      completed: false
    },
    {
      id: 'task-3',
      title: 'Elizabeth Fredrick - Annual Portfolio Review',
      tag: 'Action Item',
      tagColor: 'bg-fuchsia-100 text-fuchsia-700',
      dueDate: 'Thur Oct 16',
      completed: false
    },
    {
      id: 'task-4',
      title: 'Finalize escrow contract for Casa Prestige',
      tag: 'Contract',
      tagColor: 'bg-amber-100 text-amber-700',
      dueDate: 'Fri Oct 17',
      completed: true
    }
  ]
};

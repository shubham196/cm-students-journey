import React, { useState, useEffect } from 'react';
import {
  Users,
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  Download,
  Eye
} from 'lucide-react';
import { StatsCard } from '../../components/admin/StatsCard';
import { DataTable, Column } from '../../components/admin/DataTable';
import { Chart } from '../../components/admin/Chart';
import { StatusBadge, ProgressBadge } from '../../components/admin/StatusBadge';
import { QuickActionButtons } from '../../components/admin/ActionButtons';
import { FilterBar, FilterOption } from '../../components/admin/FilterBar';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface AdminStudent {
  id: string;
  full_name: string;
  email: string;
  mobile: string;
  progress: number;
  status: string;
  documents_count: number;
  last_activity: string;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockStudents: AdminStudent[] = [
        {
          id: '1',
          full_name: 'John Doe',
          email: 'john@example.com',
          mobile: '9876543210',
          progress: 85,
          status: 'In Progress',
          documents_count: 5,
          last_activity: '2025-01-15',
          created_at: '2025-01-10'
        },
        {
          id: '2',
          full_name: 'Jane Smith',
          email: 'jane@example.com',
          mobile: '9876543211',
          progress: 100,
          status: 'Completed',
          documents_count: 6,
          last_activity: '2025-01-14',
          created_at: '2025-01-08'
        },
        {
          id: '3',
          full_name: 'Mike Johnson',
          email: 'mike@example.com',
          mobile: '9876543212',
          progress: 45,
          status: 'Pending',
          documents_count: 3,
          last_activity: '2025-01-13',
          created_at: '2025-01-12'
        },
        {
          id: '4',
          full_name: 'Sarah Williams',
          email: 'sarah@example.com',
          mobile: '9876543213',
          progress: 65,
          status: 'In Progress',
          documents_count: 4,
          last_activity: '2025-01-16',
          created_at: '2025-01-09'
        },
        {
          id: '5',
          full_name: 'David Brown',
          email: 'david@example.com',
          mobile: '9876543214',
          progress: 20,
          status: 'Pending',
          documents_count: 1,
          last_activity: '2025-01-11',
          created_at: '2025-01-11'
        }
      ];
      setStudents(mockStudents);
      setLoading(false);
    }, 500);
  }, []);

  const stats = [
    {
      title: 'Total Students',
      value: '2,543',
      change: 12.5,
      icon: Users,
      iconColor: 'from-blue-500 to-blue-600',
      trend: 'up' as const,
      subtitle: '145 new this month'
    },
    {
      title: 'Applications',
      value: '1,829',
      change: 8.3,
      icon: FileText,
      iconColor: 'from-green-500 to-green-600',
      trend: 'up' as const,
      subtitle: '234 pending review'
    },
    {
      title: 'Completed',
      value: '1,234',
      change: 15.2,
      icon: CheckCircle,
      iconColor: 'from-purple-500 to-purple-600',
      trend: 'up' as const,
      subtitle: '67% completion rate'
    },
    {
      title: 'Pending',
      value: '595',
      change: -5.1,
      icon: Clock,
      iconColor: 'from-amber-500 to-amber-600',
      trend: 'down' as const,
      subtitle: 'Awaiting documents'
    }
  ];

  const chartData = [
    { name: 'Jan', applications: 400 },
    { name: 'Feb', applications: 450 },
    { name: 'Mar', applications: 520 },
    { name: 'Apr', applications: 580 },
    { name: 'May', applications: 650 },
    { name: 'Jun', applications: 720 },
  ];

  const columns: Column<AdminStudent>[] = [
    {
      key: 'full_name',
      header: 'Student Name',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      )
    },
    {
      key: 'mobile',
      header: 'Mobile',
      sortable: true
    },
    {
      key: 'progress',
      header: 'Progress',
      sortable: true,
      render: (value) => <ProgressBadge progress={value} />
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'documents_count',
      header: 'Documents',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-500" />
          <span>{value}/6</span>
        </div>
      )
    },
    {
      key: 'last_activity',
      header: 'Last Activity',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'id',
      header: 'Actions',
      render: (value, row) => (
        <QuickActionButtons
          onView={() => {
            toast.info(`Viewing ${row.full_name}`);
            // navigate(`/admin/students/${value}`);
          }}
          onEdit={() => {
            toast.info(`Editing ${row.full_name}`);
          }}
        />
      )
    }
  ];

  const filterOptions: FilterOption[] = [
    {
      key: 'search',
      label: 'Search',
      type: 'text'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'All', value: '' },
        { label: 'Pending', value: 'pending' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' }
      ]
    },
    {
      key: 'date_from',
      label: 'From Date',
      type: 'date'
    },
    {
      key: 'date_to',
      label: 'To Date',
      type: 'date'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Monitor and manage student admissions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart
          type="area"
          data={chartData}
          title="Applications Trend"
          description="Monthly application submissions"
          dataKey="applications"
          xKey="name"
          colors={['#3b82f6']}
        />
        <Chart
          type="bar"
          data={chartData}
          title="Monthly Overview"
          description="Application volume per month"
          dataKey="applications"
          xKey="name"
          colors={['#10b981']}
        />
      </div>

      {/* Filters */}
      <FilterBar
        filters={filterOptions}
        values={filterValues}
        onChange={(key, value) => setFilterValues({ ...filterValues, [key]: value })}
        onClear={() => setFilterValues({})}
        onSearch={() => toast.info('Applying filters...')}
      />

      {/* Students Table */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Applications</h2>
        <DataTable
          data={students}
          columns={columns}
          searchPlaceholder="Search students..."
          exportable
          onRowClick={(row) => toast.info(`Clicked: ${row.full_name}`)}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;

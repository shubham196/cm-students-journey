# Admin Panel Components Guide

## Overview

This guide covers all the TypeScript admin components available in the Student Admission Portal.

## Components

### 1. DataTable (`components/admin/DataTable.tsx`)

A powerful, feature-rich data table component with sorting, filtering, pagination, and CSV export.

**Features:**
- Sortable columns
- Search functionality  
- Pagination
- CSV export
- Clickable rows
- Custom cell rendering
- Responsive design

**Usage:**
```tsx
import { DataTable, Column } from '@/components/admin/DataTable';

const columns: Column<Student>[] = [
  {
    key: 'full_name',
    header: 'Name',
    sortable: true,
    render: (value, row) => <div className="font-medium">{value}</div>
  },
  {
    key: 'email',
    header: 'Email',
    sortable: true
  }
];

<DataTable
  data={students}
  columns={columns}
  searchPlaceholder="Search students..."
  exportable
  onRowClick={(row) => console.log(row)}
/>
```

### 2. StatsCard (`components/admin/StatsCard.tsx`)

Beautiful stat cards with icons, trends, and percentage changes.

**Usage:**
```tsx
import { StatsCard } from '@/components/admin/StatsCard';
import { Users } from 'lucide-react';

<StatsCard
  title="Total Students"
  value="2,543"
  change={12.5}
  icon={Users}
  iconColor="from-blue-500 to-blue-600"
  trend="up"
  subtitle="145 new this month"
/>
```

### 3. Chart (`components/admin/Chart.tsx`)

Recharts-based chart component supporting multiple chart types.

**Supported Types:**
- Line Chart
- Bar Chart
- Area Chart
- Pie Chart

**Usage:**
```tsx
import { Chart } from '@/components/admin/Chart';

const data = [
  { name: 'Jan', applications: 400 },
  { name: 'Feb', applications: 450 },
  // ...
];

<Chart
  type="area"
  data={data}
  title="Applications Trend"
  description="Monthly submissions"
  dataKey="applications"
  xKey="name"
  colors={['#3b82f6']}
  height={300}
/>
```

### 4. FilterBar (`components/admin/FilterBar.tsx`)

Advanced filtering component with multiple input types.

**Filter Types:**
- Text search
- Select dropdown
- Date picker
- Date range

**Usage:**
```tsx
import { FilterBar, FilterOption } from '@/components/admin/FilterBar';

const filters: FilterOption[] = [
  { key: 'search', label: 'Search', type: 'text' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'All', value: '' },
      { label: 'Active', value: 'active' }
    ]
  },
  { key: 'date', label: 'Date', type: 'date' }
];

<FilterBar
  filters={filters}
  values={filterValues}
  onChange={(key, value) => setFilterValues({ ...filterValues, [key]: value })}
  onClear={() => setFilterValues({})}
  onSearch={() => console.log('Searching...')}
/>
```

### 5. ActionButtons (`components/admin/ActionButtons.tsx`)

Dropdown menu and quick action buttons for table rows.

**Components:**
- `ActionButtons` - Dropdown menu with multiple actions
- `QuickActionButtons` - Quick access buttons (view, edit, delete, approve, reject)

**Usage:**
```tsx
import { QuickActionButtons } from '@/components/admin/ActionButtons';

<QuickActionButtons
  onView={() => console.log('View')}
  onEdit={() => console.log('Edit')}
  onDelete={() => console.log('Delete')}
  onApprove={() => console.log('Approve')}
  onReject={() => console.log('Reject')}
/>
```

### 6. StatusBadge (`components/admin/StatusBadge.tsx`)

Status badges with auto-color detection and progress bars.

**Components:**
- `StatusBadge` - Colored status indicator
- `ProgressBadge` - Progress bar with percentage

**Usage:**
```tsx
import { StatusBadge, ProgressBadge } from '@/components/admin/StatusBadge';

<StatusBadge status="Completed" />
<StatusBadge status="Pending" variant="warning" />

<ProgressBadge progress={75} />
```

## Pages

### Admin Dashboard (`pages/admin/AdminDashboard.tsx`)

Complete admin dashboard with:
- Overview statistics (4 stat cards)
- Application trend charts
- Advanced filters
- Recent applications table
- Export functionality

### Students Management (`pages/admin/StudentsManagement.tsx`)

Comprehensive student management page with:
- Student list with all details
- Bulk actions (email, export)
- Quick filters
- Individual student actions
- Statistics overview

## Admin Layout (`layouts/AdminLayout.tsx`)

Professional admin layout featuring:
- Fixed top navigation with search
- Collapsible sidebar
- User dropdown menu
- Notifications bell
- Responsive design
- Mobile-friendly

## Routes

### Admin Routes:
- `/admin/dashboard` - Main admin dashboard
- `/admin/students` - Students management
- `/admin/applications` - Applications (to be implemented)
- `/admin/settings` - Settings (to be implemented)

## Accessing Admin Panel

1. Login as admin user
2. Navigate to `/admin/dashboard`
3. Use the sidebar to navigate between sections

## TypeScript Types

All components are fully typed. Import types from:

```tsx
import type { Column } from '@/components/admin/DataTable';
import type { FilterOption } from '@/components/admin/FilterBar';
import type { AdminStudent, Student, AdmissionStep } from '@/types';
```

## Styling

Components use:
- Tailwind CSS for styling
- Shadcn UI for base components
- Lucide React for icons
- Custom animations and transitions

## Best Practices

1. **Always provide types** when using TypeScript components
2. **Use proper data-testid** attributes for testing
3. **Handle loading states** appropriately
4. **Show toast notifications** for user feedback
5. **Implement error boundaries** for production
6. **Use memo and useMemo** for large data sets
7. **Implement proper pagination** for tables with 50+ rows

## Performance Tips

1. **DataTable**: Use pagination for large datasets (>100 rows)
2. **Charts**: Limit data points to 50-100 for smooth rendering
3. **Filters**: Debounce search inputs
4. **Images**: Use lazy loading for avatar/profile images
5. **Export**: Handle large exports in background

## Future Enhancements

- [ ] Advanced analytics dashboard
- [ ] Real-time notifications
- [ ] Document verification interface
- [ ] Bulk import/export
- [ ] Email templates
- [ ] SMS notifications
- [ ] Role-based access control
- [ ] Audit logs
- [ ] Advanced reporting

## Support

For issues or questions, refer to:
- Component source code in `/src/components/admin/`
- TypeScript types in `/src/types/index.ts`
- Example implementations in `/src/pages/admin/`

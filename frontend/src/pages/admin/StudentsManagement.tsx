import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Download,
  Mail,
  Phone,
  Calendar,
  Eye,
  Edit,
  Trash,
  Filter
} from 'lucide-react';
import { DataTable, Column } from '../../components/admin/DataTable';
import { StatusBadge, ProgressBadge } from '../../components/admin/StatusBadge';
import { QuickActionButtons } from '../../components/admin/ActionButtons';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

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

const StudentsManagement: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockData: AdminStudent[] = Array.from({ length: 25 }, (_, i) => ({
        id: `student-${i + 1}`,
        full_name: `Student ${i + 1}`,
        email: `student${i + 1}@example.com`,
        mobile: `98765432${10 + i}`,
        progress: Math.floor(Math.random() * 100),
        status: ['Pending', 'In Progress', 'Completed'][Math.floor(Math.random() * 3)],
        documents_count: Math.floor(Math.random() * 7),
        last_activity: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
        created_at: new Date(Date.now() - Math.random() * 20000000000).toISOString().split('T')[0]
      }));
      
      setStudents(mockData);
    } catch (error) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = (id: string) => {
    toast.success(`Student ${id} deleted successfully`);
    setStudents(students.filter(s => s.id !== id));
  };

  const handleBulkEmail = () => {
    if (selectedStudents.length === 0) {
      toast.warning('Please select students first');
      return;
    }
    toast.info(`Sending email to ${selectedStudents.length} students`);
  };

  const columns: Column<AdminStudent>[] = [
    {
      key: 'select',
      header: '',
      render: (_, row) => (
        <input
          type="checkbox"
          checked={selectedStudents.includes(row.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedStudents([...selectedStudents, row.id]);
            } else {
              setSelectedStudents(selectedStudents.filter(id => id !== row.id));
            }
          }}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      className: 'w-12'
    },
    {
      key: 'full_name',
      header: 'Student Details',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {value.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{value}</div>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {row.email}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'mobile',
      header: 'Contact',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2 text-gray-700">
          <Phone className="w-4 h-4 text-gray-500" />
          {value}
        </div>
      )
    },
    {
      key: 'progress',
      header: 'Progress',
      sortable: true,
      render: (value) => <ProgressBadge progress={value} />,
      className: 'min-w-[200px]'
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
        <div className="text-center">
          <span className={`font-medium ${
            value >= 6 ? 'text-green-600' : value >= 3 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {value}/6
          </span>
        </div>
      ),
      className: 'text-center'
    },
    {
      key: 'created_at',
      header: 'Joined',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar className="w-4 h-4 text-gray-500" />
          {new Date(value).toLocaleDateString()}
        </div>
      )
    },
    {
      key: 'id',
      header: 'Actions',
      render: (value, row) => (
        <QuickActionButtons
          onView={() => toast.info(`Viewing ${row.full_name}`)}
          onEdit={() => toast.info(`Editing ${row.full_name}`)}
          onDelete={() => handleDeleteStudent(value)}
        />
      ),
      className: 'text-right'
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Students Management</h1>
          <p className="text-gray-600">Manage all student applications and profiles</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => toast.info('Export functionality')} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export All
          </Button>
          <Button onClick={() => toast.info('Add new student')} className="bg-blue-600 hover:bg-blue-700 gap-2">
            <UserPlus className="w-4 h-4" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{students.length}</div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {students.filter(s => s.status === 'Completed').length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {students.filter(s => s.status === 'In Progress').length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {students.filter(s => s.status === 'Pending').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions */}
      {selectedStudents.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {selectedStudents.length} student(s) selected
              </span>
              <div className="flex items-center gap-3">
                <Button onClick={handleBulkEmail} size="sm" variant="outline" className="gap-2">
                  <Mail className="w-4 h-4" />
                  Send Email
                </Button>
                <Button onClick={() => toast.info('Bulk action')} size="sm" variant="outline">
                  Bulk Actions
                </Button>
                <Button
                  onClick={() => setSelectedStudents([])}
                  size="sm"
                  variant="ghost"
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Students Table */}
      <DataTable
        data={students}
        columns={columns}
        searchPlaceholder="Search by name, email, or mobile..."
        exportable
        emptyMessage="No students found"
      />
    </div>
  );
};

export default StudentsManagement;

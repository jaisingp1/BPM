'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  TrendingUp,
  Plus,
  ArrowRight,
  Activity,
  BarChart3,
  Timer,
  Star
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useLoading } from '@/contexts/loading-context';
import { Sidebar } from '@/components/sidebar';
import { LoadingSpinner, CardSkeleton } from '@/components/ui/loading';

const statsCards = [
  {
    title: 'Total Requests',
    value: '156',
    change: '+12%',
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    title: 'Pending Review',
    value: '23',
    change: '+5%',
    icon: Clock,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  {
    title: 'Completed',
    value: '89',
    change: '+18%',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    title: 'Need Attention',
    value: '7',
    change: '-2%',
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  }
];

const recentRequests = [
  {
    id: 'REQ-001',
    title: 'Equipment Maintenance Request',
    type: 'Maintenance',
    status: 'In Progress',
    priority: 'High',
    submittedBy: 'John Smith',
    submittedAt: '2 hours ago',
    progress: 65
  },
  {
    id: 'REQ-002',
    title: 'IT Support - Software Installation',
    type: 'IT Support',
    status: 'Pending',
    priority: 'Medium',
    submittedBy: 'Sarah Johnson',
    submittedAt: '4 hours ago',
    progress: 25
  },
  {
    id: 'REQ-003',
    title: 'Purchase Order - Office Supplies',
    type: 'Procurement',
    status: 'Completed',
    priority: 'Low',
    submittedBy: 'Mike Wilson',
    submittedAt: '1 day ago',
    progress: 100
  },
  {
    id: 'REQ-004',
    title: 'Safety Equipment Request',
    type: 'Safety',
    status: 'In Review',
    priority: 'High',
    submittedBy: 'Emily Brown',
    submittedAt: '2 days ago',
    progress: 45
  }
];

const workflowStats = [
  {
    name: 'IT Support',
    requests: 45,
    avgTime: '2.3 days',
    efficiency: 87
  },
  {
    name: 'Maintenance',
    requests: 32,
    avgTime: '4.1 days',
    efficiency: 72
  },
  {
    name: 'Procurement',
    requests: 28,
    avgTime: '5.7 days',
    efficiency: 68
  },
  {
    name: 'Safety',
    requests: 18,
    avgTime: '1.8 days',
    efficiency: 92
  }
];

const teamActivity = [
  {
    user: 'Alex Thompson',
    action: 'Completed request',
    target: 'REQ-001',
    time: '10 minutes ago',
    avatar: '/avatars/alex.jpg'
  },
  {
    user: 'Maria Garcia',
    action: 'Approved request',
    target: 'REQ-004',
    time: '25 minutes ago',
    avatar: '/avatars/maria.jpg'
  },
  {
    user: 'David Lee',
    action: 'Submitted request',
    target: 'REQ-005',
    time: '1 hour ago',
    avatar: '/avatars/david.jpg'
  },
  {
    user: 'Lisa Chen',
    action: 'Commented on',
    target: 'REQ-002',
    time: '2 hours ago',
    avatar: '/avatars/lisa.jpg'
  }
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { isLoading } = useLoading();
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsDataLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="lg:pl-80">
          <div className="p-4 lg:p-8">
            <div className="space-y-8">
              <div>
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white p-6 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CardSkeleton />
                <CardSkeleton />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in review':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="lg:pl-80">
        <div className="p-4 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name || 'User'}</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <Button asChild className="bg-orange-600 hover:bg-orange-700">
                <Link href="/requests/new">
                  <Plus className="w-4 h-4 mr-2" />
                  New Request
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user?.name}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="requests">Recent Requests</TabsTrigger>
              <TabsTrigger value="workflows">Workflows</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-orange-600" />
                      Recent Requests
                    </CardTitle>
                    <CardDescription>Latest request submissions and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentRequests.slice(0, 3).map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">{request.title}</span>
                              <Badge className={getStatusColor(request.status)}>
                                {request.status}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-sm text-gray-500">{request.id}</span>
                              <span className="text-sm text-gray-500">{request.submittedAt}</span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4" asChild>
                      <Link href="/requests/all">View All Requests</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-orange-600" />
                      Workflow Performance
                    </CardTitle>
                    <CardDescription>Efficiency metrics by workflow type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {workflowStats.map((workflow) => (
                        <div key={workflow.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">{workflow.name}</span>
                            <span className="text-sm text-gray-500">{workflow.efficiency}%</span>
                          </div>
                          <Progress value={workflow.efficiency} className="h-2" />
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{workflow.requests} requests</span>
                            <span>{workflow.avgTime}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="requests">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Requests</CardTitle>
                  <CardDescription>All recent request submissions and their current status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-medium text-gray-900">{request.title}</h3>
                              <Badge className={getStatusColor(request.status)}>
                                {request.status}
                              </Badge>
                              <Badge className={getPriorityColor(request.priority)}>
                                {request.priority}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                              <span>{request.id}</span>
                              <span>{request.type}</span>
                              <span>by {request.submittedBy}</span>
                              <span>{request.submittedAt}</span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium">{request.progress}%</span>
                              </div>
                              <Progress value={request.progress} className="h-2" />
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="ml-4">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="workflows">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {workflowStats.map((workflow) => (
                  <Card key={workflow.name}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{workflow.name}</span>
                        <Badge variant="outline">{workflow.requests} active</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Efficiency Rate</span>
                          <span className="text-lg font-bold text-green-600">{workflow.efficiency}%</span>
                        </div>
                        <Progress value={workflow.efficiency} className="h-3" />
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Average Time</span>
                          <span className="font-medium">{workflow.avgTime}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Total Requests</span>
                          <span className="font-medium">{workflow.requests}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Timer className="w-5 h-5 mr-2 text-orange-600" />
                    Team Activity
                  </CardTitle>
                  <CardDescription>Recent actions and updates from team members</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teamActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={activity.avatar} />
                          <AvatarFallback>{activity.user[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium text-gray-900">{activity.user}</span>
                            <span className="text-gray-600 mx-1">{activity.action.toLowerCase()}</span>
                            <span className="font-medium text-gray-900">{activity.target}</span>
                          </p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
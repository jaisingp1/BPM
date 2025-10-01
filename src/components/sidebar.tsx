'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Settings,
  Users,
  BarChart3,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  History,
  Workflow,
  ShieldCheck,
  Wrench,
  ShoppingCart,
  LifeBuoy,
  Key,
  TriangleAlert
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    description: 'Main dashboard overview'
  },
  {
    title: 'New Request',
    href: '/requests/new',
    icon: PlusCircle,
    description: 'Create a new request'
  },
  {
    title: 'My Requests',
    href: '/requests/my',
    icon: FileText,
    description: 'View your requests'
  },
  {
    title: 'All Requests',
    href: '/requests/all',
    icon: FileText,
    description: 'View all requests'
  },
  {
    title: 'Workflow Designer',
    href: '/workflows',
    icon: Workflow,
    description: 'Design workflows'
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'View analytics'
  },
  {
    title: 'Audit History',
    href: '/audit',
    icon: History,
    description: 'View audit history'
  },
  {
    title: 'Users',
    href: '/users',
    icon: Users,
    description: 'Manage users'
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'System settings'
  }
];

const workflowCategories = [
  {
    title: 'IT Support',
    icon: ShieldCheck,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    title: 'Maintenance',
    icon: Wrench,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  {
    title: 'Procurement',
    icon: ShoppingCart,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    title: 'Safety',
    icon: TriangleAlert,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  {
    title: 'Access',
    icon: Key,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  }
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMobile}
          className="bg-white shadow-lg"
        >
          {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar for mobile */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={toggleMobile}>
          <div 
            className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent 
              isCollapsed={false} 
              pathname={pathname} 
              onMobileClose={toggleMobile}
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div 
        className={cn(
          "hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out fixed h-full z-30",
          isCollapsed ? "w-16" : "w-80",
          className
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Epiroc</h1>
                <p className="text-xs text-gray-500">Request Portal</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="hidden lg:flex"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <TooltipProvider delayDuration={0}>
            <nav className="space-y-6">
              {/* Main Navigation */}
              <div>
                {!isCollapsed && (
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Main Menu
                  </h3>
                )}
                <div className="space-y-1">
                  {navigationItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Tooltip key={item.href}>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                              isActive
                                ? "bg-orange-100 text-orange-700"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            )}
                          >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            {!isCollapsed && (
                              <>
                                <span className="flex-1">{item.title}</span>
                                {isActive && (
                                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                                )}
                              </>
                            )}
                          </Link>
                        </TooltipTrigger>
                        {isCollapsed && (
                          <TooltipContent side="right">
                            <p>{item.title}</p>
                            <p className="text-xs text-gray-500">{item.description}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  })}
                </div>
              </div>

              {/* Workflow Categories */}
              {!isCollapsed && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Workflow Categories
                  </h3>
                  <div className="space-y-2">
                    {workflowCategories.map((category) => (
                      <div
                        key={category.title}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-50"
                      >
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", category.bgColor)}>
                          <category.icon className={cn("h-4 w-4", category.color)} />
                        </div>
                        <span className="text-sm text-gray-700">{category.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </nav>
          </TooltipProvider>
        </ScrollArea>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              <p>Epiroc Request Management</p>
              <p>Version 1.0.0</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

interface SidebarContentProps {
  isCollapsed: boolean;
  pathname: string;
  onMobileClose: () => void;
}

function SidebarContent({ isCollapsed, pathname, onMobileClose }: SidebarContentProps) {
  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Epiroc</h1>
            <p className="text-xs text-gray-500">Request Portal</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-6">
          {/* Main Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Main Menu
            </h3>
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onMobileClose}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-orange-100 text-orange-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="flex-1">{item.title}</span>
                    {isActive && (
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Workflow Categories */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Workflow Categories
            </h3>
            <div className="space-y-2">
              {workflowCategories.map((category) => (
                <div
                  key={category.title}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-50"
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", category.bgColor)}>
                    <category.icon className={cn("h-4 w-4", category.color)} />
                  </div>
                  <span className="text-sm text-gray-700">{category.title}</span>
                </div>
              ))}
            </div>
          </div>
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>Epiroc Request Management</p>
          <p>Version 1.0.0</p>
        </div>
      </div>
    </>
  );
}
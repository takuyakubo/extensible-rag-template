'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  MessageSquare, 
  FileText, 
  Settings, 
  Users, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { Button } from './button';
import { logout } from '@/lib/api/auth';

const navItems = [
  {
    name: 'チャット',
    href: '/dashboard/chat',
    icon: MessageSquare
  },
  {
    name: 'ドキュメント',
    href: '/dashboard/documents',
    icon: FileText
  },
  {
    name: 'ユーザー管理',
    href: '/dashboard/admin/users',
    icon: Users
  },
  {
    name: '設定',
    href: '/dashboard/settings',
    icon: Settings
  }
];

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* デスクトップナビゲーション */}
      <nav className="hidden md:flex flex-col h-full w-64 border-r bg-background p-4">
        <div className="text-xl font-bold mb-8">RAGシステム</div>
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </div>
        <div className="mt-auto">
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isLoggingOut ? 'ログアウト中...' : 'ログアウト'}
          </Button>
        </div>
      </nav>

      {/* モバイルヘッダー */}
      <div className="md:hidden flex items-center justify-between p-4 border-b">
        <div className="text-xl font-bold">RAGシステム</div>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* モバイルメニュー */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background pt-16">
          <nav className="flex flex-col p-4 space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={cn(
                    "flex items-center py-3 px-4 rounded-md text-base font-medium transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
            <div className="pt-4 mt-4 border-t">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                disabled={isLoggingOut}
              >
                <LogOut className="mr-3 h-5 w-5" />
                {isLoggingOut ? 'ログアウト中...' : 'ログアウト'}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
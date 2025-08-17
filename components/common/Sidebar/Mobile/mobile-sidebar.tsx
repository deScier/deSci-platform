'use client';

export { MobileSidebarComponent }; 

import { ScrollArea } from '@/components/ui/scroll-area';
import { items } from '@/mock/sidebar_items';
import { home_routes } from '@/routes/home';
import { SelectCreation } from '@/components/common/sidebar/select-creation/select-creation';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { X } from 'react-bootstrap-icons';

import Item from '@/components/common/sidebar/item/item';
import Logout from '@/components/common/sidebar/logout/logout';
import LogoDeScier from 'public/svgs/common/logo/deScier - Logo copy.svg';
import React from 'react';

/**
 * @title Mobile Sidebar Component
 * @notice This component renders a mobile-friendly sidebar with navigation and session management options.
 * @dev This component uses the Next.js router and session hooks for navigation and session state management.
 */
const MobileSidebarComponent: React.FC<{ onClose: (text?: string) => void }> = ({ onClose }: { onClose: (text?: string) => void }) => {
  /**
   * @dev Initialize the router using the useRouter hook from Next.js for navigation.
   */
  const router = useRouter();

  /**
   * @dev Retrieve the current path from the usePathname hook.
   */
  const currentPath = usePathname();

  /**
   * @dev Initialize session state using useSession hook.
   */
  const { data: session } = useSession();

  return (
    <React.Fragment>
      <ScrollArea className="h-[calc(100vh-7.5rem)]">
        <div className="flex flex-col gap-8 content-between">
          <div className="flex flex-col gap-6 flex-grow">
            <div className="flex justify-between content-center items-center">
              <LogoDeScier className="max-w-[56px] w-full h-full" />
              <X
                className="w-10 h-10 mb-2 cursor-pointer hover:text-status-error transition-all duration-500 ease-out md:hover:scale-110 md:hover:rotate-180 transform"
                onClick={() => onClose()}
              />
            </div>
            <SelectCreation
              onValueChange={(value) => {
                router.push(value);
                onClose();
              }}
            />
            <div>
              {items.map((item) =>
                session?.user?.userInfo.role !== 'ADMIN' && item.text === 'Admin' ? null : (
                  <div className="grid" key={item.id}>
                    <Item
                      key={item.id}
                      icon={item.icon}
                      href={item.path}
                      divider={item.divider}
                      icon_end={item.icon_end}
                      text={item.text as string}
                      active={currentPath.includes(item.path as string)}
                      onClick={() => onClose(item.text as string)}
                    />
                  </div>
                )
              )}
            </div>
          </div>
          <Logout onLogout={() => router.push(home_routes.home.index)} />
        </div>
      </ScrollArea>
    </React.Fragment>
  );
};

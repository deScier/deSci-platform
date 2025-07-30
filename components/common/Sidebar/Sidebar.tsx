'use client';

import * as Dialog from '@components/common/Dialog/Digalog';

import { PurchasedArticles } from '@/components/modules/Home/Search/Purchase/PurchasedArticles';
import { admin_key, article_key, items } from '@/mock/sidebar_items';
import { home_routes } from '@/routes/home';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { SelectCreation } from './SelectCreation/SelectCreation';

import LogoDeScier from 'public/svgs/common/logo/deScier - Logo.svg';
import React from 'react';
import Item from './Item/Item';
import Logout from './Logout/Logout';

/**
 * @title Sidebar Component
 * @notice Provides a sidebar navigation for the application, allowing users to navigate through different sections and functionalities.
 * @dev This component utilizes React.FC for functional component structure, useSession for session management, useRouter for routing, and useState for state management.
 */
const Sidebar: React.FC = () => {
  /** @dev Initialize session hook for user session management */
  const { data: session } = useSession();

  /** @dev Initialize router for navigation control */
  const router = useRouter();

  /** @dev Retrieve current path from the router for active link styling */
  const currentPath = usePathname();

  /** @dev State to manage whether the user has made a purchase */
  const [purchased, setPurchased] = React.useState(false);

  /** @dev Check if the user role is Administrator */
  const isAdministrator = session?.user?.userInfo.role !== 'ADMIN';

  return (
    <React.Fragment>
      <Dialog.Root open={purchased}>
        <Dialog.Content className={twMerge('max-w-[1024px] w-full h-fit', `${purchased && 'max-w-[80%]'}`)}>
          {purchased && <PurchasedArticles onClose={() => setPurchased(false)} />}
        </Dialog.Content>
      </Dialog.Root>
      <aside className="hidden md:flex flex-col gap-8 left-0 sticky pt-10 pb-14 px-6 justify-between bg-[#FEFEFE] z-50 xxl:min-h-full 2xl:h-screen 2xl:min-h-screen">
        <div className="flex flex-col gap-8">
          <LogoDeScier className="w-20 h-20 mx-auto my-0" />
          <SelectCreation />
          <div key={currentPath}>
            {items.map((item, index) =>
              isAdministrator && item.text === admin_key ? null : (
                <Item
                  key={index}
                  icon={item.icon}
                  href={item.path}
                  divider={item.divider}
                  icon_end={item.icon_end}
                  text={item.text as string}
                  active={currentPath.includes(item.path as string)}
                  onClick={() => item.text === article_key && setPurchased(true)}
                />
              )
            )}
          </div>
        </div>
        <Logout onLogout={() => router.push(home_routes.home.index)} />
      </aside>
    </React.Fragment>
  );
};

export default Sidebar;

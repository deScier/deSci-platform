'use client';

import * as Dialog from '@components/common/Dialog/Digalog';
import * as Drawer from '@components/common/drawer/drawer';

import { PurchasedArticles } from '@/components/modules/home/search/purchase/purchased-articles';
import { article_key } from '@/mock/sidebar_items';
import { home_routes } from '@/routes/home';
import { Person } from 'react-bootstrap-icons';
import { twMerge } from 'tailwind-merge';
import { MobileSidebarComponent } from '@/components/common/sidebar/mobile/mobile-sidebar';
import { MobileProfileComponent } from '@/components/common/sidebar/mobile/profile-sidebar';

import useDimension from '@/hooks/useWindowDimension';
import Link from 'next/link';
import LogoDeScier from 'public/svgs/common/logo/deScier - Logo copy.svg';
import React from 'react';

/**
 * @title Mobile Sidebar Component
 * @notice Implements a mobile sidebar navigation with profile and dashboard access.
 * @dev This component uses React state to toggle between sidebar and profile views in a mobile environment.
 */
export function SidebarMobile() {
  const { windowDimension } = useDimension();

  /** @dev State to manage the open status of navigation ('sidebar', 'profile', or false) */
  const [openNav, setOpenNav] = React.useState<'sidebar' | 'profile' | false>(false);
  /** @dev State to manage whether the user has made a purchase */
  const [purchased, setPurchased] = React.useState(false);

  return (
    <React.Fragment>
      <Dialog.Root open={purchased}>
        <Dialog.Content>{purchased && <PurchasedArticles onClose={() => setPurchased(false)} />}</Dialog.Content>
      </Dialog.Root>
      <aside className="md:hidden z-50">
        <div className="mx-auto max-w-screen-xl px-6 py-3 rounded-none bg-white shadow-ligh">
          <div className="flex items-center justify-between">
            <button className="relative group" onClick={() => setOpenNav('sidebar')}>
              <div className="relative flex overflow-hidden items-center justify-center rounded-full w-[45px] h-[45px] transform transition-all ring-0 hover:ring-8 group-focus:ring-4 ring-opacity-60 ring-primary-main duration-200">
                <div className="flex flex-col justify-between w-[24px] h-[18px] transform transition-all duration-300 origin-center overflow-hidden">
                  <div className="bg-primary-main h-[2px] w-7 transform transition-all duration-300 origin-left group-focus:translate-x-10" />
                  <div className="bg-primary-main h-[2px] w-7 rounded transform transition-all duration-300 group-focus:translate-x-10 delay-75" />
                  <div className="bg-primary-main h-[2px] w-7 transform transition-all duration-300 origin-left group-focus:translate-x-10 delay-150" />
                  <div className="absolute items-center justify-between transform transition-all duration-500 top-2.5 -translate-x-10 group-focus:translate-x-0 flex w-0 group-focus:w-12">
                    <div className="absolute bg-primary-main h-[2px] w-5 transform transition-all duration-500 rotate-0 delay-300 group-focus:rotate-45" />
                    <div className="absolute bg-primary-main h-[2px] w-5 transform transition-all duration-500 -rotate-0 delay-300 group-focus:-rotate-45" />
                  </div>
                </div>
              </div>
            </button>
            <div className="flex items-center justify-center flex-grow gap-2">
              <Link href={home_routes.summary}>
                <LogoDeScier data-name="logo_deScier" id="logo_deScier" className="w-9 h-9" />
              </Link>
              <p className="text-neutral-gray mb-1">Dashboard</p>
            </div>
            <Person
              className="w-[45px] h-[45px] fill-[#644E94] cursor-pointer ring-0 hover:ring-8 group-focus:ring-4 ring-opacity-60 ring-primary-main duration-200 rounded-full p-2"
              onClick={() => {
                setOpenNav('profile');
              }}
            />
          </div>
        </div>
      </aside>
      <Drawer.Root open={openNav === 'sidebar'}>
        <Drawer.Overlay />
        <Drawer.Content position={'left'} className={twMerge('p-6')}>
          <MobileSidebarComponent
            onClose={(value) => {
              setOpenNav(false);
              setTimeout(() => {
                value === article_key && setPurchased(true);
              }, 500);
            }}
          />
        </Drawer.Content>
      </Drawer.Root>
      <Drawer.Root open={openNav === 'profile'}>
        <Drawer.Overlay />
        <Drawer.Content position={'right'} className={twMerge('p-6')}>
          <MobileProfileComponent onClose={() => setOpenNav(false)} />
        </Drawer.Content>
      </Drawer.Root>
    </React.Fragment>
  );
}

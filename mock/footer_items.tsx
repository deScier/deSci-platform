import { home_routes } from '@/routes/home';
import { uniqueId } from 'lodash';
import InstagramIcon from 'public/svgs/common/footer/icons-footer/instagram.svg';
import LinkdlIcon from 'public/svgs/common/footer/icons-footer/linkdl.svg';
import XIcon from 'public/svgs/common/footer/icons-footer/x.svg';
import YoutubeIcon from 'public/svgs/common/footer/icons-footer/youtube.svg';

export const social_media = [
  {
    id: 1,
    name: '/desciers',
    icon: <XIcon className="w-5 h-5" />,
    link: 'https://twitter.com/desciers',
  },
  {
    id: 2,
    name: '/descier',
    icon: <LinkdlIcon className="w-5 h-5" />,
    link: 'https://www.linkedin.com/company/descier',
  },
  {
    id: 3,
    name: '/descier.science',
    icon: <InstagramIcon className="w-5 h-5" />,
    link: 'https://instagram.com/descier.science',
  },
  {
    id: 4,
    name: '/@desciers',
    icon: <YoutubeIcon className="w-5 h-5" />,
    link: 'https://www.youtube.com/@desciers',
  },
];

export const links = [
  {
    id: uniqueId(),
    name: 'Home',
    link: home_routes.home.index,
  },
  {
    id: uniqueId(),
    name: 'Instructions',
    link: 'https://descier-1.gitbook.io/the-desci-journal-handbook/',
  },
  {
    id: uniqueId(),
    name: 'Onboard Discord',
    link: 'https://discord.com/invite/Z6U9P28YtV',
  },
  {
    id: uniqueId(),
    name: 'Join the community',
    link: 'https://t.me/desciers',
  },
  {
    id: uniqueId(),
    name: 'Privacy Policy',
    link: 'https://descier.science/policy/',
  },
  {
    id: uniqueId(),
    name: 'Terms',
    link: 'https://descier.science/terms/',
  },
];

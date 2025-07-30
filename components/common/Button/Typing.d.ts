import { VariantProps } from 'tailwind-variants';
import { buttonVariants } from './Button';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  variant?: 'primary' | 'outline' | 'disabled';
  loading?: boolean;
  icon?: React.ReactNode;
  asChild?: boolean;
}

interface LinkProps {
  href: string;
  children: React.ReactNode;
}

interface BackProps {
  text?: string;
}

export { BackProps, ButtonProps, LinkProps };

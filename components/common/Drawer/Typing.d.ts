interface DrawerContentProps {
  className?: string;
  children?: React.ReactNode;
  position?: 'left' | 'right';
}

interface DrawerRootProps {
  className?: string;
  children?: React.ReactNode;
  open?: boolean;
}

interface DrawerOverlayProps {
  className?: string;
  checked?: boolean;
}

export { DrawerContentProps, DrawerOverlayProps, DrawerRootProps };

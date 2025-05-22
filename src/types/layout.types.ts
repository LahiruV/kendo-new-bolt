import { ReactNode } from 'react';

export interface LayoutProps {
  children?: ReactNode;
}

export interface DrawerItem {
  text: string;
  icon: ReactNode;
  route: string;
  selected?: boolean;
}
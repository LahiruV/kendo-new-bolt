import { ReactNode } from 'react';
import { Button, ButtonProps } from '@progress/kendo-react-buttons';

interface AppButtonProps extends ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'small' | 'medium' | 'large';
}

const AppButton = ({
  children,
  variant = 'primary',
  size = 'medium',
  ...props
}: AppButtonProps) => {
  const getThemeColor = () => {
    switch (variant) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'secondary';
      case 'success':
        return 'success';
      case 'danger':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'primary';
    }
  };

  const getSize = () => {
    switch (size) {
      case 'small':
        return 'small';
      case 'medium':
        return 'medium';
      case 'large':
        return 'large';
      default:
        return 'medium';
    }
  };

  return (
    <Button
      themeColor={getThemeColor()}
      size={getSize()}
      className="transition-all duration-200 ease-in-out"
      {...props}
    >
      {children}
    </Button>
  );
};

export default AppButton;
import React from 'react';
import { Button, ButtonProps } from '@progress/kendo-react-buttons';

interface KendoButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const KendoButton: React.FC<KendoButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'k-button-primary';
      case 'secondary':
        return 'k-button-secondary';
      case 'accent':
        return 'k-button-accent';
      case 'success':
        return 'bg-success-500 text-white hover:bg-success-600 active:bg-success-700';
      case 'warning':
        return 'bg-warning-500 text-white hover:bg-warning-600 active:bg-warning-700';
      case 'danger':
        return 'bg-error-500 text-white hover:bg-error-600 active:bg-error-700';
      case 'outline':
        return 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50 active:bg-neutral-100';
      default:
        return 'k-button-primary';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'k-button-sm';
      case 'md':
        return 'k-button-md';
      case 'lg':
        return 'k-button-lg';
      default:
        return 'k-button-md';
    }
  };

  return (
    <Button
      className={`${getVariantClasses()} ${getSizeClasses()} ${className}`}
      themeColor="none"
      {...props}
    >
      {children}
    </Button>
  );
};

export default KendoButton;
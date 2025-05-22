import React from 'react';
import { DropDownList, DropDownListProps } from '@progress/kendo-react-dropdowns';

interface KendoDropDownProps<TValue> extends Omit<DropDownListProps, 'data'> {
  data: Array<TValue>;
  textField: keyof TValue;
  valueField: keyof TValue;
  label?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function KendoDropDown<TValue>({
  data,
  textField,
  valueField,
  label,
  error,
  size = 'md',
  className = '',
  ...props
}: KendoDropDownProps<TValue>) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'k-input-sm';
      case 'md':
        return 'k-input-md';
      case 'lg':
        return 'k-input-lg';
      default:
        return 'k-input-md';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          {label}
        </label>
      )}
      <DropDownList
        data={data}
        textField={textField as string}
        dataItemKey={valueField as string}
        className={`w-full ${getSizeClasses()} ${error ? 'k-invalid' : ''}`}
        popupSettings={{ className: 'k-animation-container' }}
        {...props}
      />
      {error && (
        <div className="mt-1 text-sm text-error-500">{error}</div>
      )}
    </div>
  );
}

export default KendoDropDown;
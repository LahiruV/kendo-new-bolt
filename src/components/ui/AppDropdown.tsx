import { DropDownList, DropDownListProps } from '@progress/kendo-react-dropdowns';
import { Label, Error, Hint } from '@progress/kendo-react-labels';

interface AppDropdownProps extends DropDownListProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

const AppDropdown = ({
  label,
  error,
  hint,
  required = false,
  ...props
}: AppDropdownProps) => {
  const id = props.id || `dropdown-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="mb-4">
      {label && (
        <Label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <DropDownList
        id={id}
        className={`w-full ${error ? 'k-invalid' : ''}`}
        {...props}
      />
      {error && <Error>{error}</Error>}
      {hint && <Hint>{hint}</Hint>}
    </div>
  );
};

export default AppDropdown;
import { DatePicker, DatePickerProps } from '@progress/kendo-react-dateinputs';
import { Label, Error, Hint } from '@progress/kendo-react-labels';

interface AppDatePickerProps extends DatePickerProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

const AppDatePicker = ({
  label,
  error,
  hint,
  required = false,
  ...props
}: AppDatePickerProps) => {
  const id = props.id || `datepicker-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="mb-4">
      {label && (
        <Label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <DatePicker
        id={id}
        className={`w-full ${error ? 'k-invalid' : ''}`}
        format="MMMM dd, yyyy"
        {...props}
      />
      {error && <Error>{error}</Error>}
      {hint && <Hint>{hint}</Hint>}
    </div>
  );
};

export default AppDatePicker;
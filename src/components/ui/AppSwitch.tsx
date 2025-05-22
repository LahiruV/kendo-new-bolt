import { Switch, SwitchProps } from '@progress/kendo-react-inputs';
import { Label, Error, Hint } from '@progress/kendo-react-labels';

interface AppSwitchProps extends SwitchProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

const AppSwitch = ({
  label,
  error,
  hint,
  required = false,
  ...props
}: AppSwitchProps) => {
  const id = props.id || `switch-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="mb-4">
      <div className="flex items-center">
        <Switch
          id={id}
          className={error ? 'k-invalid' : ''}
          {...props}
        />
        {label && (
          <Label htmlFor={id} className="ml-2 text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
        )}
      </div>
      {error && <Error>{error}</Error>}
      {hint && <Hint>{hint}</Hint>}
    </div>
  );
};

export default AppSwitch;
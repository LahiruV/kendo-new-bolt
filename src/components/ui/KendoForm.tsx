import React from 'react';
import { Form, Field, FormElement, FormRenderProps } from '@progress/kendo-react-form';
import { Input } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { NumericTextBox } from '@progress/kendo-react-inputs';
import { Error } from '@progress/kendo-react-labels';
import { z } from 'zod';

interface KendoFormProps {
  initialValues: any;
  onSubmit: (values: any) => void;
  validationSchema?: z.ZodType<any>;
  children: (formRenderProps: FormRenderProps) => React.ReactNode;
  className?: string;
}

const KendoForm: React.FC<KendoFormProps> = ({
  initialValues,
  onSubmit,
  validationSchema,
  children,
  className = '',
}) => {
  const validateForm = (values: any) => {
    if (!validationSchema) return {};
    
    try {
      validationSchema.parse(values);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors.reduce((acc, curr) => {
          const path = curr.path.join('.');
          return { ...acc, [path]: curr.message };
        }, {});
      }
      return {};
    }
  };

  return (
    <Form
      initialValues={initialValues}
      onSubmit={onSubmit}
      validator={validateForm}
      render={(formRenderProps) => (
        <FormElement className={className}>
          {children(formRenderProps)}
        </FormElement>
      )}
    />
  );
};

// Form field components with styling
export const FormInput = (fieldRenderProps: any) => {
  const { validationMessage, visited, label, id, ...others } = fieldRenderProps;
  const showValidationMessage = visited && validationMessage;
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-neutral-700 mb-1" htmlFor={id}>
        {label}
      </label>
      <Input
        id={id}
        className={`w-full ${showValidationMessage ? 'k-invalid' : ''}`}
        {...others}
      />
      {showValidationMessage && (
        <Error className="text-error-500 text-sm mt-1">{validationMessage}</Error>
      )}
    </div>
  );
};

export const FormDropDown = (fieldRenderProps: any) => {
  const { validationMessage, visited, label, id, data, textField, ...others } = fieldRenderProps;
  const showValidationMessage = visited && validationMessage;
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-neutral-700 mb-1" htmlFor={id}>
        {label}
      </label>
      <DropDownList
        id={id}
        data={data}
        textField={textField}
        className={`w-full ${showValidationMessage ? 'k-invalid' : ''}`}
        {...others}
      />
      {showValidationMessage && (
        <Error className="text-error-500 text-sm mt-1">{validationMessage}</Error>
      )}
    </div>
  );
};

export const FormNumericTextBox = (fieldRenderProps: any) => {
  const { validationMessage, visited, label, id, ...others } = fieldRenderProps;
  const showValidationMessage = visited && validationMessage;
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-neutral-700 mb-1" htmlFor={id}>
        {label}
      </label>
      <NumericTextBox
        id={id}
        className={`w-full ${showValidationMessage ? 'k-invalid' : ''}`}
        {...others}
      />
      {showValidationMessage && (
        <Error className="text-error-500 text-sm mt-1">{validationMessage}</Error>
      )}
    </div>
  );
};

export const FormDatePicker = (fieldRenderProps: any) => {
  const { validationMessage, visited, label, id, ...others } = fieldRenderProps;
  const showValidationMessage = visited && validationMessage;
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-neutral-700 mb-1" htmlFor={id}>
        {label}
      </label>
      <DatePicker
        id={id}
        className={`w-full ${showValidationMessage ? 'k-invalid' : ''}`}
        {...others}
      />
      {showValidationMessage && (
        <Error className="text-error-500 text-sm mt-1">{validationMessage}</Error>
      )}
    </div>
  );
};

export const FormCheckbox = (fieldRenderProps: any) => {
  const { validationMessage, visited, label, id, ...others } = fieldRenderProps;
  const showValidationMessage = visited && validationMessage;
  
  return (
    <div className="mb-4 flex items-center">
      <input
        id={id}
        type="checkbox"
        className={`h-4 w-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 ${
          showValidationMessage ? 'border-error-500' : ''
        }`}
        {...others}
      />
      <label className="ml-2 block text-sm text-neutral-700" htmlFor={id}>
        {label}
      </label>
      {showValidationMessage && (
        <Error className="text-error-500 text-sm ml-2">{validationMessage}</Error>
      )}
    </div>
  );
};

export default KendoForm;
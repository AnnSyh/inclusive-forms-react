import React from 'react';
import FormField from '../FormField/FormField';
import './DynamicForm.css';

const DynamicForm = ({
  formFields,
  form,
  onFieldChange,
  onSpeakField,
  onAutoSpeakField,
  onSpeakSelectedOption,
  optionLabels
}) => {
  if (!formFields || formFields.length === 0) {
    return <p className="no-data">Нет данных для отображения формы</p>;
  }

  return formFields.map((field) => (
    <FormField
      key={field.text || field.id}
      field={field}
      value={form[field.text]}
      onChange={onFieldChange}
      onSpeakField={onSpeakField}
      onAutoSpeakField={onAutoSpeakField}
      onSpeakSelectedOption={onSpeakSelectedOption}
      optionLabels={optionLabels}
    />
  ));
};

export default DynamicForm;
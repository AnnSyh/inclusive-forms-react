import React from 'react';
import './FormField.css';

const FormField = ({
  field,
  value,
  onChange,
  onSpeakField,
  onAutoSpeakField,
  onSpeakSelectedOption,
  optionLabels
}) => {
  const commonProps = {
    id: field.text,
    value: value || '',
    onChange: (e) => onChange(field.text, e.target.value),
    required: field.required || false,
    onFocus: () => onAutoSpeakField(field.label || field.text),
    placeholder: field.hint || '',
    'aria-describedby': field.help_text ? `${field.text}-help` : undefined,
  };

  const renderSelectOptions = () => {
    if (!field.options_list) return null;

    return field.options_list?.map((option, index) => (
      <option key={index} value={option}>
        {option}
      </option>
    ));
  };

  const renderFieldByType = () => {
    switch (field.q_type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={field.rows || 3}
            className="form-textarea"
          />
        );

      case 'select':
        return (
          <select
            {...commonProps}
            className="form-select"
            onChange={(e) => {
              onChange(field.text, e.target.value);
              if (optionLabels[field.text]) {
                onSpeakSelectedOption(field.text, e.target.value);
              }
            }}
          >
            <option value="">{field.hint || 'Выберите вариант'}</option>
            {renderSelectOptions()}
          </select>
        );

      case 'checkbox':
        return (
          <input
            type="checkbox"
            {...commonProps}
            checked={!!value}
            onChange={(e) => onChange(field.text, e.target.checked)}
            className="form-checkbox"
          />
        );

      case 'date':
        return (
          <input
            type="date"
            {...commonProps}
            className="form-input"
          />
        );

      case 'email':
        return (
          <input
            type="email"
            {...commonProps}
            className="form-input"
          />
        );

      case 'tel':
        return (
          <input
            type="tel"
            {...commonProps}
            pattern={field.pattern}
            className="form-input"
          />
        );

      case 'url':
        return (
          <input
            type="url"
            {...commonProps}
            className="form-input"
          />
        );

      default:
        return (
          <input
            type="text"
            {...commonProps}
            className="form-input"
          />
        );
    }
  };

  return (
    <div className="form-group">
      <label 
        htmlFor={field.text}
        onMouseEnter={() => onSpeakField(field.label || field.text)}
        className="form-label"
      >
        {field.label || field.text}
        {field.required && <span className="required-star"> *</span>}
      </label>
      
      {renderFieldByType()}
      
      {field.help_text && (
        <div 
          id={`${field.text}-help`} 
          className="help-text"
        >
          {field.help_text}
        </div>
      )}
    </div>
  );
};

export default FormField;
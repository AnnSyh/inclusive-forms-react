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

  // Определяем дополнительные классы
  const getFormGroupClassName = () => {
    let className = "form-group";
    
    if (field.q_type === 'checkbox') {
      className += " form-group--checkbox";
    }
    if (field.q_type === 'select') {
      className += " form-group--select";
    }
    
    return className;
  };



  // Функция для озвучки поля при фокусе с информацией о списке
  const handleFieldFocus = () => {
    const fieldName = field.label || field.text;
    const placeholder = field.hint || '';
    const currentValue = getCurrentValueText();
    const optionsText = field.options_list.join(', ');
    const optionsCount = field.options_list?.length || 0;
    
    let textToSpeak = fieldName;

    if (field.q_type === 'select') {
      textToSpeak += `. Выпадающий список.`;
    }

    if (currentValue) {
      textToSpeak += `. Текущее значение: ${currentValue}`;
    }
    
    if (placeholder) {
      textToSpeak += `. Подсказка: ${placeholder}`;
    }

    textToSpeak += `.${optionsCount} всего вариантов. ${optionsText} `;
    

    onAutoSpeakField(textToSpeak);
  };

  // Функция для получения текстового представления текущего значения
  const getCurrentValueText = () => {
    if (!value) return '';

    switch (field.q_type) {
      case 'select':
        const selectedOption = field.options_list?.find(opt => opt === value);
        return selectedOption || value;
      
      case 'checkbox':
        return value ? 'Отмечено' : 'Не отмечено';
      
      case 'date':
        if (value) {
          const date = new Date(value);
          return date.toLocaleDateString('ru-RU');
        }
        return '';
      
      default:
        return value.toString();
    }
  };

  // Функция для озвучки при наведении на label
  const handleLabelHover = () => {
    const fieldName = field.label || field.text;
    const placeholder = field.hint || '';
    const currentValue = getCurrentValueText();
    
    let textToSpeak = fieldName;
    
    if (field.q_type === 'select') {
      textToSpeak += '. Выпадающий список';
    }
    
    if (placeholder) {
      textToSpeak += `. ${placeholder}`;
    }
    
    if (currentValue) {
      textToSpeak += `. Значение: ${currentValue}`;
    }

    onAutoSpeakField(textToSpeak, field.q_type);
  };

  // Функция для озвучки при наведении на сам select
  const handleSelectHover = () => {
    if (field.q_type === 'select' && field.options_list) {
      const fieldName = field.label || field.text;
      const currentValue = getCurrentValueText();
      const optionsCount = field.options_list.length;
    //   const optionsText = field.options_list.join(', ');
      
      let textToSpeak = `${fieldName}. Выпадающий список. Всего ${optionsCount} вариантов.`;

      if (currentValue) {
        // Если значение выбрано - говорим что выбрано
        textToSpeak += `. Выбрано: ${currentValue}`;
      } else {
         textToSpeak += `.Не выбрано`;
      }
      
      onAutoSpeakField(textToSpeak);
    }
  };

  const commonProps = {
    id: field.text,
    value: value || '',
    onChange: (e) => {
      onChange(field.text, e.target.value);
    },
    required: field.required || false,
    onFocus: handleFieldFocus,
    placeholder: field.hint || '',
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
              // Озвучиваем выбранное значение
              const selectedOption = field.options_list?.find(opt => opt === e.target.value);
              if (selectedOption) {
                onSpeakSelectedOption(selectedOption);
              }
            }}
            onKeyDown={(e) => {
              // Озвучка при навигации стрелками
              if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                setTimeout(() => {
                  const selectedOption = e.target.options[e.target.selectedIndex]?.text;
                  if (selectedOption && selectedOption !== '') {
                    onAutoSpeakField(selectedOption);
                  }
                }, 100);
              }
            }}
            onMouseEnter={handleSelectHover} // Используем отдельную функцию для наведения на select
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
            onChange={(e) => {
              onChange(field.text, e.target.checked);
              const stateText = e.target.checked ? 'Отмечено' : 'Снято';
              onAutoSpeakField(stateText);
            }}
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
    <div className={getFormGroupClassName()}>
      <label 
        htmlFor={field.text}
        onMouseEnter={handleLabelHover}
        className="form-label"
      >
        {field.label || field.text}
        {field.required && <span className="required-star"> *</span>}
        
      </label>
      
      <div className="input">
        {renderFieldByType()}
      </div>
    </div>
  );
};

export default FormField;
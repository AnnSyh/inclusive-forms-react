import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { useFetch } from './hooks/useFetch';

function App() {
  // Состояние формы будет динамически инициализировано
  const [form, setForm] = useState({});
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeakFields, setAutoSpeakFields] = useState(true);
  const [currentField, setCurrentField] = useState('');
  const speechSynth = useRef(null);

  // Получаем данные формы с API
  const { isLoading, data: formFields, error } = useFetch('/api/form/1/questions/');

  // Словари для озвучки выбранных значений
  const optionLabels = {
    disabilityGroup: {
      '': 'Не выбрано',
      '1': 'Первая группа инвалидности',
      '2': 'Вторая группа инвалидности',
      '3': 'Третья группа инвалидности',
      'child': 'Ребенок инвалид',
      'none': 'Нет инвалидности'
    },
    disabilityForm: {
      '': 'Не выбрано',
      'vision': 'Нарушение зрения',
      'hearing': 'Нарушение слуха',
      'mobility': 'Нарушение опорно-двигательного аппарата',
      'intellectual': 'Интеллектуальные нарушения',
      'mental': 'Психические нарушения',
      'multiple': 'Множественные нарушения'
    },
    education: {
      '': 'Не выбрано',
      'secondary': 'Среднее образование',
      'secondary-special': 'Среднее специальное образование',
      'incomplete-higher': 'Неоконченное высшее образование',
      'higher': 'Высшее образование',
      'bachelor': 'Бакалавр',
      'master': 'Магистр',
      'phd': 'Кандидат наук',
      'doctor': 'Доктор наук'
    }
  };

  // Инициализация формы при загрузке данных
  useEffect(() => {
    if (formFields && formFields.length > 0) {
      const initialForm = {};
      formFields.forEach(field => {
        // Устанавливаем значение по умолчанию или пустую строку
        initialForm[field.text] = field.default_value || '';
      });
      // Добавляем поле согласия отдельно
      initialForm.consent = false;
      setForm(initialForm);
    }
  }, [formFields]);

  // Инициализация синтеза речи
  useEffect(() => {
    speechSynth.current = window.speechSynthesis;

    if (!speechSynth.current) {
      console.warn('Web Speech API не поддерживается в этом браузере');
      alert('Ваш браузер не поддерживает озвучку текста. Рекомендуем использовать Chrome или Edge.');
    }

    return () => {
      stopSpeech();
    };
  }, []);

  // Обработчик изменения полей формы
  const handleInputChange = (fieldName, value) => {
    setForm(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Озвучка текста
  const speakText = (text) => {
    if (!speechSynth.current || isSpeaking) return;

    stopSpeech();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    speechSynth.current.speak(utterance);
  };

  // Озвучка поля
  const speakField = (fieldName) => {
    setCurrentField(fieldName);
    speakText(`Поле: ${fieldName}. Используйте стрелки вверх и вниз для выбора варианта.`);
  };

  // Автоозвучка при фокусе
  const autoSpeakField = (fieldName) => {
    if (autoSpeakFields) {
      speakField(fieldName);
    }
  };

  // Остановка озвучки
  const stopSpeech = () => {
    if (speechSynth.current) {
      speechSynth.current.cancel();
    }
    setIsSpeaking(false);
  };

  const speakCurrentField = () => {
    if (currentField) {
      speakField(currentField);
    }
  };

  const speakAllForm = () => {
    if (!formFields || formFields.length === 0) return;
    
    const fieldsDescription = formFields
      .map(field => field.label || field.text)
      .join(', ');
    
    const formDescription = `Добро пожаловать в анкету доступности. 
      Форма содержит следующие поля: ${fieldsDescription}.
      Обязательные поля помечены звездочкой. Используйте Tab для навигации.`;
    
    speakText(formDescription);
  };

  // Озвучка выбранного значения
  const speakSelectedOption = (fieldName, value) => {
    const label = optionLabels[fieldName]?.[value] || value;
    speakText(`Выбрано: ${label}`);
  };

  // Отправка формы
  const submitForm = (e) => {
    e.preventDefault();
    
    if (!form.consent) {
      alert('Необходимо принять условия обработки персональных данных');
      speakText('Необходимо принять условия обработки персональных данных');
      return;
    }

    console.log('Данные формы:', form);
    speakText('Форма успешно отправлена! Спасибо за вашу заявку.');
    
    // Здесь можно добавить отправку данных на сервер
    // await submitFormToServer(form);
  };

  // Сброс формы
  const resetForm = () => {
    if (confirm('Вы уверены, что хотите очистить все поля?')) {
      const emptyForm = {};
      if (formFields && formFields.length > 0) {
        formFields.forEach(field => {
          emptyForm[field.text] = field.default_value || '';
        });
      }
      emptyForm.consent = false;
      
      setForm(emptyForm);
      speakText('Форма очищена. Все поля сброшены.');
    }
  };

  // Функция для рендеринга поля по типу
  const renderFieldByType = (field) => {
    const commonProps = {
      id: field.text,
      value: form[field.text] || '',
      onChange: (e) => handleInputChange(field.text, e.target.value),
      required: field.required || false,
      onFocus: () => autoSpeakField(field.label || field.text),
      placeholder: field.hint || '',
      'aria-describedby': field.help_text ? `${field.text}-help` : undefined,
    };

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
        //   console.log('🔍 Select field data:', field);
        //     console.log('📋 Options list:', field.options_list);
        //     console.log('📋 Options list type:', typeof field.options_list);

        return (
          <select
            {...commonProps}
            className="form-select"
            onChange={(e) => {
              handleInputChange(field.text, e.target.value);
              // Озвучка для select полей
              if (optionLabels[field.text]) {
                speakSelectedOption(field.text, e.target.value);
              }
            }}
          >

            <pre>{JSON.stringify(field.options_list, null, 2)}</pre>

            <option value="">{field.hint || 'Выберите вариант'}</option>
            {field.options_list?.map((option, index) => (
              <option 
                    key={index} 
                    value={ option}
              >
                { option}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <input
            type="checkbox"
            {...commonProps}
            checked={!!form[field.text]}
            onChange={(e) => handleInputChange(field.text, e.target.checked)}
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

// Функция для рендеринга динамической формы БЕЗ группировки
  const renderDynamicForm = () => {
    if (!formFields || formFields.length === 0) {
      return <p className="no-data">Нет данных для отображения формы</p>;
    }

    // Рендерим все поля последовательно без группировки по секциям
    return formFields.map((field) => (
      <div key={field.text || field.id} className="form-group">
        <label 
          htmlFor={field.text}
          onMouseEnter={() => speakField(field.label || field.text)}
          className="form-label"
        >
          {field.label || field.text}
          {field.required && <span className="required-star"> *</span>}
        </label>
        
        {renderFieldByType(field)}
        
        {field.help_text && (
          <div 
            id={`${field.text}-help`} 
            className="help-text"
          >
            {field.help_text}
          </div>
        )}
      </div>
    ));
  };

  // Состояния загрузки и ошибки
  if (isLoading) {
    return (
      <div className="container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Загрузка формы...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-state">
          <h2>Ошибка загрузки формы</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="retry-btn"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Кнопки управления озвучкой */}
      <div className="voice-controls-wrap">
        <div className="voice-controls">
            <button 
            onClick={speakAllForm} 
            className="voice-btn" 
            disabled={isSpeaking}
            >
            Озвучить всю форму
            </button>
            <button 
            onClick={stopSpeech} 
            className="voice-btn stop" 
            disabled={!isSpeaking}
            >
            Стоп
            </button>
            <button 
            onClick={speakCurrentField} 
            className="voice-btn" 
            disabled={!currentField}
            >
            Повтор поля
            </button>
        </div>
        <label className="voice-toggle">
          <input 
            type="checkbox" 
            checked={autoSpeakFields}
            onChange={(e) => setAutoSpeakFields(e.target.checked)}
          />
          Автоозвучка при наведении
        </label>
      </div>

      <form onSubmit={submitForm} className="accessibility-form">
        <h1>Заявка на содействие в трудоустройстве</h1>

        {/* Динамическая форма на основе данных API БЕЗ группировки */}
        {renderDynamicForm()}

        {/* Согласие на обработку данных */}
        {/* <div className="form-group consent">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={form.consent || false}
              onChange={(e) => handleInputChange('consent', e.target.checked)}
              required
              onFocus={() => autoSpeakField('Принимаю условия обработки персональных данных')}
              className="consent-checkbox"
            />
            <span 
              onMouseEnter={() => speakField('Принимаю условия обработки персональных данных')}
              className="consent-text"
            >
              * Принимаю условия обработки персональных данных
            </span>
          </label>
        </div> */}

        {/* Кнопки отправки */}
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={!form.consent} 
            onMouseOver={() => speakField('кнопка Отправить анкету')}
          >
            Отправить анкету
          </button>
          <button 
            type="button" 
            onClick={resetForm} 
            className="reset-btn"
            onMouseOver={() => speakField('кнопка Очистить форму')}
          >
            Очистить форму
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
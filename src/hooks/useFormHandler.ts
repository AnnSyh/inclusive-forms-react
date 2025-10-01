import { useState, useEffect } from 'react';

interface FormFieldData {
  text: string;
}

type FormState = Record<string, string | boolean>;

interface UseFormHandlerReturn {
  form: FormState;
  handleInputChange: (fieldName: string, value: string | boolean) => void;
  submitForm: (e: React.FormEvent<HTMLFormElement>) => void;
  resetForm: () => void;
}

export function useFormHandler(
  formFields: FormFieldData[] | undefined,
  onSubmit: (formData: FormState) => void 
): UseFormHandlerReturn {
  const [form, setForm] = useState<FormState>({});

  // Инициализация формы при загрузке данных
  useEffect(() => {
    if (formFields && formFields.length > 0) {
      const initialForm = {} as FormState;
      formFields.forEach(field => {
        // Устанавливаем значение по умолчанию или пустую строку
        initialForm[field.text] = '';
      });
      // Добавляем поле согласия отдельно
      initialForm.consent = false;
      setForm(initialForm);
    }
  }, [formFields]);


  // Обработчик изменения полей формы
  const handleInputChange = (fieldName: string, value: string | boolean) => {
    setForm(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    
    if (!form.consent) {
      alert('Необходимо принять условия обработки персональных данных');
      return;
    }

    console.log('Данные формы:', form);
    
    onSubmit(form); 
  };

  // Сброс формы
  const resetForm = () => {
    if (formFields) {
      const emptyForm = {} as FormState;
      if (formFields && formFields.length > 0) {
        formFields.forEach(field => {
          emptyForm[field.text] = '';
        });
      }
      emptyForm.consent = false;
      
      setForm(emptyForm);
    }
  };

  return {
    form,
    handleInputChange,
    submitForm,
    resetForm,
  };
}
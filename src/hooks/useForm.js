import { useState, useEffect } from 'react';

export const useForm = (formFields) => {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (formFields && formFields.length > 0) {
      const initialForm = {};
      formFields.forEach(field => {
        initialForm[field.text] = field.default_value || '';
      });
      initialForm.consent = false;
      setForm(initialForm);
    }
  }, [formFields]);

  const handleInputChange = (fieldName, value) => {
    setForm(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const resetForm = (formFields) => {
    const emptyForm = {};
    if (formFields && formFields.length > 0) {
      formFields.forEach(field => {
        emptyForm[field.text] = field.default_value || '';
      });
    }
    emptyForm.consent = false;
    setForm(emptyForm);
  };

  return {
    form,
    handleInputChange,
    resetForm,
    setForm
  };
};
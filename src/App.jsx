import React, { useState, useEffect } from "react";
import "./App.css";
import { useFetch } from "./hooks/useFetch";
import { useSpeech } from "./hooks/useSpeech";
import { useForm } from "./hooks/useForm";
import VoiceControls from "./components/VoiceControls/VoiceControls";
import DynamicForm from "./components/DynamicForm/DynamicForm.jsx";
import FormActions from "./components/FormActions/FormActions";

function App() {
  const [autoSpeakFields, setAutoSpeakFields] = useState(true);

  const {
    isLoading,
    data: formFields,
    error,
  } = useFetch("/api/form/1/questions/");
  const { form, handleInputChange, resetForm } = useForm(formFields);

  const {
    isSpeaking,
    currentField,
    speakText,
    speakField,
    speakCurrentField,
    speakAllForm,
    stopSpeech,
    initializeSpeech,
  } = useSpeech();

  // Инициализация синтеза речи
  useEffect(() => {
    initializeSpeech();
  }, [initializeSpeech]);

  const autoSpeakField = (fieldName, qType) => {
    if (autoSpeakFields) {
      if (qType === "select") {
        speakText(
          `${fieldName} Используйте стрелки вверх и вниз для выбора варианта.`
        );
      } else {
        speakField(fieldName);
      }
    }
  };

  const speakSelectedOption = (value) => {
    const label = value;
    speakText(`Выбрано: ${label}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Данные формы:", form);
    speakText("Форма успешно отправлена! Спасибо за вашу заявку.");
  };

  const handleReset = () => {
    if (confirm("Вы уверены, что хотите очистить все поля?")) {
      resetForm(formFields);
      speakText("Форма очищена. Все поля сброшены.");
    }
  };

  const handleSpeakAllForm = () => {
    speakAllForm(formFields);
  };

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
      <VoiceControls
        isSpeaking={isSpeaking}
        currentField={currentField}
        onSpeakAllForm={handleSpeakAllForm}
        onStopSpeech={stopSpeech}
        onSpeakCurrentField={speakCurrentField}
        autoSpeakFields={autoSpeakFields}
        onAutoSpeakFieldsChange={(e) => setAutoSpeakFields(e.target.checked)}
      />

      <form onSubmit={handleSubmit} className="accessibility-form">
        <h1>Заявка на содействие в трудоустройстве</h1>

        <DynamicForm
          formFields={formFields}
          form={form}
          onFieldChange={handleInputChange}
          onSpeakField={speakField}
          onAutoSpeakField={autoSpeakField}
          onSpeakSelectedOption={speakSelectedOption}
        />

        <FormActions
          onSubmit={handleSubmit}
          onReset={handleReset}
          consent={form.consent}
          onSpeakField={speakField}
        />
      </form>
    </div>
  );
}

export default App;

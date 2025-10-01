import { useState, useEffect, useRef } from "react";

interface FormField {
  text: string;
  label?: string;
}

type OptionLabels = Record<string, Record<string, string>>;

interface UseSpeechReturn {
  isSpeaking: boolean;
  autoSpeakFields: boolean;
  setAutoSpeakFields: (value: boolean) => void;
  currentField: string;
  speakText: (text: string) => void;
  stopSpeech: () => void;
  speakField: (fieldName: string) => void;
  autoSpeakField: (fieldName: string) => void;
  speakCurrentField: () => void;
  speakAllForm: () => void;
  speakSelectedOption: (fieldName: string, value: string) => void;
}

export function useSpeech(
  formFields: FormField[] | undefined,
  optionLabels: OptionLabels
): UseSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [autoSpeakFields, setAutoSpeakFields] = useState<boolean>(true);
  const [currentField, setCurrentField] = useState<string>("");

  const speechSynth = useRef<SpeechSynthesis | null>(null);

  // Инициализация синтеза речи
  useEffect(() => {
    speechSynth.current = window.speechSynthesis;

    if (!speechSynth.current) {
      console.warn("Web Speech API не поддерживается в этом браузере");
      alert(
        "Ваш браузер не поддерживает озвучку текста. Рекомендуем использовать Chrome или Edge."
      );
    }

    return () => {
      stopSpeech();
    };
  }, []);

  // Остановка озвучки
  const stopSpeech = () => {
    if (speechSynth.current) {
      speechSynth.current.cancel();
    }
    setIsSpeaking(false);
  };

  // Озвучка текста
  const speakText = (text: string) => {
    if (!speechSynth.current || isSpeaking) return;

    stopSpeech();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ru-RU";
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
  const speakField = (fieldName: string) => {
    setCurrentField(fieldName);
    speakText(
      `Поле: ${fieldName}. Используйте стрелки вверх и вниз для выбора варианта.`
    );
  };

  // Автоозвучка при фокусе
  const autoSpeakField = (fieldName: string) => {
    if (autoSpeakFields) {
      speakField(fieldName);
    }
  };

  const speakCurrentField = () => {
    if (currentField) {
      speakField(currentField);
    }
  };

  const speakAllForm = () => {
    if (!formFields || formFields.length === 0) return;

    const fieldsDescription = formFields
      .map((field) => field.label || field.text)
      .join(", ");

    const formDescription = `Добро пожаловать в анкету доступности. 
      Форма содержит следующие поля: ${fieldsDescription}.
      Обязательные поля помечены звездочкой. Используйте Tab для навигации.`;

    speakText(formDescription);
  };

  // Озвучка выбранного значения
  const speakSelectedOption = (fieldName: string, value: string) => {
    const label = optionLabels[fieldName]?.[value] || value;
    speakText(`Выбрано: ${label}`);
  };

  return {
    isSpeaking,
    autoSpeakFields,
    setAutoSpeakFields,
    currentField,
    speakText,
    stopSpeech,
    speakField,
    autoSpeakField,
    speakCurrentField,
    speakAllForm,
    speakSelectedOption,
  };
}

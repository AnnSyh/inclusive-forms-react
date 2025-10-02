import { useState, useRef, useCallback } from 'react';

export const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const speechSynth = useRef(null);

  const initializeSpeech = useCallback(() => {
    speechSynth.current = window.speechSynthesis;
    
    if (!speechSynth.current) {
      console.warn('Web Speech API не поддерживается в этом браузере');
      alert('Ваш браузер не поддерживает озвучку текста. Рекомендуем использовать Chrome или Edge.');
      return false;
    }
    return true;
  }, []);

  const speakText = useCallback((text) => {
    if (!speechSynth.current || isSpeaking) return;

    stopSpeech();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynth.current.speak(utterance);
  }, [isSpeaking]);

  const stopSpeech = useCallback(() => {
    if (speechSynth.current) {
      speechSynth.current.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const speakField = useCallback((fieldName) => {
    setCurrentField(fieldName);
    // console.log('fieldName = ', fieldName);
    // console.log('q_type = ', q_type);

    speakText(`Поле: ${fieldName}`);

     if (q_type === 'select') {
        speakText(`Используйте стрелки вверх и вниз для выбора варианта.`);
     } 
     

  }, [speakText]);

  const speakCurrentField = useCallback(() => {
    if (currentField) {
      speakField(currentField);
    }
  }, [currentField, speakField]);

  const speakAllForm = useCallback((formFields) => {
    if (!formFields || formFields.length === 0) return;
    
    const fieldsDescription = formFields
      .map(field => field.label || field.text)
      .join(', ');
    
    const formDescription = `Добро пожаловать в анкету доступности. 
      Форма содержит следующие поля: ${fieldsDescription}.
      Обязательные поля помечены звездочкой. Используйте Tab для навигации.`;
    
    speakText(formDescription);
  }, [speakText]);

  return {
    isSpeaking,
    currentField,
    speakText,
    speakField,
    speakCurrentField,
    speakAllForm,
    stopSpeech,
    initializeSpeech
  };
};
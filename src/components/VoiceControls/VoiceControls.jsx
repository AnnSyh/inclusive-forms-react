import React from 'react';
import './VoiceControls.css';

const VoiceControls = ({
  isSpeaking,
  currentField,
  onSpeakAllForm,
  onStopSpeech,
  onSpeakCurrentField,
  autoSpeakFields,
  onAutoSpeakFieldsChange
}) => {
  return (
    <div className="voice-controls-wrap">
      <div className="voice-controls">
        <button 
          onClick={onSpeakAllForm} 
          className="voice-btn" 
          disabled={isSpeaking}
        >
          Озвучить всю форму
        </button>
        <button 
          onClick={onStopSpeech} 
          className="voice-btn stop" 
          disabled={!isSpeaking}
        >
          Стоп
        </button>
        <button 
          onClick={onSpeakCurrentField} 
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
          onChange={onAutoSpeakFieldsChange}
        />
        Автоозвучка при наведении
      </label>
    </div>
  );
};

export default VoiceControls;
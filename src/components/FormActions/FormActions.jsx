import React from 'react';
import './FormActions.css';

const FormActions = ({
  onSubmit,
  onReset,
  consent,
  onSpeakField
}) => {
  return (
    <div className="form-actions">
      <button 
        type="submit" 
        className="submit-btn" 
        disabled={!consent} 
        onMouseOver={() => onSpeakField('кнопка Отправить анкету')}
      >
        Отправить анкету
      </button>
      <button 
        type="button" 
        onClick={onReset} 
        className="reset-btn"
        onMouseOver={() => onSpeakField('кнопка Очистить форму')}
      >
        Очистить форму
      </button>
    </div>
  );
};

export default FormActions;
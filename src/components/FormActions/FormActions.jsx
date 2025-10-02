import React from "react";
import "./FormActions.css";

const FormActions = ({
  onSubmit,
  onReset,
  consent,
  onSpeakField,
  submitStatusData,
}) => {
  return (
    <div>
      <div className="form-actions">
        <button
          type="submit"
          className="submit-btn"
          onMouseOver={() => onSpeakField("кнопка Отправить анкету")}
        >
          Отправить анкету
        </button>
        <button
          type="button"
          onClick={onReset}
          className="reset-btn"
          onMouseOver={() => onSpeakField("кнопка Очистить форму")}
        >
          Очистить форму
        </button>
      </div>
      {submitStatusData.state === "success" && (
        <p style={{ color: "green" }}>{submitStatusData.message}</p>
      )}
      {submitStatusData.state === "error" && (
        <p style={{ color: "red" }}>{submitStatusData.message}</p>
      )}{" "}
    </div>
  );
};

export default FormActions;

const BASE_URL = import.meta.env.VITE_API_URL || 'https://89.169.154.49:8000';

export const postQuestions = async (body) => {
  const response = await fetch(`${BASE_URL}/api/form/1/submit/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw Error("Произошла ошибка при отправке формы");
  }
};

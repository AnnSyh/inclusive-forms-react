import { useEffect, useState } from "react";
import dataForm from "../../data.json";

const BASE_URL = import.meta.env.VITE_API_URL;

export const useFetch = (url) => {
  const [status, setStatus] = useState({
    isLoading: false,
    data: null,
    error: null,
  });

  const getFetch = async () => {
    setStatus({ data: null, error: null, isLoading: true });

    try {
      if (BASE_URL) {
        setStatus((prev) => ({ ...prev, isLoading: true }));
        const response = await fetch(`${BASE_URL}${url}`);
        if (!response.ok) {
          throw new Error(`Ошибка HTTP, статус: ${response.status}`);
        }

        const data = await response.json();
        setStatus({
          data,
          error: null,
          isLoading: false,
        });
      } else {
        const data = dataForm;
        setStatus({
          data,
          error: null,
          isLoading: false,
        });
      }
    } catch (error) {
      setStatus({
        data: null,
        error: `Ошибка при запросе: ${error}`,
        isLoading: false,
      });
    }
  };
  useEffect(() => {
    getFetch(url);
  }, [url]);
  return status;
};

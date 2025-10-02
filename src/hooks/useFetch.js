import { useEffect, useState } from "react";

export const useFetch = (url) => {
  const [status, setStatus] = useState({ isLoading: false, data: null, error: null });

  const getFetch = async () => {
    setStatus({ data: null, error: null, isLoading: true });
    try {
      const response = await fetch(`/api/proxy${url}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setStatus({ data, error: null, isLoading: false });
    } catch (error) {
      setStatus({ data: null, error: `Ошибка при запросе: ${error}`, isLoading: false });
    }
  };

  useEffect(() => { getFetch(); }, [url]);
  return status;
};

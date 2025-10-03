import { useEffect, useState } from "react";
import dataForm from "../../data.json";

const RUNTIME_BASE = import.meta.env.VITE_API_URL || "";

export const useFetch = (path) => {
  const [status, setStatus] = useState({
    isLoading: false,
    data: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setStatus({ data: null, error: null, isLoading: true });

      const isHttpsPage =
        typeof window !== "undefined" && window.location.protocol === "https:";
      const isInsecureBase = RUNTIME_BASE.startsWith("http://");

      try {
        if (!RUNTIME_BASE || (isHttpsPage && isInsecureBase)) {
          if (!cancelled)
            setStatus({ data: dataForm, error: null, isLoading: false });
          return;
        }

        const res = await fetch(`${RUNTIME_BASE}${path}`, {
          headers: { Accept: "application/json" },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setStatus({ data, error: null, isLoading: false });
      } catch (err) {
        if (!cancelled)
          setStatus({ data: dataForm, error: null, isLoading: false });
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [path]);

  return status;
};

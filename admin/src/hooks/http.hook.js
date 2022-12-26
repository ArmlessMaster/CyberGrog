import { useState, useCallback } from "react";

export const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (url, method = "GET", body = null, files = null, headers = {}) => {
      setLoading(true);
      try {
        const formData = new FormData();

        if (body && files) {
          body = JSON.stringify(body);
          formData.append("data", body);

          for (let i = 0; i < files.length; i++) {
            formData.append("pic", files[i]);
          }

          body = formData;
        }

        if (body && !files) {
          body = JSON.stringify(body);
          headers["Content-Type"] = "application/json";
        }

        const response = await fetch(url, {
          method,
          body,
          headers,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }

        setLoading(false);

        return data;
      } catch (e) {
        setLoading(false);
        setError(e.message);
        throw e;
      }
    },
    []
  );

  const clearError = useCallback(() => setError(null), []);
  return { loading, request, error, clearError };
};
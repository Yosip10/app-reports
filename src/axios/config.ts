import type { ApiError } from "@/interfaces";
import axios, { AxiosError } from "axios";

// Crear una instancia centralizada de axios
const axiosConfig = axios.create();

// Interceptor de solicitud para agregar el encabezado de autorización
axiosConfig.interceptors.request.use(
  (config) => {
    try {
      // Obtener el almacenamiento de autenticación de localStorage (Zustand lo persiste ahí)
      const storage = localStorage.getItem("auth-storage");
      if (storage) {
        const { state } = JSON.parse(storage);
        const token = state?.user?.access_token;

        if (token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error("Error retrieving auth token from storage", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor de respuesta para manejar errores globalmente
axiosConfig.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<any>) => {
    const apiError: ApiError = {
      message: "Ha ocurrido un error inesperado",
      originalError: error,
    };

    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      const status = error.response.status;
      const data = error.response.data;

      apiError.statusCode = status;
      apiError.code = data?.code || data?.statusCode;
      apiError.details = data;

      // Asignar mensajes estándar de HTTP a mensajes amigables para el usuario
      const httpMessages: Record<number, string> = {
        400: "Solicitud incorrecta. Por favor, verifica los datos.",
        401: "No autorizado. La sesión expiró.",
        403: "No tienes permiso para realizar esta acción.",
        404: "El recurso solicitado no fue encontrado.",
        409: "El recurso ya existe.",
        500: "Error interno del servidor. Inténtalo más tarde.",
        502: "Puerta de enlace incorrecta.",
        503: "El servicio no está disponible temporalmente.",
        504: "Tiempo de espera agotado.",
      };

      // Prioridad: 1. Mensaje del servidor, 2. Mensaje estándar de HTTP, 3. Mensaje de error predeterminado
      apiError.message =
        data?.message || data?.error || httpMessages[status] || error.message;

      // Manejo especial para códigos de negocio comunes
      if (apiError.code === "TOKEN_EXPIRED" || apiError.code === "40001") {
        apiError.message =
          "Su sesión ha expirado. Por favor, inicie sesión nuevamente.";
      } else if (status === 401) {
        // Si es una solicitud de inicio de sesión, 401 significa credenciales inválidas
        const isLoginRequest = error.config?.url?.includes("/auth/token");
        if (isLoginRequest) {
          apiError.message =
            "Credenciales inválidas. Por favor, verifica tu usuario y contraseña.";
        } else {
          apiError.message =
            "Su sesión ha expirado. Por favor, inicie sesión nuevamente.";
        }
      }
    } else if (error.request) {
      // Se hizo una solicitud pero no se recibió una respuesta
      apiError.message =
        "No se pudo conectar con el servidor. Por favor, revisa tu conexión.";
      apiError.code = "NETWORK_ERROR";
    } else {
      // Algo sucedió al configurar la solicitud que generó un Error
      apiError.message = error.message;
    }

    return Promise.reject(apiError);
  },
);

export default axiosConfig;

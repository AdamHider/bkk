import { boot } from 'quasar/wrappers'

const BASE_URL = 'http://bikeka-app.local'

const apiFetch = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`
  
  // Дефолтные заголовки
  const defaultOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  const response = await fetch(url, defaultOptions)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Ошибка сервера' }))
    throw new Error(error.message || `Ошибка: ${response.status}`)
  }

  return response.json()
}

export default boot(({ app }) => {
  // Пробрасываем в компоненты (опционально)
  app.config.globalProperties.$api = apiFetch
})

export { apiFetch }
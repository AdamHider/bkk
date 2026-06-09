const BASE_URL = process.env.PROD ? '' : 'https://bikeka.neurabyte.ru';

export const api = {
  async post(url, data = {}) {
    // Определяем, является ли data объектом FormData
    const isFormData = data instanceof FormData;

    const headers = {
      'X-Requested-With': 'XMLHttpRequest'
    };

    // Если это НЕ FormData, то это обычный JSON — ставим заголовок и сериализуем
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers: headers,
      body: isFormData ? data : JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Ошибка: ${response.status}`);
    }

    return response.json();
  }
};
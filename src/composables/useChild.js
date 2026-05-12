import { ref } from 'vue'
import { api } from 'src/boot/fetch'
import { useQuasar } from 'quasar'

// Общее состояние данных (Shared State)
const child = ref(null)

export function useChild() {
  const $q = useQuasar()
  const uploading = ref(false)

  const loadChild = async (childId, statsPeriod = 'week') => {
    try {
      const response = await api.post('/Child/getItem', {
        child_id: childId,
        stats_period: statsPeriod
      })
      child.value = response
      return response // Возвращаем для обработки в компоненте
    } catch (error) {
      console.error('Ошибка API:', error)
      $q.notify({ color: 'negative', message: 'Ошибка загрузки данных' })
      throw error // Пробрасываем ошибку дальше
    }
  }

  const updateAvatar = async (childId, file) => {
    if (!file || file.size > 5 * 1024 * 1024) {
      $q.notify({ color: 'negative', message: 'Файл некорректен или слишком велик' })
      return
    }

    const formData = new FormData()
    formData.append('child_id', childId)
    formData.append('avatar', file)

    uploading.value = true
    try {
      const response = await api.post('/Child/updateImage', formData)
      if (response.status === 'success') {
        child.value.avatar = response.avatar
        $q.notify({ color: 'positive', message: 'Фото обновлено', icon: 'done' })
        await loadChild(childId)
      }
    } catch (error) {
      $q.notify({ color: 'negative', message: 'Не удалось загрузить фото' })
    } finally {
      uploading.value = false
    }
  }

  return {
    child,
    uploading,
    loadChild,
    updateAvatar
  }
}

import { ref } from 'vue'
import { api } from 'src/boot/fetch'

const skills = ref({
  in_progress: [],
  not_started: [],
  mastered: []
})

export function useSkills() {
  
  
  const loadSkills = async (childId, status) => {
    const  data = await api.post('/Skill/getList', { child_id: childId, status })
    
    skills.value[status] = data.map(skill => ({
      ...skill,
      current_status: status,
      stages: (skill.stages || []).map(stage => ({
        ...stage,
        is_completed: Boolean(Number(stage.is_completed))
      }))
    }))
    
    return skills.value[status]
  }

  const updateStatus = (child_id, skill_id, status) => 
    api.post('/Skill/updateStatus', { child_id, skill_id, status })

  const updateStage = (child_id, stage_id, is_completed) => 
    api.post('/Skill/updateStage', { child_id, stage_id, is_completed })

  return {
    skills, 
    loadSkills,
    updateStatus,
    updateStage
  }
}
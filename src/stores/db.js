import Dexie from 'dexie';

export const db = new Dexie('BikekaDB');

db.version(1).stores({
  // cacheKey — это будет строка типа "Skill/getList?child_id=1&status=in_progress"
  api_cache: 'cacheKey' 
});
export interface LessonPlan {
  id: string;
  createdAt: string;
  topic: string;
  gradeLevel: string;
  mainConcept: string;
  materials: string;
  objectives: string;
  outline: string;
  generatedContent?: string;
}

const STORAGE_KEY = 'lesson-plans';

export function saveLessonPlan(plan: Omit<LessonPlan, 'id' | 'createdAt'>): LessonPlan {
  const plans = getLessonPlans();
  const newPlan: LessonPlan = {
    ...plan,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  
  plans.unshift(newPlan);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  return newPlan;
}

export function getLessonPlans(): LessonPlan[] {
  const plans = localStorage.getItem(STORAGE_KEY);
  return plans ? JSON.parse(plans) : [];
}

export function deleteLessonPlan(id: string): void {
  const plans = getLessonPlans().filter(plan => plan.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}

export function updateLessonPlan(plan: LessonPlan): void {
  const plans = getLessonPlans().map(p => 
    p.id === plan.id ? { ...plan } : p
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}
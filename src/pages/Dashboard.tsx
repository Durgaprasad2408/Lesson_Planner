import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import LessonPlanForm from '@/components/LessonPlanForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';


export default function Dashboard() {
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [loading] = useState(false);

  return (
    <div className="min-h-screen w-full bg-background px-4 sm:px-6 md:px-8 lg:px-96">
  <header className="border-b sticky top-0 z-10 bg-background w-full">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold sm:mr-0 md:mr-0 lg:mr-96">Lesson Planner</h1>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <FontAwesomeIcon icon={faSun} className="text-yellow-500" />
          ) : (
            <FontAwesomeIcon icon={faMoon} />
          )}
        </Button>
        <Button variant="ghost" size="icon" onClick={logout}>
          <FontAwesomeIcon icon={faSignOutAlt} className="text-white-300 bg-gray-950" />
        </Button>
      </div>
    </div>
  </header>

  <main className="container mx-auto px-4 py-8 flex justify-center w-full">
    <div className="w-full max-w-3xl px-4 sm:px-6 md:px-8">
      <LessonPlanForm loading={loading} />
    </div>
  </main>
</div>


  );
}
import { useState } from 'react';
import { LessonPlan, deleteLessonPlan, getLessonPlans } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { FileText, Trash2, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface SavedLessonPlansProps {
  onLoadPlan: (plan: LessonPlan) => void;
}

export default function SavedLessonPlans({ onLoadPlan }: SavedLessonPlansProps) {
  const [plans, setPlans] = useState<LessonPlan[]>(getLessonPlans());
  const [open, setOpen] = useState(false);

  const handleDelete = (id: string) => {
    deleteLessonPlan(id);
    setPlans(getLessonPlans());
    toast.success('Lesson plan deleted');
  };

  const handleLoad = (plan: LessonPlan) => {
    onLoadPlan(plan);
    setOpen(false);
    toast.success('Lesson plan loaded');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <FileText className="mr-2 h-4 w-4" />
          Load Saved Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Saved Lesson Plans</DialogTitle>
          <DialogDescription>
            Select a lesson plan to load or delete
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          {plans.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No saved lesson plans yet
            </div>
          ) : (
            <div className="space-y-4">
              {plans.map((plan) => (
                <Card key={plan.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{plan.topic}</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(plan.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(plan.createdAt), 'MMM d, yyyy h:mm a')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Grade Level:</span>{' '}
                        {plan.gradeLevel}
                      </div>
                      <div>
                        <span className="font-medium">Main Concept:</span>{' '}
                        {plan.mainConcept}
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleLoad(plan)}
                      >
                        Load Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
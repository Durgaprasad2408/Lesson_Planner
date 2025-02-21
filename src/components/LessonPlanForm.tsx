import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Download, Save } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { generateLessonPlan } from '@/lib/gemini';
import { saveLessonPlan, updateLessonPlan, type LessonPlan } from '@/lib/storage';
import SavedLessonPlans from './SavedLessonPlans';

const formSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  gradeLevel: z.string().min(1, 'Grade level is required'),
  mainConcept: z.string().min(1, 'Main concept is required'),
  materials: z.string().min(1, 'Materials are required'),
  objectives: z.string().min(1, 'Learning objectives are required'),
  outline: z.string().min(1, 'Lesson outline is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface LessonPlanFormProps {
  loading?: boolean;
}

export default function LessonPlanForm({ loading: parentLoading }: LessonPlanFormProps) {
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [currentPlan, setCurrentPlan] = useState<LessonPlan | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      gradeLevel: '',
      mainConcept: '',
      materials: '',
      objectives: '',
      outline: '',
    },
  });

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Lesson Plan - ${form.getValues('topic')}`,
    onAfterPrint: () => toast.success('PDF downloaded successfully!'),
  });

  const handleSave = () => {
    const formData = form.getValues();
    if (currentPlan) {
      const updatedPlan = {
        ...currentPlan,
        ...formData,
        generatedContent,
      };
      updateLessonPlan(updatedPlan);
      setCurrentPlan(updatedPlan);
      toast.success('Lesson plan updated');
    } else {
      const newPlan = saveLessonPlan({
        ...formData,
        generatedContent,
      });
      setCurrentPlan(newPlan);
      toast.success('Lesson plan saved');
    }
  };

  const handleLoadPlan = (plan: LessonPlan) => {
    form.reset(plan);
    setGeneratedContent(plan.generatedContent || '');
    setCurrentPlan(plan);
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const content = await generateLessonPlan(data);
      setGeneratedContent(content);
      toast.success('Lesson plan generated successfully!');
    } catch (error) {
      toast.error('Failed to generate lesson plan. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || parentLoading;

  return (
    <div className="grid gap-8">
      <div className="flex gap-4">
        <SavedLessonPlans onLoadPlan={handleLoadPlan} />
        {generatedContent && (
          <Button variant="outline" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            {currentPlan ? 'Update Plan' : 'Save Plan'}
          </Button>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter lesson topic"
                          {...field}
                          disabled={isDisabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gradeLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isDisabled}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[...Array(12)].map((_, i) => (
                            <SelectItem key={i + 1} value={`${i + 1}`}>
                              Grade {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mainConcept"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Concept</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter main concept"
                          {...field}
                          disabled={isDisabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="materials"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Materials Needed</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List required materials"
                          {...field}
                          disabled={isDisabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="objectives"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Learning Objectives</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter learning objectives"
                          {...field}
                          disabled={isDisabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="outline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lesson Outline</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter lesson outline"
                          {...field}
                          disabled={isDisabled}
                          className="min-h-[200px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="submit" disabled={isDisabled}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Lesson Plan
            </Button>
          </div>
        </form>
      </Form>

      {generatedContent && (
        <div ref={printRef}>
          <Card className="print:shadow-none">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  Lesson Plan: {form.getValues('topic')}
                </h2>
                <div className="print:hidden">
                  <Button onClick={handlePrint} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Grade Level
                    </p>
                    <p>Grade {form.getValues('gradeLevel')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Main Concept
                    </p>
                    <p>{form.getValues('mainConcept')}</p>
                  </div>
                </div>
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  {generatedContent.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
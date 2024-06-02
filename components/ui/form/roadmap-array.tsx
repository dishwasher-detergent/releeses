"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LucideGhost, LucidePlus, LucideTrash } from "lucide-react";
import { UseFormReturn, useFieldArray, useFormContext } from "react-hook-form";

interface RoadmapArrayInputProps {
  title?: string;
  name: string;
  form: UseFormReturn<any>;
}

export const RoadmapArrayInput = ({
  title,
  name,
  form,
}: RoadmapArrayInputProps) => {
  const { control, register } = form;

  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(name, formState);

  const { fields, append, remove } = useFieldArray({
    control,
    name: name,
  });

  return (
    <div>
      <Card className="p-2 shadow-none">
        <ul className="mb-2 space-y-2 rounded-lg border bg-muted px-4">
          {fields.map((item: any, index: number) => {
            return (
              <li
                key={item.id}
                className="flex flex-row items-start gap-4 border-b-2 border-dotted py-4 last:border-none"
              >
                <div className="flex flex-1 flex-col gap-4 md:flex-row">
                  <div className="flex flex-1 flex-col gap-2">
                    <Input
                      {...register(`${name}.${index}.value.id`)}
                      className="hidden"
                    />
                    <div className="space-y-1">
                      <Label>Title</Label>
                      <Input
                        {...register(`${name}.${index}.value.title`)}
                        className="dark:text-slate-white bg-white dark:bg-slate-950 dark:text-white"
                      />
                      <p className="text-xs text-red-500 dark:text-red-900">
                        {
                          (fieldState.error as any)?.[index]?.value?.["title"]
                            ?.message
                        }
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label>Description</Label>
                      <Textarea
                        {...register(`${name}.${index}.value.description`)}
                        className="dark:text-slate-white bg-white dark:bg-slate-950 dark:text-white"
                      />
                      <p className="text-xs text-red-500 dark:text-red-900">
                        {
                          (fieldState.error as any)?.[index]?.value?.[
                            "description"
                          ]?.message
                        }
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Accomplished</Label>
                      <input
                        type="checkbox"
                        {...register(`${name}.${index}.value.accomplished`)}
                      />
                      <p className="text-xs text-red-500 dark:text-red-900">
                        {
                          (fieldState.error as any)?.[index]?.value?.[
                            "accomplished"
                          ]?.message
                        }
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    className="flex-none text-red-600"
                    onClick={() => remove(index)}
                  >
                    <LucideTrash className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            );
          })}
          {fields.length === 0 && (
            <li className="flex flex-row items-center p-2 text-sm font-semibold text-slate-500 dark:text-slate-300">
              <LucideGhost className="mr-2 h-4 w-4" />
              No {title}
            </li>
          )}
        </ul>
        <Button
          variant="default"
          size="sm"
          type="button"
          onClick={() => {
            append({ value: null });
          }}
        >
          <LucidePlus className="mr-2 h-4 w-4" />
          Add
        </Button>
      </Card>
    </div>
  );
};

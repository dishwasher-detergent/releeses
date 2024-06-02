"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { RoadmapArrayInput } from "@/components/ui/form/roadmap-array";
import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/types/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideLoader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  roadmap: z.array(
    z.object({
      value: z
        .object({
          id: z.number().nullable().optional(),
          title: z
            .string({
              required_error: "Title is required.",
            })
            .min(1),
          description: z
            .string({
              required_error: "Description is required.",
            })
            .min(1),
          accomplished: z.boolean(),
        })
        .optional(),
    }),
  ),
});

interface RoadmapFormProps {
  data: Tables<"roadmap">[] | null;
}

export const RoadmapForm = ({ data }: RoadmapFormProps) => {
  const supabase = createClient();
  const { org_id } = useParams() as { org_id?: string };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formSchema.parse({
      roadmap:
        data?.map((x) => ({
          value: {
            id: x.id,
            title: x.title,
            description: x.description,
            accomplished: x.accomplished,
          },
        })) ?? [],
    }),
  });

  async function deletePoints(roadmap: any[]) {
    const formIds = roadmap
      .map((x: any) => x.id)
      .filter((x: any) => x !== null);
    const existingIds = data?.map((x) => x.id);
    const difference = existingIds?.filter((x) => !formIds.includes(x));

    if (difference && difference.length > 0) {
      const { data: deleteData, error: deleteError } = await supabase
        .from("roadmap")
        .delete()
        .in("id", [...difference]);

      if (deleteError) {
        toast.error("Failed to delete roadmap markers.");
      } else {
        toast.success("Deleted roadmap markers.");
      }
    }

    return difference;
  }

  async function insertPoints(roadmap: any[]) {
    const insert = roadmap
      .filter((x) => x.id === null)
      .map(({ id, ...rest }) => rest);

    if (insert.length > 0) {
      const { data: insertData, error: insertError } = await supabase
        .from("roadmap")
        .insert(insert)
        .select("*");

      if (insertError) {
        toast.error("Failed to insert roadmap markers.");
      } else {
        toast.success("Inserted roadmap markers.");
        return insertData;
      }
    }

    return [];
  }

  async function updatePoints(roadmap: any[]) {
    const update = roadmap.filter((x) => x.id !== null);

    if (update.length > 0) {
      const { data: updateData, error: updateError } = await supabase
        .from("roadmap")
        .upsert(update)
        .select("*");

      if (updateError) {
        toast.error("Failed to update roadmap markers.");
      } else {
        toast.success("Updated roadmap markers.");
        return updateData;
      }
    }

    return [];
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let roadmap = values.roadmap.map((x: any) => ({
      ...x.value,
      organization: org_id,
    }));

    const deleted_ids = await deletePoints(roadmap);
    const inserted_ids = await insertPoints(roadmap);
    const updated_ids = await updatePoints(roadmap);

    const newRoadmap = [...inserted_ids, ...updated_ids]
      .filter((x) => !deleted_ids?.includes(x.id))
      .map((x) => ({
        value: {
          id: x.id,
          title: x.title,
          description: x.description,
          accomplished: x.accomplished,
        },
      }));

    // @ts-ignore
    form.setValue("roadmap", newRoadmap);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <RoadmapArrayInput
            form={form}
            name="roadmap"
            title="roadmap markers."
          />
        </div>
        <footer className="flex flex-row justify-end gap-2">
          <Button
            disabled={form.formState.isSubmitting}
            type="button"
            variant="destructive"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <LucideLoader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save
          </Button>
        </footer>
      </form>
    </Form>
  );
};

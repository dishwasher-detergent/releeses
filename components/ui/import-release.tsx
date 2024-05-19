"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ImportRelease({
  open,
  onOpenChange,
  releases,
  handleImport,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  releases: any[];
  handleImport: (body: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-[9999]">
        <DialogHeader>
          <DialogTitle>Import Release</DialogTitle>
        </DialogHeader>
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="w-[100px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {releases.map((release) => (
              <TableRow key={release.id}>
                <TableCell>{release.name}</TableCell>
                <TableCell>
                  <DialogClose asChild>
                    <Button
                      size="sm"
                      onClick={() => {
                        handleImport(release.body);
                      }}
                    >
                      Import
                    </Button>
                  </DialogClose>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}

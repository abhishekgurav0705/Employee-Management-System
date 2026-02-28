"use client";
import { useState } from "react";
import { departments as initial } from "../../lib/mock";
import { Card, CardContent } from "../../components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState(initial);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  function add() {
    if (!name.trim()) return;
    setDepartments([...departments, { id: `d-${departments.length + 1}`, name }]);
    setName("");
    setOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-xl font-semibold">Departments</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Department</Button>
          </DialogTrigger>
          <DialogContent>
            <h3 className="text-lg font-semibold mb-3">Add Department</h3>
            <Input placeholder="Department name" value={name} onChange={(e) => setName(e.target.value)} />
            <div className="mt-4 flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={add}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH>Name</TH>
                <TH>Head</TH>
              </TR>
            </THead>
            <TBody>
              {departments.map((d) => (
                <TR key={d.id}>
                  <TD>{d.name}</TD>
                  <TD>-</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

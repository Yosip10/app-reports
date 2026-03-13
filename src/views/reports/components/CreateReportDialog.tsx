import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Report } from "@/interfaces/report";

interface CreateReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (report: Omit<Report, "id" | "createdAt" | "createdBy">) => void;
}

export function CreateReportDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateReportDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<Report["type"]>("Sales");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({ name, type, description, status: "Pending" });
    setName("");
    setType("Sales");
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white border-primary/10 rounded-lg px-5 py-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            Crear Nuevo Reporte
          </DialogTitle>
          <DialogDescription>
            Complete los detalles del reporte que desea generar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre del Reporte</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Ventas Mensuales Q1"
                className="h-9 border-[rgba(10,39,170,0.12)] rounded-lg focus:border-[#37322F] focus:ring-[#37322F]/20 transition-all duration-200"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo de Reporte</Label>
              <Select
                value={type}
                onValueChange={(value: any) => setType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sales">Ventas</SelectItem>
                  <SelectItem value="Inventory">Inventario</SelectItem>
                  <SelectItem value="Users">Usuarios</SelectItem>
                  <SelectItem value="Other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción (Opcional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-9 border-[rgba(10,39,170,0.12)] rounded-lg focus:border-[#37322F] focus:ring-[#37322F]/20 transition-all duration-200"
                placeholder="Breve descripción del contenido"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full sm:w-auto">
              Generar Reporte
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

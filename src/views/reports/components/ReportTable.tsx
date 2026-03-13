import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Download, Trash, Eye } from "lucide-react";
import type { Report } from "@/interfaces/report";

interface ReportTableProps {
  reports: Report[];
  onDelete: (id: string) => void;
  onView: (report: Report) => void;
  onDownload: (id: string) => void;
}

export function ReportTable({
  reports,
  onDelete,
  onView,
  onDownload,
}: ReportTableProps) {
  const getStatusBadge = (status: Report["status"]) => {
    switch (status) {
      case "Completed":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20">
            Completado
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20">
            Pendiente
          </Badge>
        );
      case "Failed":
        return (
          <Badge className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-rose-500/20">
            Fallido
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-xl border border-primary/5 overflow-hidden bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="font-bold text-primary">Nombre</TableHead>
            <TableHead className="font-bold text-primary">Tipo</TableHead>
            <TableHead className="font-bold text-primary">Estado</TableHead>
            <TableHead className="font-bold text-primary">Creado por</TableHead>
            <TableHead className="font-bold text-primary text-right">
              Fecha
            </TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-48 text-center text-muted-foreground"
              >
                <div className="flex flex-col items-center gap-2">
                  <Eye className="h-8 w-8 opacity-20" />
                  <p>No se encontraron reportes</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            reports.map((report) => (
              <TableRow
                key={report.id}
                className="group hover:bg-primary/2 transition-colors"
              >
                <TableCell className="font-medium">
                  {report.name}
                  {report.description && (
                    <p className="text-xs text-muted-foreground font-normal mt-0.5 line-clamp-1">
                      {report.description}
                    </p>
                  )}
                </TableCell>
                <TableCell>{report.type}</TableCell>
                <TableCell>{getStatusBadge(report.status)}</TableCell>
                <TableCell>{report.createdBy}</TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  {new Date(report.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onView(report)}>
                        <Eye className="mr-2 h-4 w-4" /> Ver detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDownload(report.id)}>
                        <Download className="mr-2 h-4 w-4" /> Descargar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(report.id)}
                        className="text-rose-600 focus:text-rose-600"
                      >
                        <Trash className="mr-2 h-4 w-4" /> Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

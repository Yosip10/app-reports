import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  LogOut,
  LayoutDashboard,
  Filter,
  ChevronLeft,
  ChevronRight,
  RotateCcw
} from "lucide-react";
import { ReportTable } from "./components/ReportTable";
import { CreateReportDialog } from "./components/CreateReportDialog";
import type { Report } from "@/interfaces/report";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { logoutService } from "@/axios/request";

// Datos de ejemplo
const INITIAL_REPORTS: Report[] = [
  {
    id: "1",
    name: "Cierre Mensual Febrero",
    type: "Sales",
    status: "Completed",
    createdBy: "Juan Pérez",
    createdAt: "2024-03-01T10:00:00Z",
    description: "Reporte detallado de ventas del mes de febrero 2024"
  },
  {
    id: "2",
    name: "Stock Crítico Bodega A",
    type: "Inventory",
    status: "Pending",
    createdBy: "Maria Rojas",
    createdAt: "2024-03-12T15:30:00Z"
  },
  {
    id: "3",
    name: "Auditoría de Accesos QR",
    type: "Users",
    status: "Failed",
    createdBy: "Sistemas",
    createdAt: "2024-03-10T08:20:00Z",
    description: "Error en la sincronización de logs"
  },
  {
    id: "4",
    name: "Ventas Regional Norte",
    type: "Sales",
    status: "Completed",
    createdBy: "Juan Pérez",
    createdAt: "2024-02-25T12:00:00Z"
  },
  {
    id: "5",
    name: "Inventario Anual 2023",
    type: "Inventory",
    status: "Completed",
    createdBy: "Admin",
    createdAt: "2024-01-15T09:00:00Z"
  }
];

const Reports = () => {
  const navigate = useNavigate();
  const { logout, accountId, user } = useAuthStore((state) => state);
  
  // Estado de los reportes
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleLogout = async () => {
    if (accountId && user?.refresh_token) {
      await logoutService(accountId, user.refresh_token);
    }
    logout();
    navigate("/");
  };

  const handleCreateReport = (data: Omit<Report, "id" | "createdAt" | "createdBy">) => {
    const newReport: Report = {
      ...data,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
      createdBy: "Usuario Actual", // Podríamos obtenerlo del store si estuviera disponible
    };
    setReports([newReport, ...reports]);
  };

  const handleDeleteReport = (id: string) => {
    setReports(reports.filter(r => r.id !== id));
  };

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesSearch = report.name.toLowerCase().includes(search.toLowerCase()) || 
                           (report.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchesType = typeFilter === "all" || report.type === typeFilter;
      const matchesStatus = statusFilter === "all" || report.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [reports, search, typeFilter, statusFilter]);

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navbar Superior */}
      <header className="sticky top-0 z-30 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-primary">ADO Reports</h1>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Intelligence Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-medium text-primary">Portal de Gestión</span>
              <span className="text-xs text-muted-foreground">{accountId || "ADO Tech"}</span>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-primary/20 hover:bg-primary/5 text-primary gap-2 h-9 rounded-lg px-4"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col gap-8">
          {/* Header de la sección */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Gestión de Reportes</h2>
              <p className="text-slate-500 mt-1">Monitorea, filtra y genera reportes detallados del sistema.</p>
            </div>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 h-11 rounded-xl px-6 gap-2"
            >
              <Plus className="h-5 w-5" />
              Generar Nuevo Reporte
            </Button>
          </div>

          {/* Barra de Filtros y Búsqueda */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm items-end">
            <div className="lg:col-span-5 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Búsqueda rápida</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Buscar por nombre o descripción..." 
                  className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
            
            <div className="lg:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Tipo</label>
              <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="h-11 bg-slate-50 border-slate-200 rounded-xl">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="Sales">Ventas</SelectItem>
                  <SelectItem value="Inventory">Inventario</SelectItem>
                  <SelectItem value="Users">Usuarios</SelectItem>
                  <SelectItem value="Other">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="lg:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Estado</label>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="h-11 bg-slate-50 border-slate-200 rounded-xl">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="Completed">Completado</SelectItem>
                  <SelectItem value="Pending">Pendiente</SelectItem>
                  <SelectItem value="Failed">Fallido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="lg:col-span-3 flex gap-2">
              <Button 
                variant="outline" 
                onClick={resetFilters}
                className="flex-1 h-11 rounded-xl border-slate-200 hover:bg-slate-50 gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Limpiar
              </Button>
              <Button 
                variant="outline" 
                className="h-11 w-11 p-0 rounded-xl border-slate-200 hover:bg-slate-50"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tabla de Resultados */}
          <div className="flex flex-col gap-4">
            <ReportTable 
              reports={paginatedReports} 
              onDelete={handleDeleteReport}
              onView={(r) => console.log("Ver", r)}
              onDownload={(id) => console.log("Descargar", id)}
            />
            
            {/* Paginación */}
            <div className="flex items-center justify-between px-2 py-4 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                Mostrando <span className="font-semibold text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> a{" "}
                <span className="font-semibold text-slate-900">{Math.min(currentPage * itemsPerPage, filteredReports.length)}</span> de{" "}
                <span className="font-semibold text-slate-900">{filteredReports.length}</span> resultados
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg h-9 w-9 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={`h-9 w-9 rounded-lg ${currentPage === page ? "bg-primary text-white shadow-md shadow-primary/20" : "border-slate-200"}`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="rounded-lg h-9 w-9 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Diálogos */}
      <CreateReportDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onCreate={handleCreateReport}
      />
    </div>
  );
};

export default Reports;

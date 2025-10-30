import DashboardInstitucional from "./institucional/DashboardInstitucional";
import EditorEstadoArchivos from "./institucional/EditorEstadoArchivos";
import EditorTrazabilidad from "./institucional/EditorTrazabilidad";
import MetricaSupabase from "./institucional/MetricaSupabase";
import TestInstitucional from "./institucional/TestInstitucional";
import ValidacionPreVercel from "./institucional/ValidacionPreVercel";

<Route path="/dashboard-institucional" element={<><DashboardInstitucional /></>} />
<Route path="/editor-estado" element={<><EditorEstadoArchivos /></>} />
<Route path="/editor-trazabilidad" element={<><EditorTrazabilidad /></>} />
<Route path="/metrica-supabase" element={<><MetricaSupabase /></>} />
<Route path="/test-institucional" element={<><TestInstitucional /></>} />
<Route path="/validacion-pre-vercel" element={<><ValidacionPreVercel /></>} />

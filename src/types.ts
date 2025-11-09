// Participantes del grupo
export type Participante = {
  nombre: string;
  apellido?: string;
  fechaNacimiento: string;
  ciudad: string;
  comuna: string;
  ingresos: number;
  egresos: number;
  metaIndividual: number;
  correo?: string;
};

// Datos del usuario solicitante
export type DatosUsuario = {
  nombre: string;
  apellido: string;
  fechaNacimiento: string; // formato YYYY-MM-DD
  pais: string;
  ciudad: string;
  comuna: string;
  correo: string;
  clave: string;
};

// Datos de institución colaboradora
export type DatosColaborador = {
  nombreResponsable: string;
  institucion: string;
  pais: string;
  ciudad: string;
  correo: string;
};

// Oferta publicada por colaborador
export type OfertaColaborador = {
  titulo: string;
  descripcion: string;
  tipo: "crédito" | "inversión" | "educación";
  tasaInteres: number;
  plazoMeses: number;
  montoMinimo: number;
  pais: string;
};

// Usuario registrado en Supabase
export interface Usuario {
  nombre: string;
  correo: string;
  ingresos: number;
  egresos: number;
  grupo_id: string | null;
}

// Grupo financiero en Supabase
export interface Grupo {
  id: string;
  nombre: string;
  ciudad: string;
  comuna: string;
  pais: string;
  meta_grupal: number;
  fecha_creacion: string;
  activo: boolean;
  administrador_id: string; // ← agregado para lógica condicional en PanelGrupo
}

// Colaborador institucional
export interface Colaborador {
  nombre: string;
  apellido: string;
  correo: string;
  institucion: string;
  pais: string;
  ciudad: string;
  rol: string;
  area: string;
  fecha_solicitud: string;
  estado: "pendiente" | "aprobado" | "rechazado";
}

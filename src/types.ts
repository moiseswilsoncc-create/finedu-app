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
  contraseña: string;
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

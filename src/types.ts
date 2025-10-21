// Participantes del grupo
export type Participante = {
  nombre: string;
  ingresos: number;
  egresos: number;
  metaIndividual: number;
};

// Datos del usuario solicitante
export type DatosUsuario = {
  nombre: string;
  edad: number;
  pais: string;
  ciudad: string;
  correo: string;
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

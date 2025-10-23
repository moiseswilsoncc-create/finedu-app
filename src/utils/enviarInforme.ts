// src/utils/enviarInforme.ts

interface Colaborador {
  nombre: string;
  email: string;
}

const colaboradores: Colaborador[] = [
  { nombre: "Institución A", email: "contacto@institucionA.cl" },
  { nombre: "Institución B", email: "info@institucionB.cl" },
];

export function enviarInformeMensual() {
  const informe = "InformeInstitucional_Finedu.pdf";

  colaboradores.forEach((colaborador) => {
    console.log(`📤 Enviando informe a ${colaborador.nombre} (${colaborador.email})...`);
    // Simulación: aquí iría la integración con SendGrid, Resend, etc.
    console.log(`✅ Informe "${informe}" enviado correctamente.`);
  });
}

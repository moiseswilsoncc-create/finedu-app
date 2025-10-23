// src/utils/enviarInforme.ts

interface Colaborador {
  nombre: string;
  email: string;
}

const colaboradores: Colaborador[] = [
  { nombre: "Institución A", email: "contacto@institucionA.cl" },
  { nombre: "Institución B", email: "info@institucionB.cl" },
  // Puedes agregar más instituciones aquí
];

export function enviarInformeMensual(): void {
  const nombreInforme = "InformeInstitucional_Finedu.pdf";

  console.log("🗓️ Simulación de envío mensual iniciada...\n");

  colaboradores.forEach((colaborador) => {
    console.log(`📤 Enviando informe a: ${colaborador.nombre}`);
    console.log(`✉️ Correo: ${colaborador.email}`);
    console.log(`📎 Informe adjunto: ${nombreInforme}`);
    console.log(`✅ Estado: Enviado correctamente\n`);
  });

  console.log("🎯 Todos los envíos simulados han sido completados.");
}

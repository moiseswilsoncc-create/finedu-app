import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  usuario: { correo: string };
  correos: string[];
  montos: { [correo: string]: number };
  nombres: { [correo: string]: string };
  nuevoCorreo: string;
  setNuevoCorreo: (v: string) => void;
  agregarCorreo: (correo: string) => Promise<void>; // 👈 ahora recibe correo y valida en el padre
  crearGrupo: () => void;
  aporteMensual: number;
  setNombres: React.Dispatch<React.SetStateAction<{ [correo: string]: string }>>;
  setMontos: React.Dispatch<React.SetStateAction<{ [correo: string]: number }>>;
}

const BloqueParticipantes: React.FC<Props> = ({
  usuario,
  correos,
  montos,
  nombres,
  nuevoCorreo,
  setNuevoCorreo,
  agregarCorreo,
  crearGrupo,
  aporteMensual,
  setNombres,
  setMontos,
}) => {
  const navigate = useNavigate();
  const [seleccionados, setSeleccionados] = useState<string[]>([]);

  const toggleSeleccion = (correo: string) => {
    setSeleccionados((prev) =>
      prev.includes(correo) ? prev.filter((c) => c !== correo) : [...prev, correo]
    );
  };

  const editarSeleccionado = () => {
    alert("✏️ Función de edición pendiente.");
  };

  const eliminarSeleccionados = () => {
    const nuevosCorreos = correos.filter((c) => !seleccionados.includes(c));
    setMontos((prev) => {
      const copia = { ...prev };
      seleccionados.forEach((c) => delete copia[c]);
      return copia;
    });
    setNombres((prev) => {
      const copia = { ...prev };
      seleccionados.forEach((c) => delete copia[c]);
      return copia;
    });
    setSeleccionados([]);
  };

  const handleAgregarCorreo = () => {
    const correoL

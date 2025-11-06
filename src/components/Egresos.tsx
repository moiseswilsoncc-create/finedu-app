import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import FormularioEgreso from "./FormularioEgreso";
import ListaEgresos from "./ListaEgresos";

const Egresos: React.FC = () => {
  // estados, useEffect, cargarCategorias, cargarEgresos, cargarItemsCategoria
  // handleAgregarItem, handleGuardarEgreso, handleEditarSeleccionado, handleEliminarSeleccionados

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📉 Egresos</h2>
      <FormularioEgreso
        categorias={categorias}
        itemsCategoria={itemsCategoria}
        egresos={egresos}
        categoria={categoria}
        item={item}
        monto={monto}
        fecha={fecha}
        descripcion={descripcion}
        nuevoItem={nuevoItem}
        editando={editando}
        mensaje={mensaje}
        error={error}
        onAgregarItem={handleAgregarItem}
        onGuardar={handleGuardarEgreso}
        setCategoria={setCategoria}
        setItem={setItem}
        setMonto={setMonto}
        setFecha={setFecha}
        setDescripcion={setDescripcion}
        setNuevoItem={setNuevoItem}
        cargarItemsCategoria={cargarItemsCategoria}
      />
      <ListaEgresos
        egresos={egresos}
        seleccionados={seleccionados}
        toggleSeleccion={toggleSeleccion}
        handleEditarSeleccionado={handleEditarSeleccionado}
        handleEliminarSeleccionados={handleEliminarSeleccionados}
      />
    </div>
  );
};

export default Egresos;

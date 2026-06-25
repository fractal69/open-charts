import { _buildDrawingApi } from "../drawing/_buildDrawingApi";
import { removeDrawingModule } from "./removeDrawingModule";

export function addDrawingModule(moduleDef) {
  if (this._drawingModules.has(moduleDef.id)) {
    removeDrawingModule.call(this, moduleDef.id);
  }

  const api = _buildDrawingApi.call(this);
  const result = moduleDef.mount(api); // módulo devuelve { render, destroy }

  const handle = {
    id: moduleDef.id,
    module: moduleDef,
    _render: result.render ?? null,
    destroy: () => {
      result.destroy?.();
      this._drawingModules.delete(moduleDef.id);
      this.drawingsDirty = true;
    },
    redraw: () => {
      this.drawingsDirty = true;
    },
  };

  Object.keys(result).forEach((k) => {
    if (!["render", "destroy"].includes(k)) handle[k] = result[k];
  });

  this._drawingModules.set(moduleDef.id, handle);
  this.drawingsDirty = true;
  return handle;
}

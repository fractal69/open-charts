export function removeDrawingModule(id) {
  this._drawingModules.get(id)?.destroy();
}

import { _mergeoptions } from "../utils/_mergeOptions";
import { _loadCssVariables } from "../render/_loadCssVariables";

export function applyOptions(newOptions) {
  this.options = _mergeoptions(this.options, newOptions);
  _loadCssVariables(this);
  this.dirty = true;
}

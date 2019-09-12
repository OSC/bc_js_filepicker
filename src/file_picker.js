import Vue from 'vue';
import FilePicker from './components/file_picker.vue';
import {
  file_system_favorites,
  file_system_favorites_from_input_data
} from './files_api.js';

/**
 * Selects all file picker inputs
 * @return {NodeList} selected elements
 */
function filepicker_inputs() {
  return document.querySelectorAll('input[data-filepicker]');
}

/**
 * Attaches file pickers to the DOM
 *
 * File pickers are inputs with a data attribute of filepicker
 */
export function attach_filepickers() {
  file_system_favorites().then((favorites) => {
    for(let fp_input of filepicker_inputs()) {
      let fp_id = fp_input.id;
      let sacrificial_div = document.createElement('div');
      let favorites_from_input = file_system_favorites_from_input_data(fp_input);
      fp_input.parentElement.append(sacrificial_div);

      let vue = new Vue({
        el: sacrificial_div,
        render: fn => fn(
          FilePicker,
          {
            props: {
              input: fp_input,
              fs_favorites: (favorites_from_input) ? favorites_from_input : favorites
            }
          }
        )
      });
    }
  });
}
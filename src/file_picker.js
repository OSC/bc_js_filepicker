import jQuery from 'jquery';
import Vue from 'vue';
import FilePicker from './components/file_picker.vue';
import FileExplorer from './file_explorer';

/**
 * Selects all file picker inputs
 * @return {jQuery<HTMLElement>} selected elements
 */
function filepicker_inputs() {
  return jQuery('input[data-filepicker]');
}
/**
 * Adds file select button
 * @param {string} id The id of the input element
 */
function add_button(id) {
  jQuery('#' + id)
    .parent()
    .after(`<button
              type="button"
              class="btn btn-primary"
              style="margin-bottom: 15px;"
              data-toggle="modal"
              data-target="#modal-for-${id}">Select File</button>`);
}

/**
 * Attaches file pickers to the DOM
 *
 * File pickers are inputs with a data attribute of filepicker
 */
export function attach_filepickers() {
  let main_div = jQuery('div[role="main"]');
  let fs = new FileExplorer();

  for(let fp_input of filepicker_inputs()) {
  	let fp_id = fp_input.id;
    main_div.append(`<div id='filepicker-for-${fp_id}'></div>`)
    add_button(fp_id);
    let vue = new Vue({
      el: `#filepicker-for-${fp_id}`,
      render: fn => fn(
        FilePicker,
        {
          props: {
            input: fp_input,
            fs: fs,
            path: fs.last_path()
          }
        }
      )
    });
  }
}
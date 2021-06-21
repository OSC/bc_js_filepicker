import Vue from 'vue'
import FilePicker from './components/file_picker.vue'
import {
  file_system_favorites,
  file_system_favorites_from_input_data,
} from './files_api.js'

/**
 * Selects all file picker inputs
 * @return {NodeList} selected elements
 */
function filepicker_inputs() {
  return document.querySelectorAll('input[data-filepicker]')
}

/**
 * Shall this file picker show dot files?
 * @param  {Input} target input element
 * @return {Boolean}
 */
function allow_showing_hidden(input) {
  return input.dataset.showHidden || false
}

/**
 * Get files/dirs/both setting from the input's data attributes
 * @param  {Input} input The target input element
 * @return {String}      One of files, dirs, or both
 */
function allow_selecting_files_folders_or_both(input) {
  const selection = input.dataset.targetFileType
  if (!selection) {
    return 'both'
  }

  const match = {
    files: 'files',
    dirs: 'dirs',
    both: 'both',
  }[selection]

  if (!match) {
    console.error(`${selection} is not one of [files, dirs, both]. Using both.`)
    return 'both'
  } else {
    return match
  }
}

/**
 * Get file/dir pattern from the input's data attributes
 *
 * @param  {Input} input The target input element
 * @return {RegExp | false}       The RegExp to use when matching entry names or false
 */
function allow_target_file_pattern(input) {
  const target_file_type = input.dataset.targetFilePattern
  try {
    return !!target_file_type ? new RegExp(target_file_type) : false
  } catch (error) {
    console.error(
      `Unable to compile regular expression: ${target_file_type}. Not using target-file-type.`,
    )
    return false
  }
}

/**
 * Attaches file pickers to the DOM
 *
 * File pickers are inputs with a data attribute of filepicker
 */
export function attach_filepickers() {
  file_system_favorites().then(favorites => {
    for (let fp_input of filepicker_inputs()) {
      let fp_id = fp_input.id
      let sacrificial_div = document.createElement('div')
      let favorites_from_input = file_system_favorites_from_input_data(fp_input)
      fp_input.parentElement.append(sacrificial_div)

      let vue = new Vue({
        el: sacrificial_div,
        render: fn =>
          fn(FilePicker, {
            props: {
              input: fp_input,
              fs_favorites: favorites_from_input
                ? favorites_from_input
                : favorites,
              show_hidden: allow_showing_hidden(fp_input),
              target_file_type: allow_selecting_files_folders_or_both(fp_input),
              target_file_pattern: allow_target_file_pattern(fp_input),
            },
          }),
      })
    }
  })
}

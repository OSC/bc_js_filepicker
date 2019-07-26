import * as pathmod from 'path-browserify';

/**
 * Interface to OnDemand's File Explorer API
 */
export default class FileExplorer {
  constructor() {
    // Fallback to root if fetch fails
    this.home_dir = window.localStorage.getItem('files_home_dir') || '/';
    this.fs_api_root = '/pun/sys/files/api/v1/fs/';
    this.favorites = JSON.parse(window.localStorage.getItem('files_favorites')) || [];
  }

  /**
   * Initialize and store $HOME in localStorage
   *
   * This is a hack that relies on the Dashboard's File Explorer favorites menu.
   * 
   * @return {void}
   */
  init() {
    if(this.home_dir != '/') {
      return;
    }

    this.setFavorites();

    this.home_dir = this.favorites[0].href;
    window.localStorage.setItem('files_home_dir', this.home_dir);

    if(this.last_path() === '/') {
      this.update_last_location(this.home_dir);
    }
  }

  setFavorites(html) {
    for(let element of document.querySelectorAll('li[title="Files"] a[title]').values()) {
      this.favorites.push({
        title: element.title,
        href: element.href.replace(new RegExp('^.+/pun/sys/files/fs'), '')
      });
    }

    window.localStorage.setItem('files_favorites', JSON.stringify(this.favorites));
  }

  /**
   * Lists a path and passes result to a callback
   * @param  {string}   path     The path to be listed
   * @param  {Function} callback A callback taking the response JSON
   * @return {void}
   */
  list_path(path, callback) {
    fetch(this.fs_api_root + path.replace(/(^\/)/, ''), {
      credentials: 'same-origin'  // required to produce intended behavior in older browsers
    }).then(
      callback
    )
  }

  last_path() {
    return window.localStorage.getItem('files_last_path') || this.home_dir;
  }

  /**
   * Store the last path in localStorage
   * @param  {string} path
   * @return {void}
   */
  update_last_location(path) {
      window.localStorage.setItem('files_last_path', '' + path);
  }
}
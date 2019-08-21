import * as pathmod from 'path-browserify';

function extract_favorites_from_document(doc) {
  let favorites = [];
  for(let element of doc.querySelectorAll('li[title="Files"] a[title]').values()) {
    favorites.push({
      title: element.title,
      href: element.href.replace(new RegExp('^.+/pun/sys/files/fs'), '')
    });
  }

  return favorites;
}

export function set_last_path(path, namespace='') {
  window.localStorage.setItem('files_last_path' + namespace, '' + path);
}

export function last_path(namespace='') {
  return window.localStorage.getItem('files_last_path' + namespace) || '/';
}

export function list_path(path) {
  const fs_api_root = '/pun/sys/files/api/v1/fs/';

  return fetch(pathmod.resolve(fs_api_root, path.replace(/(^\/)/, '')), {
    credentials: 'same-origin'
  });
}

export function file_system_favorites() {
  if(window.file_picker_favorites) {
    return Promise.resolve(window.file_picker_favorites);
  } else if(!!window.location.href.match(new RegExp('pun/(sys|dev)/(ood-)?dashboard'))) {
    return Promise.resolve(extract_favorites_from_document(document));
  } else {
    return fetch('/pun/sys/dashboard', {
      credentials: 'same-origin'
    }).then((response) => {
      return response.text();
    }).then((html) => {
      return extract_favorites_from_document(
        new DOMParser().parseFromString(html)
      );
    }).catch((error) => {
      console.error(error);
      return [];
    });
  }
}
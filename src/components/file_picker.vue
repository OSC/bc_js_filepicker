<template>
  <div :id="modalId" class="modal" tabindex="-1" role="dialog" v-observe-visibility="visibilityChanged">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">File Select</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row">
              <div class="col-sm-5">
                <div class="panel panel-default">
                  <div class="panel-heading">Favorites</div>
                  <ul class="list-group">
                    <li
                      class="list-group-item"
                      v-for="entry in fs_favorites"
                      v-on:dblclick="entryDblClicked(entry, $event)"
                    ><span class="fa fa-folder">&nbsp;</span>{{entry.title}}</li>
                  </ul>
                </div>
              </div>
              <div class="col-sm-7">
                <nav aria-label="breadcrumb">
                  <ol class="breadcrumb">
                    <li :class="slugClass(index)"
                        v-for="(slug, index) in slugs"
                        aria-current="page"><a v-on:click="entryDblClicked({size: 'breadcrumb', path: pathToHere(index)}, $event)">{{slug}}</a>
                    </li>
                  </ol>
                </nav>
                <div class="alert alert-danger" v-if="showError()" role="alert">
                  The following error has occurred: 
                  <code>{{error}}</code><br />
                  If this persists please contact user support.
                </div>
                <div v-else-if="showSpinner()" role="status">
                  <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate spinning">Loading...</span>
                </div>
                <ul class="list-group overflow-auto" v-else="!showSpinner()">
                  <li
                    class="list-group-item"
                    v-for="entry in fs_entries"
                    v-on:click="entryClicked(entry, $event)"
                    v-on:dblclick="entryDblClicked(entry, $event)"
                  ><span :class="iconClasses(entry)">&nbsp;</span>{{entry.name}}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <div type="button" class="btn btn-primary" v-on:click="save" data-dismiss="modal">Select</div>
          <div type="button" class="btn btn-secondary" v-on:click="cancel" data-dismiss="modal">Close</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as pathmod from 'path-browserify';
import Vue from 'vue';
import VueObserveVisibility from 'vue-observe-visibility'

Vue.use(VueObserveVisibility);

/**
 * FilePicker
 *
 * Presents a modal to the user allowing them to select files.
 */
export default {
  props: ['input', 'fs'],
  data: function() {
    return {
      fs_favorites: [],
      fs_entries: [],
      loading: true,
      path: '',
      selected_element: null,
      staged_value: null,
      error: null
    }
  },
  methods: {
    iconClasses: function(entry) {
      return (entry.size === 'dir') ? 'fa fa-folder' : 'fa fa-file';
    },
    showSpinner: function() {
      return this.fs_entries.length === 0 || this.loading;
    },
    showError: function() {
      return !! this.error;
    },
    updateEntries: function(path) {
      let self = this;
      this.loading = true;
      this.error = false;
      this.fs.list_path(path, function(response) {
        if(response.ok) {
          response.json().then(
            (json) => self.updateEntriesSuccess(json, path)
          ).catch(
            () => { self.updateEntriesFailure(response) }
          );
        } else {
          self.updateEntriesFailure(response);
        }
      });
    },
    updateEntriesSuccess: function(json, path) {
      // add fs entries and the back directory
      this.fs_entries = [{
          size: 'dir',
          name: '..'
      }].concat(
        json.files.filter((entry) => { return ! entry.name.startsWith('.') })
        );
      this.loading = false;
      this.error = false;
      this.fs.update_last_location(path);
    },
    updateEntriesFailure: function(response) {
      this.loading = false;

      if(response.bodyUsed) {  // JSON parse failed
        this.error = 'Parsing response failed.'
      } else { // Error message from server e.g. EACCES
        response.text().then((text) => {
          this.error = text;
        });
      }

      console.error(response);
    },
    changeSelection(event) {
      if(this.selected_element) {
        this.selected_element.classList.remove('active');  
      }
      
      this.selected_element = event.target;
      this.selected_element.classList.add('active');
    },
    entryClicked: function(entry, event) {
      this.changeSelection(event);
      this.staged_value = pathmod.resolve(this.path, entry.name);
    },
    entryDblClicked: function(entry, event) {
      if(entry.size && entry.size === 'dir') {
        this.path = pathmod.resolve(this.path, entry.name);
      } else if(entry.size && entry.size === 'breadcrumb') {
        event.preventDefault();
        this.path = entry.path;
      } else {
        this.path = pathmod.resolve(this.path, entry.href);
      }

      this.updateEntries(this.path);
    },
    save: function() {
      this.path = pathmod.dirname(this.staged_value);
      this.input.value = this.staged_value;
    },
    cancel() {
      // TODO
    },
    visibilityChanged: function(isVisible, entry) {
      if(isVisible) {
        this.updateEntries(this.path);
      } else {
        this.cancel();
      }
    },
    slugClass: function(index) {
      return this.last(index) ? 'breadcrumb-item active' : 'breadcrumb-item';
    },
    last: function(index) {
      return index === (this.slugs.length - 1);
    },
    pathToHere: function(index) {
      return pathmod.resolve(...this.path.split(pathmod.sep).slice(0, index + 1));
    }
  },
  mounted: function() {
    this.fs.init()
    this.path = this.fs.last_path();
    // this.staged_value = this.input.value;
    this.updateEntries(this.path);
    this.fs_favorites = this.fs.favorites;
  },
  computed: {
    modalId: function() {
      return (this.input) ? 'modal-for-' + this.input.id : '';
    },
    slugs: function() {
      return this.path.split(pathmod.sep);
    }
  }
}
</script>

<style scoped>
.glyphicon.spinning {
    animation: spin 1s infinite linear;
    -webkit-animation: spin2 1s infinite linear;
}

@keyframes spin {
    from { transform: scale(1) rotate(0deg); }
    to { transform: scale(1) rotate(360deg); }
}

@-webkit-keyframes spin2 {
    from { -webkit-transform: rotate(0deg); }
    to { -webkit-transform: rotate(360deg); }
}
</style>
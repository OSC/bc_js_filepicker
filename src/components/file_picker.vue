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
                <div v-if="showSpinner()" role="status">
                  <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate spinning">Loading...</span>
                </div>
                <ul class="list-group overflow-auto" v-if="!showSpinner()">
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
import jQuery from 'jquery';
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
      original_value: '',
      path: '',
      selected: null,
    }
  },
  methods: {
    iconClasses: function(entry) {
      return (entry.size === 'dir') ? 'fa fa-folder' : 'fa fa-file';
    },
    showSpinner: function() {
      return this.fs_entries.length === 0 || this.loading;
    },
    updateEntries: function(path) {
      let self = this;
      this.loading = true;
      this.fs.list_path(path, function(json) {
        // add fs entries and the back directory
        self.fs_entries = [{
          size: 'dir',
          name: '..'
        }].concat(
          json.files.filter((entry) => { return ! entry.name.startsWith('.') })
          );
        self.loading = false;
        self.fs.update_last_location(path);
      });
    },
    changeSelection(event) {
      if(this.selected) {
        this.selected.classList.remove('active');  
      }
      
      this.selected = event.target;
      this.selected.classList.add('active');
    },
    entryClicked: function(entry, event) {
      this.changeSelection(event);
      this.input.value = pathmod.resolve(this.path, entry.name);
    },
    entryDblClicked: function(entry, event) {
      if(entry.size && entry.size === 'dir') {
        this.path = pathmod.resolve(this.path, entry.name);
        this.updateEntries(this.path);
      } else {
        this.path = pathmod.resolve(this.path, entry.href);
        this.updateEntries(this.path);
      }
    },
    save: function() {
      this.original_value = this.input.value;
    },
    cancel() {
      this.input.value = this.original_value;
    },
    visibilityChanged (isVisible, entry) {
      if(isVisible) {
        this.save();
      } else {
        this.cancel();
      }
    }
  },
  mounted: function() {
    let self = this;
    this.fs.init(() => {
      self.path = self.fs.last_path();
      self.original_value = self.input.value;
      self.updateEntries(self.path);
      self.fs_favorites = self.fs.favorites;
    });
  },
  computed: {
    modalId: function() {
      return (this.input) ? 'modal-for-' + this.input.id : '';
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
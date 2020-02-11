<template>
  <div class="container">
    <div class="form-group">
      <h2>Hubspot configuration</h2>
      <div class="form-group">
        <label for="hubspotAPIKey">Hubspot API Key</label>
        <input
          class="form-control"
          type="text"
          id="hubspotAPIKey"
          placeholder="Type Hubspot API Key here"
          v-model="hubspotApiKey"
        />
      </div>
      <h2>LinkedIn configuration</h2>
      <h2>Google configuration</h2>
      <button @click="saveConfig">Save</button>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import constant from "../const.js";

export default {
  components: {},
  data() {
    return {
      hubspotApiKey: undefined
      // dataset: [],
      // userStoriesPerColumn: [],
      // people: [],
      // selectedPerson: undefined,
      // visibleColumns: [true, true, true, true, true, true],
      // status: constant.STATUS_TYPES,
      // logs: []
    };
  },
  methods: {
    loadConfig: function() {
      debugger;
      chrome.storage.local.get("hubspotApiKey", res => {
        debugger;
        this.hubspotApiKey = res;
      });
    },
    saveConfig: function() {
      chrome.storage.local.set(this.hubspotApiKey);
      debugger;
    }
    // setData: function(data) {
    //   this.dataset = data;
    //   //First we group US by status
    //   let groups = _.groupBy(this.dataset, "Status");
    //   let that = this;
    //   for (let i = 0; i < constant.COLUMN_GROUPS.length; i++) {
    //     this.userStoriesPerColumn[i] = _.sortBy(
    //       concatGroups(constant.COLUMN_GROUPS[i], groups),
    //       "Priority"
    //     );
    //   }
    //   this.$forceUpdate();
    //   function concatGroups(groupIndexes, groups) {
    //     let returnedValue = [];
    //     _.forEach(groupIndexes, groupIndex => {
    //       if (groups[that.status[groupIndex]])
    //         returnedValue = _.concat(
    //           returnedValue,
    //           groups[that.status[groupIndex]]
    //         );
    //     });
    //     return returnedValue;
    //   }
    // },
    // personSelected: function(person) {
    //   this.setData(this.dataset);
    // },
    // setPeople: function(people) {
    //   this.people = people;
    // },
    // hideOverlay: function() {
    //   document
    //     .getElementsByClassName(constant.VIEWPORT_CLASS)[0]
    //     .removeAttribute("style");
    //   document.getElementsByClassName(constant.OVERLAY_CLASS)[0].remove();
    //   document.getElementById(constant.STYLELINK_ID).remove();
    //   document.getElementById(constant.STYLELINK_ID2).remove();
    //   this.requestNotesDownload();
    // },
    // // ---------------------------------
    // // Operations with columns
    // // ---------------------------------
    // isColumnVisible: function(colNumber) {
    //   return this.visibleColumns[colNumber];
    // },
    // toggleColumnVisibility: function(colNumber) {
    //   this.visibleColumns[colNumber] = !this.visibleColumns[colNumber];
    //   this.$forceUpdate();
    // },
    // changeUSStatus: function(event, column) {
    //   if (event.hasOwnProperty("added")) {
    //     let us = event.added.element;
    //     // Notify the change
    //     this.appendLog(
    //       `${
    //         us[constant.COL_USERSTORYREFERENCE]
    //       } changed the status to ${column}`
    //     );
    //   }
    //   this.userStoriesPerColumn[column] = _.sortBy(
    //     this.userStoriesPerColumn[column],
    //     "Priority"
    //   );
    //   this.$forceUpdate();
    // },
    // // ---------------------------------
    // // Operations with contextual menu
    // // ---------------------------------
    // changeAssignee: function(data, person) {
    //   let us;
    //   if (data && data.usr) {
    //     this.appendLog(`${data.usr} changed the assignee to ${person}`);
    //     if (data.parent) {
    //       let parentUS = _.head(
    //         _.filter(this.dataset, [
    //           constant.COL_USERSTORYREFERENCE,
    //           data.parent
    //         ])
    //       );
    //       us = _.find(parentUS.subtasks, [
    //         constant.COL_USERSTORYREFERENCE,
    //         data.usr
    //       ]);
    //     } else {
    //       us = _.head(
    //         _.filter(this.dataset, [constant.COL_USERSTORYREFERENCE, data.usr])
    //       );
    //     }
    //     us.Assignee = person;
    //   }
    // },
    // cancelSubtaskFromContextMenu: function(data) {
    //   if (data && data.usr && data.parent) {
    //     this.appendLog(`Cancel subtask ${data.usr}`);
    //     let parentUS = _.head(
    //       _.filter(this.dataset, [constant.COL_USERSTORYREFERENCE, data.parent])
    //     );
    //     let us = _.find(parentUS.subtasks, [
    //       constant.COL_USERSTORYREFERENCE,
    //       data.usr
    //     ]);
    //     us.Status = "Cancelled";
    //   }
    // },
    // addSubtaskFromContextMenu: function(data) {
    //   console.log(constant.MSG_SHOWNEWSUBTASK);
    //   if (data && data.usr) {
    //     this.$root.$emit(constant.MSG_SHOWNEWSUBTASK, data.usr);
    //   }
    // },
    // addNotesFromContextMenu: function(data) {
    //   console.log(constant.MSG_SHOWNEWNOTE);
    //   if (data && data.usr) {
    //     this.$root.$emit(constant.MSG_SHOWNEWNOTE, data.usr);
    //   }
    // },
    // openContextMenu: function(event, usr) {
    //   let subtask =
    //     event.target.getAttribute("usr") ||
    //     event.target.parentNode.getAttribute("usr");
    //   let parent =
    //     event.target.getAttribute("pusr") ||
    //     event.target.parentNode.getAttribute("pusr");
    //   if (subtask) {
    //     this.$refs.menu.open(event, {
    //       usr: subtask,
    //       subtask: true,
    //       parent: parent
    //     });
    //   } else {
    //     this.$refs.menu.open(event, { usr: usr, subtask: false, parent: null });
    //   }
    // },
    // // ---------------------------------
    // // Log operations
    // // ---------------------------------
    // appendLog: function(text) {
    //   this.logs.push(`${text}\r\n`);
    // },
    // requestNotesDownload: function() {
    //   //The last line of log will contain the USs serialized as JSON for tracking purposes
    //   this.appendLog(JSON.stringify(this.userStoriesPerColumn));
    //   //chrome.download API only is accesible at background.js, so we pass the signal with parameters
    //   this.$root.$emit(constant.MSG_DOWNLOADNOTES, {
    //     fileName: `${
    //       new Date().toISOString().split("T")[0]
    //     } ${window.location.search.slice(-5)}.txt`,
    //     fileContents: this.logs
    //   });
    // }
  },
  mounted() {
    this.loadConfig();
    // this.$root.$on(constant.MSG_CREATENEWSUBTASK, data => {
    //   let parentUS = _.head(
    //     _.filter(this.dataset, [constant.COL_USERSTORYREFERENCE, data.usr])
    //   );
    //   parentUS.subtasks.push({
    //     "Parent User Story": data.pusr,
    //     Title: data.text,
    //     "Record Type": "Subtask"
    //   });
    //   this.appendLog(`Subtask '${data.text}' created inside of ${data.usr}`);
    //   this.$forceUpdate();
    // });
    // this.$root.$on(constant.MSG_APPENDLOG, data => {
    //   this.appendLog(data);
    // });
    // this.$root.$on(constant.MSG_CREATENEWNOTE, data => {
    //   this.appendLog(`${data.usr} notes: ${data.text}`);
    // });
  }
};
</script>

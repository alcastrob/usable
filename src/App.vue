<template>
  <div class="ac:overlay">
    <div class="container">
      <div class="row">
        <div class="col-6 text-left">
          Filter by person:
          <select v-model="selectedPerson" @change="personSelected($event)">
            <option v-for="person in people" :value="person" :key="person">{{ person }}</option>
          </select>
        </div>
        <div class="col-6 text-right">
          <button @click="hideOverlay()">
            <i class="fas fa-times-circle"></i> Close
          </button>
        </div>
      </div>
    </div>
    <div class="bg-white px-3">
      <table style="width: 100%; table-layout: fixed;" class="px-3">
        <tr>
          <th class="align-top text-center p-3 small" :class="{ invisible: !isColumnVisible(0) }">
            Draft / Backlog / Backburner / A.A.
            <i
              class="fas fa-ban pl-1"
              @click="toggleColumnVisibility(0)"
            ></i>
          </th>
          <th class="align-top text-center p-3 small" :class="{ invisible: !isColumnVisible(1) }">
            Approved
            <i class="fas fa-ban pl-1" @click="toggleColumnVisibility(1)"></i>
          </th>
          <th class="align-top text-center p-3 small" :class="{ invisible: !isColumnVisible(2) }">
            In Progress / Blocked
            <i class="fas fa-ban pl-1" @click="toggleColumnVisibility(2)"></i>
          </th>
          <th class="align-top text-center p-3 small" :class="{ invisible: !isColumnVisible(3) }">
            Ready for testing / Code Review
            <i
              class="fas fa-ban pl-1"
              @click="toggleColumnVisibility(3)"
            ></i>
          </th>
          <th class="align-top text-center p-3 small" :class="{ invisible: !isColumnVisible(4) }">
            Completed / Tested in B.P. / Released
            <i
              class="fas fa-ban pl-1"
              @click="toggleColumnVisibility(4)"
            ></i>
          </th>
          <th class="align-top text-center p-3 small" :class="{ invisible: !isColumnVisible(5) }">
            Rejected / Cancelled
            <i class="fas fa-ban pl-1" @click="toggleColumnVisibility(5)"></i>
          </th>
        </tr>
        <tr valign="top">
          <td :class="{ invisible: !isColumnVisible(0) }">
            <draggable
              :list="userStoriesPerColumn[0]"
              group="us"
              @change="changeUSStatus($event, 'Draft')"
            >
              <div
                v-for="usData in userStoriesPerColumn[0]"
                :key="usData['User Story Reference']"
                @contextmenu.prevent="openContextMenu($event, usData['User Story Reference'])"
              >
                <us :usData="usData" :filter="selectedPerson"></us>
              </div>
            </draggable>
          </td>
          <td :class="{ invisible: !isColumnVisible(1) }">
            <draggable
              :list="userStoriesPerColumn[1]"
              group="us"
              @change="changeUSStatus($event, 'Approved')"
            >
              <div
                v-for="usData in userStoriesPerColumn[1]"
                :key="usData['User Story Reference']"
                @contextmenu.prevent="openContextMenu($event, usData['User Story Reference'])"
              >
                <us :usData="usData" :filter="selectedPerson"></us>
              </div>
            </draggable>
          </td>
          <td :class="{ invisible: !isColumnVisible(2) }">
            <draggable
              :list="userStoriesPerColumn[2]"
              group="us"
              @change="changeUSStatus($event, 'In Progress')"
            >
              <div
                v-for="usData in userStoriesPerColumn[2]"
                :key="usData['User Story Reference']"
                @contextmenu.prevent="openContextMenu($event, usData['User Story Reference'])"
              >
                <us :usData="usData" :filter="selectedPerson"></us>
              </div>
            </draggable>
          </td>
          <td :class="{ invisible: !isColumnVisible(3) }">
            <draggable
              :list="userStoriesPerColumn[3]"
              group="us"
              @change="changeUSStatus($event, 'Ready for testing')"
            >
              <div
                v-for="usData in userStoriesPerColumn[3]"
                :key="usData['User Story Reference']"
                @contextmenu.prevent="openContextMenu($event, usData['User Story Reference'])"
              >
                <us :usData="usData" :filter="selectedPerson"></us>
              </div>
            </draggable>
          </td>
          <td :class="{ invisible: !isColumnVisible(4) }">
            <draggable
              :list="userStoriesPerColumn[4]"
              group="us"
              @change="changeUSStatus($event, 'Completed')"
            >
              <div
                v-for="usData in userStoriesPerColumn[4]"
                :key="usData['User Story Reference']"
                @contextmenu.prevent="openContextMenu($event, usData['User Story Reference'])"
              >
                <us :usData="usData" :filter="selectedPerson"></us>
              </div>
            </draggable>
          </td>
          <td :class="{ invisible: !isColumnVisible(5) }">
            <draggable
              :list="userStoriesPerColumn[5]"
              group="us"
              @change="changeUSStatus($event, 'Rejected')"
            >
              <div
                v-for="usData in userStoriesPerColumn[5]"
                :key="usData['User Story Reference']"
                @contextmenu.prevent="($event.target.getAttribute('usr') || $event.target.parentNode.getAttribute('usr')) ? this.$refs.menu.open($event, { usr: $event.target.getAttribute('usr') || $event.target.parentNode.getAttribute('usr'), subtask: true, parent: $event.target.getAttribute('pusr') || $event.target.parentNode.getAttribute('pusr') }) : this.$refs.menu.open(event, { usr: usData['User Story Reference'], subtask: false, parent: null })"
              >
                <us :usData="usData" :filter="selectedPerson"></us>
              </div>
            </draggable>
          </td>
        </tr>
      </table>
    </div>
    <vue-context ref="menu">
      <template slot-scope="child" v-if="child.data">
        <li class="v-context__sub small">
          <a>
            Assignee
            <i class="fas fa-caret-right ml-1"></i>
          </a>
          <ul class="v-context">
            <li v-for="person in people" :key="'assig' + person">
              <a @click.prevent="changeAssignee(child.data, person)">{{ person }}</a>
            </li>
          </ul>
        </li>
        <li class="v-context__sub small">
          <a
            href="#"
            @click.prevent="addSubtaskFromContextMenu(child.data)"
            class="small"
          >Add subtask</a>
        </li>
        <li :class="{ invisible: !child.data.subtask }">
          <a
            href="#"
            @click.prevent="cancelSubtaskFromContextMenu(child.data)"
            class="small"
          >Cancel subtask</a>
        </li>
        <li class="v-context__sub small">
          <a href="#" @click.prevent="addNotesFromContextMenu(child.data)" class="small">Add notes</a>
        </li>
      </template>
    </vue-context>
  </div>
</template>

<script>
import us from "./US";
import _ from "lodash";
import draggable from "vuedraggable";
import { VueContext } from "vue-context";
import constant from "./const.js";

export default {
  components: {
    us,
    draggable,
    VueContext
  },
  data() {
    return {
      dataset: [],
      userStoriesPerColumn: [],
      people: [],
      selectedPerson: undefined,
      visibleColumns: [true, true, true, true, true, true],
      status: constant.STATUS_TYPES,
      logs: []
    };
  },
  methods: {
    setData: function(data) {
      this.dataset = data;

      //First we group US by status
      let groups = _.groupBy(this.dataset, "Status");
      let that = this;

      for (let i = 0; i < constant.COLUMN_GROUPS.length; i++) {
        this.userStoriesPerColumn[i] = _.sortBy(
          concatGroups(constant.COLUMN_GROUPS[i], groups),
          "Priority"
        );
      }

      this.$forceUpdate();

      function concatGroups(groupIndexes, groups) {
        let returnedValue = [];
        _.forEach(groupIndexes, groupIndex => {
          if (groups[that.status[groupIndex]])
            returnedValue = _.concat(
              returnedValue,
              groups[that.status[groupIndex]]
            );
        });
        return returnedValue;
      }
    },
    personSelected: function(person) {
      this.setData(this.dataset);
    },
    setPeople: function(people) {
      this.people = people;
    },
    hideOverlay: function() {
      document
        .getElementsByClassName(constant.VIEWPORT_CLASS)[0]
        .removeAttribute("style");
      document.getElementsByClassName(constant.OVERLAY_CLASS)[0].remove();
      document.getElementById(constant.STYLELINK_ID).remove();
      document.getElementById(constant.STYLELINK_ID2).remove();
      this.requestNotesDownload();
    },
    // ---------------------------------
    // Operations with columns
    // ---------------------------------
    isColumnVisible: function(colNumber) {
      return this.visibleColumns[colNumber];
    },
    toggleColumnVisibility: function(colNumber) {
      this.visibleColumns[colNumber] = !this.visibleColumns[colNumber];
      this.$forceUpdate();
    },
    changeUSStatus: function(event, column) {
      if (event.hasOwnProperty("added")) {
        let us = event.added.element;
        // Notify the change
        this.appendLog(
          `${
            us[constant.COL_USERSTORYREFERENCE]
          } changed the status to ${column}`
        );
      }
      this.userStoriesPerColumn[column] = _.sortBy(
        this.userStoriesPerColumn[column],
        "Priority"
      );
      this.$forceUpdate();
    },
    // ---------------------------------
    // Operations with contextual menu
    // ---------------------------------
    changeAssignee: function(data, person) {
      let us;
      if (data && data.usr) {
        this.appendLog(`${data.usr} changed the assignee to ${person}`);
        if (data.parent) {
          let parentUS = _.head(
            _.filter(this.dataset, [
              constant.COL_USERSTORYREFERENCE,
              data.parent
            ])
          );
          us = _.find(parentUS.subtasks, [
            constant.COL_USERSTORYREFERENCE,
            data.usr
          ]);
        } else {
          us = _.head(
            _.filter(this.dataset, [constant.COL_USERSTORYREFERENCE, data.usr])
          );
        }
        us.Assignee = person;
      }
    },
    cancelSubtaskFromContextMenu: function(data) {
      if (data && data.usr && data.parent) {
        this.appendLog(`Cancel subtask ${data.usr}`);
        let parentUS = _.head(
          _.filter(this.dataset, [constant.COL_USERSTORYREFERENCE, data.parent])
        );
        let us = _.find(parentUS.subtasks, [
          constant.COL_USERSTORYREFERENCE,
          data.usr
        ]);
        us.Status = "Cancelled";
      }
    },
    addSubtaskFromContextMenu: function(data) {
      console.log(constant.MSG_SHOWNEWSUBTASK);
      if (data && data.usr) {
        this.$root.$emit(constant.MSG_SHOWNEWSUBTASK, data.usr);
      }
    },
    addNotesFromContextMenu: function(data) {
      console.log(constant.MSG_SHOWNEWNOTE);
      if (data && data.usr) {
        this.$root.$emit(constant.MSG_SHOWNEWNOTE, data.usr);
      }
    },
    openContextMenu: function(event, usr) {
      let subtask =
        event.target.getAttribute("usr") ||
        event.target.parentNode.getAttribute("usr");
      let parent =
        event.target.getAttribute("pusr") ||
        event.target.parentNode.getAttribute("pusr");
      if (subtask) {
        this.$refs.menu.open(event, {
          usr: subtask,
          subtask: true,
          parent: parent
        });
      } else {
        this.$refs.menu.open(event, { usr: usr, subtask: false, parent: null });
      }
    },
    // ---------------------------------
    // Log operations
    // ---------------------------------
    appendLog: function(text) {
      this.logs.push(`${text}\r\n`);
    },
    requestNotesDownload: function() {
      //The last line of log will contain the USs serialized as JSON for tracking purposes
      this.appendLog(JSON.stringify(this.userStoriesPerColumn));
      //chrome.download API only is accesible at background.js, so we pass the signal with parameters
      this.$root.$emit(constant.MSG_DOWNLOADNOTES, {
        fileName: `${
          new Date().toISOString().split("T")[0]
        } ${window.location.search.slice(-5)}.txt`,
        fileContents: this.logs
      });
    }
  },
  mounted() {
    this.$root.$on(constant.MSG_CREATENEWSUBTASK, data => {
      let parentUS = _.head(
        _.filter(this.dataset, [constant.COL_USERSTORYREFERENCE, data.usr])
      );
      parentUS.subtasks.push({
        "Parent User Story": data.pusr,
        Title: data.text,
        "Record Type": "Subtask"
      });
      this.appendLog(`Subtask '${data.text}' created inside of ${data.usr}`);
      this.$forceUpdate();
    });
    this.$root.$on(constant.MSG_APPENDLOG, data => {
      this.appendLog(data);
    });
    this.$root.$on(constant.MSG_CREATENEWNOTE, data => {
      this.appendLog(`${data.usr} notes: ${data.text}`);
    });
  }
};
</script>

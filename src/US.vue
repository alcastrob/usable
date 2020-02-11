<template>
  <div
    class="card p0 small mx-1"
    @click="touchCard($event)"
    :class="{ bordered: this.usData.isTouched }"
    :style="filterStyle()"
  >
    <div class="card-header p0 truncate" :style="setBackground(usData)">
      <i class="fas fa-bug" v-if="usData['Record Type'] === 'Bug'" title="Bug"></i>
      <i
        class="fas fa-search"
        v-if="usData['Record Type'] === 'Investigation'"
        title="Investigation"
      ></i>
      <i class="fas fa-file-alt" v-if="usData['Record Type'] === 'User Story'" title="User Story"></i>
      {{ usData.Title }}
    </div>
    <div class="card-body p0" :class="{ 'bg-warning': usData.Status === 'In Progress - Blocked' }">
      <a
        href="#"
        @click="openLink(usData['User Story Reference URL'])"
      >{{ usData['User Story Reference'] }}</a>
      &nbsp;
      <span v-if="usData.subtasks.length === 0">{{ usData.Assignee }}</span>
      <br />
      <span>Priority: {{ usData.Priority === 1000 ? '' : usData.Priority }}</span>
      &nbsp;
      <span>Act. Points: {{ usData['Actual Points'] }}</span>
      <div
        v-for="subtask in usData.subtasks"
        :key="subtask['User Story Reference']"
        class="card p0 small mx-1"
      >
        <div
          class="card-header p0 truncate"
          :usr="subtask['User Story Reference']"
          :pusr="usData['User Story Reference']"
        >
          <span
            :title="subtask.Assignee"
            :style="setSubtaskStatus(subtask.Status)"
          >[{{ startingLetters(subtask.Assignee) }}]</span>
          <a
            href="#"
            @click="openLink(subtask['User Story Reference URL'])"
            :style="(subtask.Status==='Cancelled' || subtask.Status==='Rejected')?'text-decoration: line-through':''"
          >{{ subtask.Title }}</a>
        </div>
        <div class="card-body p0" v-if="subtask.Status === 'In Progress - Blocked'">
          <div class="bg-danger text-white text-center mt-2">BLOCKED</div>
        </div>
      </div>
      <input
        class="form-control p0 small ml-1 mr-2"
        type="text"
        placeholder="subtask's title"
        v-model="newSubtaskText"
        ref="newSubtaskText"
        @keyup.enter="createSubtask"
        @blur="createSubtask"
        :class="{invisible: !newSubtaskVisible}"
      />

      <div
        class="bg-danger text-white text-center mt-2"
        v-if="usData.Status === 'In Progress - Blocked'"
      >BLOCKED</div>
      <div v-if="usData['Status Notes']" class="small truncate">
        <i class="fas fa-info-circle"></i>
        {{usData['Status Notes']}}
      </div>
    </div>
    <div :class="{invisible: !newNoteVisible}">
      <span class="fas fa-comments"></span>
      <input
        class="form-control p0 small ml-1"
        type="text"
        placeholder="Notes"
        v-model="notes"
        ref="notes"
        @keyup.enter="createNote"
        @blur="createNote"
      />
    </div>
    <!-- card-body -->
  </div>
  <!-- card -->
</template>
<script>
import { VueContext } from "vue-context";
import constant from "./const.js";

export default {
  name: "us",
  components: {
    VueContext
  },
  props: {
    usData: {
      type: Object,
      required: true
    },
    filter: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      newSubtaskVisible: false,
      newSubtaskText: "",
      newNoteVisible: false,
      notes: ""
    };
  },
  methods: {
    setBackground: function(us) {
      const bgColors = [
        "#214F7F",
        "#28609B",
        "#4F7CAD",
        "#7699BF",
        "#9DB6D1",
        "#C4D3E3",
        "#EBF0F5"
      ];

      const txColors = ["#FFFFFF", "#000000"];

      let priority = parseInt(us.Priority);
      let bgIndex = priority > 0 && priority < 7 ? priority - 1 : 6;
      let txIndex = priority > 0 && priority < 4 ? 0 : 1;
      return `background-color: ${bgColors[bgIndex]}; color: ${txColors[txIndex]}`;
    },
    touchCard: function(event) {
      if (event.ctrlKey || event.metaKey) {
        this.$root.$emit(
          constant.MSG_APPENDLOG,
          `${this.usData[constant.COL_USERSTORYREFERENCE]} touched`
        );
        this.usData.isTouched = true;
      }
    },
    startingLetters(words) {
      if (!words) return " ";
      return words.match(/\b(\w)/g).join("");
    },
    setSubtaskStatus(status) {
      switch (status) {
        case "In Progress":
          return "background-color: #FFFF00;";
        case "In Progress - Blocked":
          return "background-color: #FF7070;";
        case "Ready for testing":
        case "Code Review":
        case "Completed":
          return "background-color: #72EA64;";
        case "Cancelled":
        case "Rejected":
          return "text-decoration: line-through;";
      }
    },
    filterStyle: function() {
      let subtasks = _.filter(this.usData.subtasks, [
        constant.COL_ASSIGNEE,
        this.filter
      ]);
      if (
        this.filter &&
        this.filter !== this.usData.Assignee &&
        subtasks.length === 0
      ) {
        return "display: none;";
      } else {
        return "";
      }
    },
    openLink: function(url) {
      window.open(url, "_blank");
    },
    // ---------------------------------
    // Operations with new subtask
    // ---------------------------------
    createSubtask() {
      if (this.newSubtaskText !== "") {
        this.$root.$emit(constant.MSG_CREATENEWSUBTASK, {
          usr: this.usData[constant.COL_USERSTORYREFERENCE],
          text: this.newSubtaskText
        });
      }
      this.newSubtaskText = "";
      this.newSubtaskVisible = false;
    },
    // ---------------------------------
    // Operations with notes
    // ---------------------------------
    createNote() {
      if (this.notes !== "") {
        this.$root.$emit(constant.MSG_CREATENEWNOTE, {
          usr: this.usData[constant.COL_USERSTORYREFERENCE],
          text: this.notes
        });
      }
    }
  },
  mounted() {
    this.$root.$on(constant.MSG_SHOWNEWSUBTASK, usr => {
      if (usr === this.usData[constant.COL_USERSTORYREFERENCE]) {
        this.newSubtaskVisible = true;
        this.$refs.newSubtaskText.focus();
      }
    });
    this.$root.$on(constant.MSG_SHOWNEWNOTE, usr => {
      if (usr === this.usData[constant.COL_USERSTORYREFERENCE]) {
        this.newNoteVisible = true;
        this.$refs.newNote.focus();
      }
    });
  }
};
</script>

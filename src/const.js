'use strict'

export default Object.freeze({
  TABLE_CLASS: 'slds-table forceRecordLayout slds-table--header-fixed slds-table--edit slds-table--bordered resizable-cols slds-table--resizable-cols uiVirtualDataTable',
  OVERLAY_CLASS: 'ac:overlay',
  STYLELINK_ID: 'ac:style',
  STYLELINK_ID2: 'ac:style2',
  VIEWPORT_CLASS: 'viewport',
  COL_PARENTUSERSTORY: 'Parent User Story',
  COL_PARENTUSERSTORY_URL: 'Parent User Story URL',
  COL_USERSTORYREFERENCE: 'User Story Reference',
  COL_USERSTORYREFERENCE_URL: 'User Story Reference URL',
  COL_PRIORITY: 'Priority',
  COL_ASSIGNEE: 'Assignee',
  REQUIRED_COLUMNS: [
    'User Story Reference',
    'Parent User Story',
    'Title',
    'Actual Points',
    'Record Type',
    'Priority',
    'Assignee',
    'Status',
    'Status Notes'
  ],
  STATUS_TYPES: [
    "Draft", //0
    "Backlog", //1
    "Backburner", //2
    "Awaiting Approval", //3
    "Approved", //4
    "In Progress", //5
    "In Progress - Blocked", //6
    "Ready for testing", //7
    "Code Review", //8
    "Completed", //9
    "Tested in Base Package", //10
    "Released", //11
    "Cancelled", //12
    "Rejected" //13
  ],
  COLUMN_GROUPS: [
    [0, 1, 2, 3],
    [4],
    [5, 6],
    [7, 8],
    [9, 10, 11],
    [12, 13]
  ],
  MSG_DOWNLOADNOTES: 'downloadNotes',
  MSG_CREATENEWSUBTASK: 'createNewSubtask',
  MSG_SHOWNEWSUBTASK: 'showNewSubtask',
  MSG_APPENDLOG: 'appendLog',
  MSG_CREATENEWNOTE: 'createNewNote',
  MSG_SHOWNEWNOTE: 'showNewNote'
})
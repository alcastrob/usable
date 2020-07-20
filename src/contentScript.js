'use strict'

import _ from 'lodash'
import Vue from 'vue'
import App from './App'
import constant from './const.js'


// Event injection must be done in this file
// There's no access to 'this'.

//Set up the message response
chrome.runtime.onMessage.addListener(function (request) {
  switch (request.type) {
    case 'extensionButtonPressed':
      let missingColumns = missingColumnsInTable();
      if (missingColumns) {
        console.log(`Missing columns: ${missingColumns}`)
      }
      let tableData = parseTable()
      let people = _.map(_.uniqBy(tableData, 'Assignee'), 'Assignee')
      let data = sortByPriority(connectSubtasks(tableData))
      htmlInjection(data, people)
      break
  }
})

function htmlInjection(data, people) {
  let foundOverlays = document.getElementsByClassName(constant.OVERLAY_CLASS)
  let foundViewports = document.getElementsByClassName(constant.VIEWPORT_CLASS)

  // THe order of these operation in quite importatn in order to make the injected code work as expected.
  if (foundOverlays.length === 0) {
    // First we inject the <div> where all the vue page is going to be loaded
    const element = document.body.firstChild
    const anchor = document.createElement('DIV')
    document.body.insertBefore(anchor, element)

    // Now we inject the vue page
    const vuePage = new Vue({
      el: anchor,
      render: h => h(App)
    })
    vuePage.$children[0].setData(data)
    vuePage.$children[0].setPeople(people)
    //Refresh the foundOverlays with the new div
    foundOverlays = document.getElementsByClassName(constant.OVERLAY_CLASS)

    //chrome.download API only is accesible at background.js, so we pass the signal with parameters
    vuePage.$root.$on('downloadNotes', data => {
      chrome.runtime.sendMessage({
        type: 'downloadNotes',
        data: data
      });
    })
  }

  if (foundViewports.length === 1) {
    foundViewports[0].setAttribute('style', 'visibility: hidden!important;')
  }

  if (foundOverlays.length === 1) {
    foundOverlays[0].setAttribute(
      'style',
      'position: fixed; left: 0; top: 0; width: 100%; height: 100%; z-index: 101;overflow-y: scroll;'
    )
  }

  //This <link> must be regenerated on every iteration
  const linkElement = document.createElement('LINK')
  linkElement.setAttribute('href', 'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css')
  linkElement.setAttribute('rel', 'stylesheet')
  linkElement.setAttribute('integrity', 'sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh')
  linkElement.setAttribute('crossorigin', 'anonymous')
  linkElement.setAttribute('id', constant.STYLELINK_ID)
  document.head.append(linkElement)

  const linkElement2 = document.createElement('LINK')
  linkElement2.setAttribute('href', 'https://use.fontawesome.com/releases/v5.0.7/css/all.css')
  linkElement2.setAttribute('rel', 'stylesheet')
  linkElement2.setAttribute('id', constant.STYLELINK_ID2)
  document.head.append(linkElement2)

  const styleElement = document.createElement('STYLE')
  styleElement.setAttribute('type', 'text/css')
  styleElement.innerHTML =
    '.bordered { border: 3px dashed red;} .p0 {padding: 5px 5px 5px 5px;} .small {font-size: 0.8rem} .tableCol {width: 16%;} .truncate {  width: 150 px; white-space: nowrap; overflow: hidden;text-overflow: ellipsis;} .truncate:hover {overflow: visible; white-space: normal;} .invisible { display: none; }' +
    '.v-context,.v-context ul{background-color:#fff;background-clip:padding-box;border-radius:.25rem;border:1px solid rgba(0,0,0,.15);box-shadow:0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);display:block;margin:0;padding:10px 0;min-width:10rem;z-index:1500;position:fixed;list-style:none;box-sizing:border-box;max-height:calc(100% - 50px);overflow-y:auto}.v-context>li,.v-context ul>li{margin:0;position:relative}.v-context>li>a,.v-context ul>li>a{display:block;padding:.5rem 1.5rem;font-weight:400;color:#212529;text-decoration:none;white-space:nowrap;background-color:transparent;border:0}.v-context>li>a:focus,.v-context>li>a:hover,.v-context ul>li>a:focus,.v-context ul>li>a:hover{text-decoration:none;color:#212529;background-color:#f8f9fa}.v-context:focus,.v-context>li>a:focus,.v-context ul:focus,.v-context ul>li>a:focus{outline:0}.v-context__sub>a:after{float:right;padding-left:1rem}.v-context__sub>ul{display:none}'
  document.head.append(styleElement)
}

// This function verifies if the expected columns in the HTML table are present or not
function missingColumnsInTable() {
  let table = document.getElementsByClassName(constant.TABLE_CLASS)
  if (table) {
    let titles = _.map(table[0].tHead.firstChild.children, 'title')
    return _.difference(constant.REQUIRED_COLUMNS, titles)
  }
  return ['NO TABLE']
}

// This function extract the data from the table
function parseTable() {
  let data = []
  let table = document.getElementsByClassName(constant.TABLE_CLASS)
  if (table) {
    let titles = _.map(table[0].tHead.firstChild.children, 'title')
    let rows = table[0].tBodies[0].children

    for (let row of rows) {
      let entry = {
        subtasks: []
      }
      for (var position = 0; position < row.childElementCount; position++) {
        entry[titles[position]] = row.cells[position].innerText
        if (titles[position] === constant.COL_USERSTORYREFERENCE) {
          extractLink(entry, constant.COL_USERSTORYREFERENCE_URL, row, position)
        } else if (titles[position] === constant.COL_PARENTUSERSTORY) {
          extractLink(entry, constant.COL_PARENTUSERSTORY_URL, row, position)
        } else if (titles[position] === constant.COL_PRIORITY) {
          entry[titles[position]] = entry[titles[position]] === '' ? 1000 : parseInt(entry[titles[position]])
        }
      }
      delete entry['']
      entry['isTouched'] = false;
      data.push(entry)
    }
  }
  return data

  function extractLink(entry, colName, row, position) {
    let url = row.cells[position].getElementsByTagName('a')
    if (url.length === 1) {
      entry[colName] = url[0].href
    }
  }
}

function connectSubtasks(listUS) {
  let subTasks = _.filter(listUS, constant.COL_PARENTUSERSTORY)
  for (let subTask of subTasks) {
    let parentUSNumber = subTask[constant.COL_PARENTUSERSTORY]
    let parentUS = _.find(listUS, {
      'User Story Reference': parentUSNumber
    })
    if (parentUS) {
      parentUS.subtasks.push(subTask)
    } else {
      console.log(
        `Subtask ${subTask[constant.COL_USERSTORYREFERENCE]}'s parent (${subTask[constant.COL_PARENTUSERSTORY]}) is not included in the sprint.`
      )
    }
  }
  return _.filter(listUS, {
    'Parent User Story': ''
  })
}

function sortByPriority(listUS) {
  return _.reverse(_.sortBy(listUS, constant.COL_PRIORITY))
}
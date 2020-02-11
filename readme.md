# Better APO dailies Chrome extension

A help for the daily meetings using SF

## Installation

First of all, you need to install npm in your computer in order to debug or build this extension. You can find the packege for you platform (and the instructions to install it) here:

https://nodejs.org/es/download/

Once downloaded and installed, you cna build the extension going to the base path of the project and executing the following command:

`npm run build`

This will build the executable version of the extension, putting the files in the /dist directory. Once compiled, you will need to open your Chrome instance, and type in the url box

[chrome://extensions](chrome://extensions)

This will open the Chrome extension pages. There you will need check that the "Developer mode" is active. In addition to that, click in the "Load unpacked" buttom, and select the /dist directory in which the extension was built. Click OK, and now the extension should be loaded in your browser.
You can also prepare the extension to be debugged and reloaded automatically in the browser whenever a change is made in the code. In that case, you need to repeat the build and load process, but with the following command:

`npm run watch:dev`

Further details can be found in the package.json file.

## Usage

The extension is only working in a User Story list page (no reports, sorry). The underlaying page must contain a list of US with the following columns:

- User Story Reference
- Parent User Story
- Title
- Actual Points
- Record Type
- Priority
- Assignee
- Status
- Status Notes

If the page contains more rows that are not originally displayed (loaded in the DOM), you will need to scroll down and ensure all the info is loaded before trying to use the extension.

Once everything is loaded, click on the extension icon. An overlay will show up over the page. A filter bar on top and a kanban panel covering most part of the page area. The filter will show or hide user stories based on the asignee of the different US.

You can move the US between the different states, change the assigment or even add subtask. In addition to that, you can mark the US as commented (clicking overt them pressing [Ctrl] or [Option] key)

When you close the overlay, a file is downloaded. This file will contain all the US touched or modified, and a full JSON dump of the information extracted from the SF page and used to render everything (could be useful to debug or track changes between days).

## Security Disclaimer

All the information shown in the extension is infer directly of the underlying page. No information at all (except the US status names and the required field names) are hardcoded in the code, or exposed outisde of the organization.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

Version 1.0.0 Initial version

## Credits

Lead Developer - Angel Castro (alcastro)

## License

The MIT License (MIT)

Copyright (c) 2015 Chris Kibble

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

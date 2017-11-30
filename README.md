# Tabletop

_Desktop app built on Electron and vanilla Javascript to access the Bloc Educational API._

Tabletop offers easy functionality with rainbow-colored good vibes. Students can send messages, submit projects, and view mentor schedules.

#### Build Frameworks

- [Electron](https://electron.atom.io)
- [Chromium](https://www.chromium.org)
- [Node.js](https://nodejs.org)
- [vanilla Javascript](https://www.javascript.com/)

### Project Objectives

- Students can log in to the Bloc Educational system.
- Students can view roadmaps.
- Students can look up individual project guidelines.
- Students can check and send messages.
- Students can submit projects.
- Students can view mentor schedules and claim a mentoring time slot.

### Setup

A development version of this app can be run by cloning the repository, installing dependencies, then running `Electron`'s default task.

```
$ git clone https://github.com/jestann/tabletop.git <tabletop>
$ npm install
$ electron .
```

This opens a local instance of Chrome using `Chromium` in which to render the app.

### Configuration Variables

**Note:** This app requires valid student user credentials for the Bloc API in order to generate the app dashboard.

A link to a test-drive version of this app without required credentials is below.

### File Structure

This is a minimalist app built to visualize an educational API.

```
├── classes
│   ├── tabletopAPI.js
│   └── tabletopView.js
├── scripts
│   └── renderer.js
├── styles
│   └── main.css
├── .gitignore
├── index.html
├── LICENSE.md
├── main.js
├── package.json
└── README.md
```

It has a minimalist file structure.

- `classes/tabletopAIP.js` defines customized fetch methods for the Bloc API. 
- `classes/tabletopView.js` defines custom view methods for these calls.
- `scripts/renderer.js` is called by `Electron` from `index.html` when rendering the app in the generated instance of Chrome.
- `styles/main.css` defines styling for the app.
- `index.html` holds the html structure of the app interface.
- `main.js` configures the behavior of the `Electron` app.

### Implementation

A test-drive web rendering of the app (no authentication) can be viewed [here](https://jestann-tabletop.herokuapp.com).

### Case Study

A description of the project case study exists [here](http://jessbird.me/portfolio/tabletop.html).

### Visuals

#### Main Dashboard

<img alt="tabletop main 1" src="images/main-1.png" width="75%" align="center">
<img alt="tabletop main 2" src="images/main-2.png" width="75%" align="center">
<img alt="tabletop main 3" src="images/main-3.png" width="75%" align="center">

#### Scheduling

<img alt="tabletop scheduling" src="images/scheduling.png" width="75%" align="center">
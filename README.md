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
- Students can view course roadmaps.
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

This opens a local instance of Chrome using `Electron` and `Chromium` in which it renders the app.

### Configuration Variables

**Note:** This app requires valid student user credentials for the Bloc API in order to generate the app dashboard.

### File Structure

This is a minimalist app built to visualize an educational API.

```
├── classes
│   ├── tabletopAPI.js
│   └── tabletopView.js
├── images
│   └── ...
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

- `classes/tabletopAIP.js` defines customized fetch methods against the Bloc API. 
- `classes/tabletopView.js` defines custom view methods for these calls in Javascript.
- `scripts/renderer.js` is called by `Electron` from `index.html` when rendering the app in the generated instance of Chrome.
- `styles/main.css` defines styling for the app.
- `index.html` holds the html structure of the app interface.
- `main.js` configures the behavior of the `Electron` app.

### Visuals

#### Main Tabletop

<img alt="tabletop main 1" src="/images/top-1.png" width="75%" align="center">
<img alt="tabletop main 2" src="/images/top-2.png" width="75%" align="center">
<img alt="tabletop main 3" src="/images/top-3.png" width="75%" align="center">
<img alt="tabletop main 3" src="/images/top-4.png" width="75%" align="center">

#### Scheduling

<img alt="tabletop scheduling 1" src="/images/scheduling-1.png" width="60%" align="center">
<img alt="tabletop scheduling 2" src="/images/scheduling-2.png" width="60%" align="center">
# Network visualisation app

Application for visualisation small or maybe medium networks, works serverless, all computations (not many) depend on client.

This app is using [SigmaJs](https://github.com/jacomyal/sigma.js) and its plugins for most functionality (rendering etc.).
Sigma is quite older library, so I had to make changes in some plugins, to make them work properly, or change functionality for my own purposes.

For frontend I'm using [React](https://reactjs.org/), it was not the best decision (importing webworkers, PWA static files ...) but it could be worse... now I would use rather something like [NextJs](https://nextjs.org/) where you're not as limited and you can configure webpack etc.

## Features

- Import GML, Gexf, custom JSON 
- Export Gexf, custom JSON with settings, SVG, PNG
- Layouts : Forceatlas2, no overlap (separated from UI thread), Fruchterman-Reingold (also separated from UI thread)
- Group nodes (create graph from group, edit group)
- Edit nodes


[![Netlify Status](https://api.netlify.com/api/v1/badges/59c0cab6-c3f5-4cd5-ad81-7310b5768843/deploy-status)](https://app.netlify.com/sites/nostalgic-mccarthy-952667/deploys)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

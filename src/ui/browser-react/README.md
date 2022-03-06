# Browser UI using React

### Set Up

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).  See [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started) for more information.  

	> npx create-react-app <project-name> --template typescript 
	> cd <project-name>
	> npm start

One will have to make assessment as whether these various custom scripts provided by [Create React App](https://github.com/facebook/create-react-app) meet the needs of the project.  Other options include the following.

1. Running [`npm run eject`](https://github.com/facebook/create-react-app#philosophy) and customizing the scripts in the resulting `scripts` folder.  Though customization improves, upgrades become more painful.
2. Using [Create React App](https://github.com/facebook/create-react-app) and replacing some npm scripts *as was done in this project*.  For example, the `npm start` script was replaced with one that copies the build artifacts over (i.e. file resulting from `npm run build`) and starts the Express server in the [/server](../../server) package.  Though there are more dependencies than the project probably needs upgrades are easier and the majority of the build logic is supported for free.  This seemed to be a good trade-off.
3. Not using [Create React App](https://github.com/facebook/create-react-app) and rolling your own bundling configuration using something like [Webpack configuration](https://webpack.js.org/).  This will certainly simplify your scripts but seeing what dials the React team is turning in [Webpack](https://webpack.js.org/) might be worth your time.

### Architecture

 	- public
	- src
		- views
			- <feature>
			- shared

The `public` folder is needed by the [Create React App](https://github.com/facebook/create-react-app) script.  Specifically this is where the artifacts from `npm run build` are placed.  Its stores static assets and is the target of the production bundle created.  The `src` folder is decomposed by `views` and then by features.  A feature could be all the views associated with things like task management, data entry for customer data, etc.  In general these folders will have a `ViewContainer` that will be the root of all other views (components) and a `ViewModel` whose state various views will bind to in one way or another.  The `shared` folder is for concerns shared among the various views.
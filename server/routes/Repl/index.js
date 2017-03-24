'use strict';

var Module = {};

Module.filename = "/www/ROLLUP/rollupjs.org/shared/routes/Repl/Input/Module.html";

Module.data = function () {
	return {};
};

Module.render = function ( root, options ) {
	root = root || {};
	
	return `<article class="module ${root.main ? "main-module" : ""}" svelte-1361929536><header svelte-1361929536>${ root.main ? `<span class="entry-module-name" svelte-1361929536>main.js <span class="entry-module-label" svelte-1361929536>(entry module)</span></span>` : `<input class="module-name" placeholder="foo.js" svelte-1361929536>
	
				<button class="remove" svelte-1361929536><span class="label" svelte-1361929536>remove</span>
					<span class="icon-cancel" svelte-1361929536></span></button>` }</header>
	
		<textarea value="${root.code}" svelte-1361929536></textarea></article>`;
};

Module.renderCss = function () {
	var components = [];
	
	components.push({
		filename: Module.filename,
		css: "\n\t[svelte-1361929536].module, [svelte-1361929536] .module {\n\t\tmargin: 0 0 1em 0;\n\t\tborder: 1px solid #f4f4f4;\n\t}\n\n\theader[svelte-1361929536], [svelte-1361929536] header {\n\t\twidth: 100%;\n\t\tborder-bottom: 1px solid #f4f4f4;\n\t}\n\n\t[svelte-1361929536].main-module, [svelte-1361929536] .main-module {\n\t\tborder: 1px solid #ccc;\n\t}\n\n\t[svelte-1361929536].main-module header, [svelte-1361929536] .main-module header {\n\t\t\n\t}\n\n\t[svelte-1361929536].entry-module-name, [svelte-1361929536] .entry-module-name {\n\t\tdisplay: block;\n\t\tpadding: 0.5em;\n\t}\n\n\t[svelte-1361929536].entry-module-label, [svelte-1361929536] .entry-module-label {\n\t\tcolor: #999;\n\t}\n\n\tbutton[svelte-1361929536], [svelte-1361929536] button {\n\t\tposition: absolute;\n\t\ttop: 0;\n\t\tright: 0;\n\t\tfont-family: inherit;\n\t\tfont-size: inherit;\n\t\tpadding: 0.5em;\n\t\tbackground-color: transparent;\n\t\tborder: none;\n\t\tcolor: #e94c43;\n\t\tcursor: pointer;\n\t\toutline: none;\n\t\topacity: 0.4;\n\t\t-webkit-transition: opacity 0.2s;\n\t\ttransition: opacity 0.2s;\n\t}\n\n\tbutton[svelte-1361929536]:hover, [svelte-1361929536] button:hover, button[svelte-1361929536]:active, [svelte-1361929536] button:active {\n\t\topacity: 1;\n\t}\n\n\tbutton[svelte-1361929536] .label, [svelte-1361929536] button .label {\n\t\tposition: absolute;\n\t\tright: 100%;\n\t\topacity: 0;\n\t\t-webkit-transition: opacity 0.2s;\n\t\ttransition: opacity 0.2s;\n\t}\n\n\tbutton[svelte-1361929536]:hover .label, [svelte-1361929536] button:hover .label, button[svelte-1361929536]:active .label, [svelte-1361929536] button:active .label {\n\t\topacity: 0.6;\n\t}\n\n\t[svelte-1361929536].icon-cancel, [svelte-1361929536] .icon-cancel {\n\t\tfont-size: 0.8em;\n\t}\n\n\ttextarea[svelte-1361929536], [svelte-1361929536] textarea {\n\t\twidth: 100%;\n\t\theight: 100px;\n\t}\n",
		map: null // TODO
	});
	
	return {
		css: components.map( x => x.css ).join( '\n' ),
		map: null,
		components
	};
};

// TODO does this all work on windows?

const absolutePath = /^(?:\/|(?:[A-Za-z]:)?[\\|\/])/;


function isAbsolute ( path ) {
	return absolutePath.test( path );
}





function dirname ( path ) {
	const match = /(\/|\\)[^\/\\]*$/.exec( path );
	if ( !match ) return '.';

	const dir = path.slice( 0, -match[0].length );

	// If `dir` is the empty string, we're at root.
	return dir ? dir : '/';
}





function resolve ( ...paths ) {
	let resolvedParts = paths.shift().split( /[\/\\]/ );

	paths.forEach( path => {
		if ( isAbsolute( path ) ) {
			resolvedParts = path.split( /[\/\\]/ );
		} else {
			const parts = path.split( /[\/\\]/ );

			while ( parts[0] === '.' || parts[0] === '..' ) {
				const part = parts.shift();
				if ( part === '..' ) {
					resolvedParts.pop();
				}
			}

			resolvedParts.push.apply( resolvedParts, parts );
		}
	});

	return resolvedParts.join( '/' ); // TODO windows...
}

// this file is auto-generated, don't edit it
var examples = [{"id":"00","title":"Tree-shaking"},{"id":"01","title":"Default exports"},{"id":"02","title":"Named exports"},{"id":"03","title":"External imports"},{"id":"04","title":"Static namespaces"},{"id":"05","title":"Dynamic namespaces"}];

const cache = {};

function get ( url ) {
	return new Promise( ( fulfil, reject ) => {
		const xhr = new XMLHttpRequest();
		xhr.open( 'GET', url );
		xhr.onerror = reject;
		xhr.onload = () => fulfil( xhr.responseText );
		xhr.send();
	});
}

function getJSON ( url ) {
	if ( !cache[ url ] ) {
		cache[ url ] = get( url )
			.then( JSON.parse )
			.catch( err => {
				cache[ url ] = null;
				throw err;
			});
	}

	return cache[ url ];
}

var template$1 = (function () {
	let uid = 1;

	return {
		data: () => ({
			examples,
			selectedExample: null,
			modules: [],
			codemirrorReady: false
		}),

		components: {
			Module,
		},

		oncreate () {
			this.observe( 'selectedExample', id => {
				console.log( `id`, id );
				if ( !id ) return;

				getJSON( `/examples/${id}.json` ).then( example => {
					console.log( `example`, example );
					this.set({ modules: example.modules });
				});
			});
		},

		methods: {
			removeModule ( index ) {
				const modules = this.get( 'modules' );
				modules.splice( index, 1 );

				this.set({ modules });
			},

			createModule () {
				const modules = this.get( 'modules' );
				modules.push({
					name: `module_${uid++}.js`,
					code: ''
				});

				this.set({ modules });
			},

			clear () {
				this.set({
					modules: [{ name: 'main.js', code: '' }],
					selectedExample: null
				});
			}
		}
	};
}());

var index$2 = {};

index$2.filename = "/www/ROLLUP/rollupjs.org/shared/routes/Repl/Input/index.html";

index$2.data = function () {
	return template$1.data();
};

index$2.render = function ( root, options ) {
	root = Object.assign( template$1.data(), root || {} );
	
	var settled = false;
	var tmp;
	
	while ( !settled ) {
		settled = true;
	
		if ( !( 'name' in root )&&(root.codemirrorReady) ) {
			tmp = template$1.components.Module.data();
			if ( 'module.name' in tmp ) {
				root.name = tmp.module.name;
				settled = false;
			}
		}
		
		if ( !( 'code' in root )&&(root.codemirrorReady) ) {
			tmp = template$1.components.Module.data();
			if ( 'module.code' in tmp ) {
				root.code = tmp.module.code;
				settled = false;
			}
		}
	}
	
	return `<header class="start-here clearfix" svelte-306665059><select svelte-306665059><option disabled svelte-306665059>Select an example...</option>
			${ root.examples.map( example => `<option value="${example.id}" svelte-306665059>${__escape$1( example.title )}</option>` ).join( '' )}</select>
	
		<button svelte-306665059>Start over</button></header>
	
	${ root.codemirrorReady ? `${ root.modules.map( ( module, i ) => `${template$1.components.Module.render({index: i, main: i===0, name: module.name, code: module.code})}` ).join( '' )}
	
		<button class="new-module" svelte-306665059><span class="icon icon-plus" svelte-306665059></span> add module</button>` : `<p svelte-306665059>loading...</p>` }`;
};

index$2.renderCss = function () {
	var components = [];
	
	components.push({
		filename: index$2.filename,
		css: "\n\tstrong[svelte-306665059], [svelte-306665059] strong {\n\t\tline-height: 2;\n\t}\n\n\t[svelte-306665059].new-module, [svelte-306665059] .new-module {\n\t\tdisplay: block;\n\t\twidth: 100%;\n\t\tcolor: #3D9970;\n\t\tborder: none;\n\t\tpadding: 1em;\n\t\tmargin-bottom: 0;\n\t}\n\n\tbutton[svelte-306665059], [svelte-306665059] button {\n\t\tfloat: right;\n\t}\n",
		map: null // TODO
	});
	
	var seen = {};
	
	function addComponent ( component ) {
		var result = component.renderCss();
		result.components.forEach( x => {
			if ( seen[ x.filename ] ) return;
			seen[ x.filename ] = true;
			components.push( x );
		});
	}
	
	addComponent( template$1.components.Module );
	
	return {
		css: components.map( x => x.css ).join( '\n' ),
		map: null,
		components
	};
};

var escaped$1 = {
	'"': '&quot;',
	"'": '&#39;',
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;'
};

function __escape$1 ( html ) {
	return String( html ).replace( /["'&<>]/g, match => escaped$1[ match ] );
}

var template$4 = (function () {
	const defaultGlobals = {
		jquery: 'jQuery'
	};

	let userGlobals = {};

	return {
		data: () => ({
			formats: [
				{ name: 'AMD', value: 'amd' },
				{ name: 'CommonJS', value: 'cjs' },
				{ name: 'ES2015', value: 'es' },
				{ name: 'Globals', value: 'iife' },
				{ name: 'UMD', value: 'umd' }
			],

			format: 'amd',
			moduleName: 'myBundle',
			moduleId: '',

			exports: [],
			sortedImports: []
		}),

		oncreate () {
			let options;
			let updating;

			this.observe( 'options', o => {
				this.set( options = o );
			});

			this.observe( 'imports', imports => {
				if ( !imports ) return;

				// we only care about this stuff in IIFE/UMD mode...
				// cheeky hack to clean `options.globals`
				const format = this.get( 'options.format' );
				if ( format !== 'iife' && format !== 'umd' ) imports = [];

				const sortedImports = imports
					.sort( ( a, b ) => {
						return a < b ? -1 : 1;
					})
					.map( name => {
						return {
							name,
							value: userGlobals[ name ] || defaultGlobals[ name ] || name
						};
					});

				let globals = {};
				sortedImports.forEach( ({ name, value }) => {
					globals[ name ] = userGlobals[ name ] = value;
				});

				updating = true;
				this.set({ sortedImports });

				const options = this.get( 'options' );
				options.globals = globals;
				this.set({ options });

				updating = false;
			});

			this.observe( 'sortedImports', sortedImports => {
				if ( updating ) return;

				updating = true;
				let globals = {};
				sortedImports.forEach( ({ name, value }) => {
					globals[ name ] = userGlobals[ name ] = value;
				});

				const options = this.get( 'options' );
				options.globals = globals;
				this.set({ options });
				updating = false;
			});

			// two-way binding
			this.observe( 'format', format => {
				options.format = format;
				this.set({ options });
			});

			this.observe( 'moduleName', moduleName => {
				options.moduleName = moduleName;
				this.set({ options });
			});

			this.observe( 'moduleId', moduleId => {
				options.moduleId = moduleId;
				this.set({ options });
			});
		},

		// TODO reinstate slide transitions on option boxes
		// transitions: { slide }
	};
}());

var BundleOptions = {};

BundleOptions.filename = "/www/ROLLUP/rollupjs.org/shared/routes/Repl/Output/BundleOptions.html";

BundleOptions.data = function () {
	return template$4.data();
};

BundleOptions.render = function ( root, options ) {
	root = Object.assign( template$4.data(), root || {} );
	
	return `<div class="options" svelte-1822600458><section svelte-1822600458><h3 svelte-1822600458>options.format</h3>
			<table svelte-1822600458><tr svelte-1822600458>${ root.formats.map( ( format, i ) => `<td svelte-1822600458><button class="${format.value === root.options.format ? "selected": ""}" svelte-1822600458>${__escape$4( format.name )}</button></td>` ).join( '' )}</tr></table></section>
	
		${ root.options.format === 'amd' || root.options.format === 'umd' ? `<section intro-outro="slide:fast" svelte-1822600458><h3 svelte-1822600458>options.moduleId</h3>
				<input placeholder="leave blank for anonymous module" svelte-1822600458></section>` : `` }
	
		${ root.options.format === 'iife' || root.options.format === 'umd' ? `${ root.exports.length ? `<section intro-outro="slide:fast" svelte-1822600458><h3 svelte-1822600458>options.moduleName</h3>
					<input svelte-1822600458></section>` : `` }
	
			${ root.sortedImports.length ? `<section svelte-1822600458><h3 intro-outro="slide:fast" svelte-1822600458>options.globals</h3>
					${ root.sortedImports.map( x => `<div intro-outro="slide:fast" svelte-1822600458><input value="${x.value}" svelte-1822600458>
							<code svelte-1822600458>'${__escape$4( x.name )}'</code></div>` ).join( '' )}</section>` : `` }` : `` }</div>`;
};

BundleOptions.renderCss = function () {
	var components = [];
	
	components.push({
		filename: BundleOptions.filename,
		css: "\n\t[svelte-1822600458].options, [svelte-1822600458] .options {\n\t\tmargin: 0 0 1em 0;\n\t\tborder: 1px solid #eee;\n\t}\n\n\ttable[svelte-1822600458], [svelte-1822600458] table {\n\t\twidth: 100%;\n\t\tborder-spacing: 0;\n\t}\n\n\ttd[svelte-1822600458], [svelte-1822600458] td {\n\t\twidth: 1%;\n\t\tpadding: 0;\n\t\tfont-size: 0.8em;\n\t}\n\n\tbutton[svelte-1822600458], [svelte-1822600458] button {\n\t\tdisplay: block;\n\t\twidth: 100%;\n\t\theight: 100%;\n\t\tpadding: 1em 0;\n\t}\n\n\t[svelte-1822600458].selected, [svelte-1822600458] .selected {\n\t\tbackground-color: #ccc;\n\t\tfont-weight: bold;\n\t}\n\n\tsection[svelte-1822600458], [svelte-1822600458] section {\n\t\tborder-bottom: 1px solid #eee;\n\t}\n\n\tsection[svelte-1822600458]:last-child, [svelte-1822600458] section:last-child {\n\t\tborder: none;\n\t}\n\n\th3[svelte-1822600458], [svelte-1822600458] h3 {\n\t\tpadding: 0.5rem;\n\t\tmargin: 0;\n\t\tfont-size: 1em;\n\t\tfont-weight: 900;\n\t}\n\n\tlabel[svelte-1822600458], [svelte-1822600458] label {\n\t\tdisplay: block;\n\t\tpadding: 0 0 0 8em;\n\t}\n\n\tinput[svelte-1822600458], [svelte-1822600458] input {\n\t\tpadding-left: 1.5em;\n\t}\n\n\tsection[svelte-1822600458] code, [svelte-1822600458] section code {\n\t\tposition: absolute;\n\t\tdisplay: block;\n\t\tright: 0;\n\t\ttop: 1px;\n\t\tpadding: 0.5em 0.5em 0.5em 1.5em;\n\t\tline-height: 1;\n\t}\n",
		map: null // TODO
	});
	
	return {
		css: components.map( x => x.css ).join( '\n' ),
		map: null,
		components
	};
};

var escaped$4 = {
	'"': '&quot;',
	"'": '&#39;',
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;'
};

function __escape$4 ( html ) {
	return String( html ).replace( /["'&<>]/g, match => escaped$4[ match ] );
}

var Status = {};

Status.filename = "/www/ROLLUP/rollupjs.org/shared/routes/Repl/Output/Status.html";

Status.data = function () {
	return {};
};

Status.render = function ( root, options ) {
	root = root || {};
	
	return `<div class="status ${root.error ? "error": "success"}" svelte-1938497493>${ root.error ? `<span svelte-1938497493><span class="icon icon-error" svelte-1938497493></span>
				<strong svelte-1938497493>${__escape$5( root.error.name )}:</strong> ${__escape$5( root.error.message )}</span>` : `<span svelte-1938497493><span class="icon icon-ok" svelte-1938497493></span>
				Rollup successful!
	
				${ root.warnings.length ? `(${__escape$5( root.warnings.length )} ${__escape$5( root.warnings.length === 1 ? 'warning' : 'warnings' )} — check the console)` : `` }</span>` }</div>
	
	
	
	`;
};

Status.renderCss = function () {
	var components = [];
	
	components.push({
		filename: Status.filename,
		css: "\n\t[svelte-1938497493].status, [svelte-1938497493] .status {\n\t\tpadding: 0.5em;\n\t\tmargin: 0 0 1em 0;\n\t\tcolor: white;\n\t}\n\n\t[svelte-1938497493].success, [svelte-1938497493] .success {\n\t\tbackground-color: #3D9970;\n\t}\n\n\t[svelte-1938497493].error, [svelte-1938497493] .error {\n\t\tbackground-color: #e94c43;\n\t}\n\n\t[svelte-1938497493].status > span, [svelte-1938497493] .status > span {\n\t\tfont-size: 1em;\n\t}\n",
		map: null // TODO
	});
	
	return {
		css: components.map( x => x.css ).join( '\n' ),
		map: null,
		components
	};
};

var escaped$5 = {
	'"': '&quot;',
	"'": '&#39;',
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;'
};

function __escape$5 ( html ) {
	return String( html ).replace( /["'&<>]/g, match => escaped$5[ match ] );
}

var Bundle = {};

Bundle.filename = "/www/ROLLUP/rollupjs.org/shared/routes/Repl/Output/Bundle.html";

Bundle.data = function () {
	return {};
};

Bundle.render = function ( root, options ) {
	root = root || {};
	
	return `<div class="bundle" svelte-553244104></div>`;
};

Bundle.renderCss = function () {
	var components = [];
	
	components.push({
		filename: Bundle.filename,
		css: "\n\t[svelte-553244104].bundle, [svelte-553244104] .bundle {\n\t\tborder: 1px solid #eee;\n\t}\n",
		map: null // TODO
	});
	
	return {
		css: components.map( x => x.css ).join( '\n' ),
		map: null,
		components
	};
};

var template$3 = (function () {
	return {
		data: () => ({
			error: null
		}),

		components: {
			BundleOptions,
			Status,
			Bundle
		}
	};
}());

var index$3 = {};

index$3.filename = "/www/ROLLUP/rollupjs.org/shared/routes/Repl/Output/index.html";

index$3.data = function () {
	return template$3.data();
};

index$3.render = function ( root, options ) {
	root = Object.assign( template$3.data(), root || {} );
	
	var settled = false;
	var tmp;
	
	while ( !settled ) {
		settled = true;
	
		if ( !( 'options' in root ) ) {
			tmp = template$3.components.BundleOptions.data();
			if ( 'options' in tmp ) {
				root.options = tmp.options;
				settled = false;
			}
		}
	}
	
	return `${template$3.components.Status.render({error: root.error, warnings: root.warnings})}
	${template$3.components.BundleOptions.render({imports: root.imports, exports: root.exports, options: root.options})}
	
	${ root.codemirrorReady ? `${template$3.components.Bundle.render({code: root.code})}` : `<p>loading...</p>` }`;
};

index$3.renderCss = function () {
	var components = [];
	
	var seen = {};
	
	function addComponent ( component ) {
		var result = component.renderCss();
		result.components.forEach( x => {
			if ( seen[ x.filename ] ) return;
			seen[ x.filename ] = true;
			components.push( x );
		});
	}
	
	addComponent( template$3.components.BundleOptions );
	addComponent( template$3.components.Status );
	addComponent( template$3.components.Bundle );
	
	return {
		css: components.map( x => x.css ).join( '\n' ),
		map: null,
		components
	};
};

function examplesMatch ( exampleModules, saved ) {
	let i = saved.length;
	if ( !i ) return false;

	let name;

	while ( i-- ) {
		name = saved[i].name.replace( /\.js$/, '' );

		const a = exampleModules[ name ];
		const b = saved[i].code;

		if ( !a ) return false;
		if ( a.trim() !== b.trim() ) return false;
	}

	return true;
}

function recoverState () {
	const search = typeof window !== 'undefined' ? window.location.search : '';
	// recover state from hash fragment
	let json;
	const match = /shareable=(.+)$/.exec( search );
	if ( match ) {
		try {
			json = decodeURIComponent( atob( match[1] ) );
		} catch ( err ) {
			// noop
		}
	}

	let saved;
	let selectedExample;

	try {
		saved = JSON.parse( json );
		let example;

		// does this match an existing example?
		for ( let i = 0; i < examples.length; i += 1 ) {
			example = examples[i];

			if ( examplesMatch( example.modules, saved.modules ) ) {
				selectedExample = example.id;
			}
		}
	} catch ( err ) {
		selectedExample = examples[0].id;
	}

	return { saved, selectedExample };
}

var debounce = function ( fn, ms ) {
	let timeout;

	return function () {
		clearTimeout( timeout );
		timeout = setTimeout( fn, ms || 250 );
	};
};

var template = (function () {
	const { saved, selectedExample } = recoverState();

	return {
		components: {
			Input: index$2,
			Output: index$3
		},

		data () {
			return {
				codemirrorReady: false,
				rollupReady: false,

				selectedExample,
				modules: saved ? saved.modules : [],

				options: saved ? saved.options : {
					format: 'cjs',
					moduleName: 'myBundle'
				},

				warnings: []
			};
		},

		oncreate () {
			curl([ '/codemirror.js' ])
				.then( CodeMirror => {
					window.CodeMirror = CodeMirror;
					this.set({ codemirrorReady: true });
				});

			const versionMatch = /version=([^&]+)/.exec( window.location.search );
			const url = versionMatch ?
				'https://unpkg.com/rollup@' + versionMatch[1] + '/dist/rollup.browser.js' :
				'https://unpkg.com/rollup/dist/rollup.browser.js';

			curl([ url ])
				.then( rollup => {
					window.rollup = rollup;
					this.set({ rollupReady: true });

					let updating = false;

					const update = () => {
						const modules = this.get( 'modules' );

						if ( updating ) return; // TODO this is inelegant...
						updating = true;

						console.clear();
						console.log( `running Rollup version %c${rollup.VERSION}`, 'font-weight: bold' );

						let moduleById = {};

						modules.forEach( module => {
							moduleById[ module.name ] = module;
						});

						const warnings = [];

						/*global rollup */
						rollup.rollup({
							entry: 'main.js',
							plugins: [{
								resolveId ( importee, importer ) {
									if ( !importer ) return importee;
									if ( importee[0] !== '.' ) return false;

									let resolved = resolve( dirname( importer ), importee ).replace( /^\.\//, '' );
									if ( resolved in moduleById ) return resolved;

									resolved += '.js';
									if ( resolved in moduleById ) return resolved;

									throw new Error( `Could not resolve '${importee}' from '${importer}'` );
								},
								load: function ( id ) {
									return moduleById[ id ].code;
								}
							}],
							onwarn ( warning ) {
								warnings.push( warning );

								console.group( warning.loc ? warning.loc.file : '' );

								console.warn( warning.message );

								if ( warning.frame ) {
									console.log( warning.frame );
								}

								if ( warning.url ) {
									console.log( `See ${warning.url} for more information` );
								}

								console.groupEnd();
							}
						}).then( bundle => {
							this.set({
								imports: bundle.imports,
								exports: bundle.exports
							});

							const options = this.get( 'options' );
							const generated = bundle.generate( options );

							console.log( `generated`, generated );

							this.set({
								code: generated.code,
								error: null,
								warnings
							});

							// save state as hash fragment
							history.replaceState( {}, 'x', `/repl?version=${rollup.VERSION}&shareable=${btoa( encodeURIComponent( JSON.stringify({ options, modules }) ) )}` );
						})
						.catch( error => {
							this.set({ error });
							setTimeout( () => {
								throw error;
							});
						})
						.then( () => {
							updating = false;
						});
					};

					this.observe( 'modules', debounce( update, 200 ) );
					this.observe( 'selectedExample', update );
					this.observe( 'options', update );
				});
		},

		methods: {
			updateUrl () {

			}
		}
	};
}());

var index = {};

index.filename = "/www/ROLLUP/rollupjs.org/shared/routes/Repl/index.html";

index.data = function () {
	return template.data();
};

index.render = function ( root, options ) {
	root = Object.assign( template.data(), root || {} );
	
	var settled = false;
	var tmp;
	
	while ( !settled ) {
		settled = true;
	
		if ( !( 'modules' in root ) ) {
			tmp = template.components.Input.data();
			if ( 'modules' in tmp ) {
				root.modules = tmp.modules;
				settled = false;
			}
		}
	}
	
	return `<div class="repl" svelte-1607120930><div class="left" svelte-1607120930><h2 svelte-1607120930>ES6 modules go in...</h2>
			<div class="input" svelte-1607120930>${template.components.Input.render({selectedExample: root.selectedExample, codemirrorReady: root.codemirrorReady, modules: root.modules})}</div></div>
		<div class="right" svelte-1607120930><h2 svelte-1607120930>...bundle comes out</h2>
			<div class="output" svelte-1607120930>${template.components.Output.render({options: root.options, code: root.code, error: root.error, warnings: root.warnings, codemirrorReady: root.codemirrorReady})}</div></div></div>`;
};

index.renderCss = function () {
	var components = [];
	
	components.push({
		filename: index.filename,
		css: "\n\t[svelte-1607120930].repl, [svelte-1607120930] .repl {\n\t\theight: calc(100% - 3.6em);\n\t}\n\n\t[svelte-1607120930].left, [svelte-1607120930] .left, [svelte-1607120930].right, [svelte-1607120930] .right {\n\t\twidth: 100%;\n\t\theight: 100%;\n\t\tfloat: left;\n\t\toverflow-y: auto;\n\t\tpadding: 1em;\n\t}\n\n\tbutton[svelte-1607120930], [svelte-1607120930] button {\n\t\tfont-family: inherit;\n\t\tfont-size: inherit;\n\t\tborder: none;\n\t\toutline: none;\n\t\tcursor: pointer;\n\t\tbackground-color: #eee;\n\t\tpadding: 0.5em 1em;\n\t\tmargin-bottom: 1em;\n\t}\n\n\tbutton[svelte-1607120930]:hover, [svelte-1607120930] button:hover, button[svelte-1607120930]:active, [svelte-1607120930] button:active {\n\t\tbackground-color: #eaeaea;\n\t}\n\n\tbutton[svelte-1607120930]:disabled, [svelte-1607120930] button:disabled {\n\t\tcursor: default;\n\t}\n\n\t[svelte-1607120930].icon, [svelte-1607120930] .icon {\n\t\tfont-size: 0.8em;\n\t}\n\n\tselect[svelte-1607120930], [svelte-1607120930] select {\n\t\tfont-size: inherit;\n\t\tfont-family: inherit;\n\t\tposition: relative;\n\t\tborder: none;\n\t\t-webkit-appearance: none;\n\t\t-moz-appearance: none;\n\t\tappearance: none;\n\t\tborder-radius: 0;\n\t\tpadding: 0.5em 3em 0.5em 0.5em;\n\t\tmargin-bottom: 1em;\n\t\tbackground: #eee url(images/select-arrow.svg) no-repeat 100% 50%;\n\t\tbackground-size: auto 100%;\n\t\toutline: none;\n\t}\n\n\tinput[svelte-1607120930], [svelte-1607120930] input {\n\t\tdisplay: block;\n\t\twidth: 100%;\n\t\tfont-family: inherit;\n\t\tfont-size: inherit;\n\t\tpadding: 0.5em;\n\t\tborder: none;\n\t\toutline: none;\n\t\tline-height: 1;\n\t\tcolor: #333;\n\t}\n\n\tinput[svelte-1607120930]:focus, [svelte-1607120930] input:focus {\n\t\tbackground-color: #eee;\n\t}\n\n\n\t@media (min-width: 45rem) {\n\t\t[svelte-1607120930].left, [svelte-1607120930] .left, [svelte-1607120930].right, [svelte-1607120930] .right {\n\t\t\twidth: 50%;\n\t\t}\n\t}\n",
		map: null // TODO
	});
	
	var seen = {};
	
	function addComponent ( component ) {
		var result = component.renderCss();
		result.components.forEach( x => {
			if ( seen[ x.filename ] ) return;
			seen[ x.filename ] = true;
			components.push( x );
		});
	}
	
	addComponent( template.components.Input );
	addComponent( template.components.Output );
	
	return {
		css: components.map( x => x.css ).join( '\n' ),
		map: null,
		components
	};
};

module.exports = index;

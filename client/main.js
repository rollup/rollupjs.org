import roadtrip from 'roadtrip';
import Guide from '../shared/routes/Guide.html';
import Repl from '../shared/routes/Repl/index.html';
import Nav from '../shared/components/Nav.html';
import * as store from '../shared/store.js';

const header = document.querySelector( 'header' );
const main = document.querySelector( 'main' );

const nav = new Nav({
	target: ( header.innerHTML = '', header )
});

let view;

// legacy
function redirect ( from, to ) {
	roadtrip.add( from, {
		enter: route => {
			if ( typeof to === 'function' ) to = to( route );
			roadtrip.goto( to, { replaceState: true });
		}
	});
}

redirect( '/repl/', route => {
	const query = Object.keys( route.query ).map( key => `${key}=${route.query[key]}` ).join( '&' );
	return query ? `/repl?${query}` : '/repl';
});

const guide = {
	enter ( route ) {
		const lang = route.params.lang || 'en';

		nav.set({ route: 'guide' });
		document.title = 'rollup.js • guide';
		document.documentElement.lang = lang;

		// preload blog and guide
		return Promise.all([
			store.getJSON( `/guide/${lang}.json` ),
			store.getJSON( `/guide-summary/${lang}.json` )
		]).then( ([ sections, summary ]) => {
			if ( view ) {
				view.destroy();
			} else {
				main.innerHTML = '';
			}

			nav.set({ summary });

			view = new Guide({
				target: main,
				data: {
					sections,
					summary
				}
			});

			view.on( 'scroll', id => {
				nav.set({ active: id });
			});

			if ( route.scrollY === 0 ) {
				// scroll to section
				if ( window.location.hash.length > 1 ) {
					const h = main.querySelector( window.location.hash );
					if ( h ) window.scrollTo( 0, window.scrollY + h.getBoundingClientRect().top );
				}
			} else {
				window.scrollTo( route.scrollX, route.scrollY );
			}
		});
	},

	update ( route ) {
		if ( !route.hash ) return;
		const section = main.querySelector( `#${route.hash}` );
		if ( section ) section.scrollIntoView();
	}
};

roadtrip
	.add( '/repl', {
		enter () {
			nav.set({ route: 'repl' });

			document.title = 'rollup.js • repl';

			if ( view ) {
				view.destroy();
			} else {
				main.innerHTML = '';
			}

			view = new Repl({
				target: main
			});

			window.scrollTo( 0, 0 );

			// load default EN guide summary, but ensure a different
			// language hasn't already been selected. TODO this would
			// be easier if the REPL was internationalized as well
			if ( !nav.get( 'summary' ) ) {
				store.getJSON( `/guide-summary/en.json` ).then( summary => {
					if ( !nav.get( 'summary' ) ) nav.set({ summary });
				});
			}
		},

		update () {
			// noop
		}
	})
	.add( '/:lang', guide )
	.add( '/', guide );

roadtrip.start();
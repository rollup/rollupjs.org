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

roadtrip
	.add( '/', {
		enter ( route ) {
			nav.set({ route: 'guide' });

			document.title = 'rollup.js • guide';

			// preload blog and guide
			return store.getJSON( `/guide.json` ).then( sections => {
				if ( view ) {
					view.destroy();
				} else {
					main.innerHTML = '';
				}

				view = new Guide({
					target: main,
					data: {
						sections
					}
				});

				view.on( 'scroll', id => {
					nav.set({ active: id });
				});

				if ( route.scrollY === 0 ) {
					// scroll to section
					if ( window.location.hash.length > 1 ) {
						const h = main.querySelector( window.location.hash );
						if ( h ) window.scrollTo( 0, h.getBoundingClientRect().top );
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
	})
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
		},

		update () {
			// noop
		}
	});

roadtrip.start();
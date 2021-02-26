<script>
	import { drawerOpen } from '../store';

	export let page = '';
</script>

<div class="container" class:has-drawer="{page === 'guide'}" on:click="{drawerOpen.close}">
	<span class="drawer-button" on:click|stopPropagation="{drawerOpen.toggle}">&#9776;</span>
	<a rel="prefetch" href="guide/en/" class="logo"><span class="logo-text">rollup.js</span></a>

	<nav>
		<ul class="primary">
			<li>
				<a rel="prefetch" class="{page === 'guide' ? 'active' : ''}" href="guide/en/">guide</a>
			</li>
			<li><a rel="prefetch" class="{page === 'repl' ? 'active' : ''}" href="repl/">repl</a></li>
			<li><a href="https://is.gd/rollup_chat">chat</a></li>
			<li><a href="https://github.com/rollup/rollup">github</a></li>
		</ul>
	</nav>
</div>

<style>
	.container {
		position: fixed;
		top: 0;
		width: 100%;
		height: 3em;
		background-color: #f9f9f9;
		color: #222;
		border-bottom: 1px solid #eee;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif,
			'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
		z-index: 5;
	}

	nav {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif,
			'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
		z-index: 5;
		user-select: none;
		overflow: visible;
		width: 100%;
		height: 0;
	}

	.drawer-button {
		position: absolute;
		display: none;
		left: 0;
		top: 0;
		padding-left: 1rem;
		height: 3.1em;
		width: 3.1em;
		font-size: 1em;
		line-height: 3.1em;
		color: #666;
		cursor: pointer;
		font-weight: 500;
		-webkit-tap-highlight-color: transparent;
		-webkit-touch-callout: none;
	}

	.container.has-drawer .drawer-button {
		display: block;
	}

	.logo {
		position: absolute;
		top: 0;
		height: 3.1em;
		background-image: url(/logo.svg);
		background-repeat: no-repeat;
		background-size: auto 80%;
		line-height: 1;
		color: #222;
		left: 0.5rem;
		right: auto;
		padding: 1rem 0 1rem 2.5rem;
		font-size: 1rem;
		font-weight: 300;
		transform: none;
		background-position: 0 50%;
		display: none;
	}

	.logo-text {
		display: none;
	}

	.container.has-drawer .logo {
		margin-left: 3rem;
	}

	ul {
		display: block;
		margin: 0;
		padding: 0;
		list-style: none;
		background: #f9f9f9;
	}

	.primary {
		position: fixed;
		top: 0;
		right: 1em;
		margin: 0;
		padding-top: 0.3em;
	}

	.primary li {
		position: relative;
		display: inline-block;
	}

	.primary li a {
		display: block;
		line-height: 1;
		padding: 0.7em 0.5em;
		color: #666;
		font-size: 1rem;
		font-weight: 300;
	}

	.primary li a.active {
		color: #333;
		font-weight: 500;
	}

	.primary li::after {
		position: absolute;
		top: 0.8em;
		right: -0.3em;
		content: '/';
		font-size: 0.8em;
		color: #999;
	}

	.primary li:last-child::after {
		content: '';
	}

	@media (min-width: 340px) {
		.logo {
			display: block;
		}
	}

	@media (min-width: 400px) {
		.logo-text {
			display: inline;
		}
	}

	@media (min-width: 768px) {
		.primary {
			padding-top: 0.6em;
		}

		.container {
			height: 3.6em;
		}

		.container.has-drawer .drawer-button {
			display: none;
		}

		.logo {
			font-size: 1.6rem;
			padding-left: 3rem;
			height: 3.6rem;
		}

		.container.has-drawer .logo {
			margin-left: 0;
		}
	}
</style>

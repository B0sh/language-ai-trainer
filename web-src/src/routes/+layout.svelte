<script>
	import '../app.css';
</script>


<svelte:head>
	<script src="/eel.js"></script>
</svelte:head>


<div class="app">
	<main>
		<slot />
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 48rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>

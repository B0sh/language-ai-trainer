<script lang="ts">
	import { onMount } from "svelte";

	import History from "./History.svelte";
	import type { OpenAIMessage } from "../models/openai-message";

	let processing: string = '';
	let messages: OpenAIMessage[] = [];
	

	function setProcessingState(state: string) {
		processing = state;
	}

	onMount(() => {
		window.eel.expose(setProcessingState, "setProcessingState");
	})

	async function startListening() {
		setProcessingState('文字起こし中…');
		const result: OpenAIMessage[] = await window.eel.start_listening()();
		setProcessingState('');
		messages = result.filter(m => m.role !== 'system');
	}
</script>

<div class="terminal-container">
	<div class="content">
		<History {messages} />
	</div>
	<div class="actions">
		<button on:click={startListening}
				disabled={processing !== ''}>
			{processing || '話す'}
		</button>
	</div>
</div>

<style>
	.terminal-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	.terminal-container .content {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		height: 32rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	.terminal-container .actions {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	button {
		font-size: 2rem;
	}
</style>
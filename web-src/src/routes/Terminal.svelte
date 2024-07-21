<script lang="ts">
    import { onMount } from 'svelte';

    import History from './History.svelte';
    import type { OpenAIMessage, OpenAIMessageRole } from '../models/openai-message';

    let processing: string = '';
    let messages: OpenAIMessage[] = [];

    function setProcessingState(state: string) {
        processing = state;
    }

	function setMessages(_messages: OpenAIMessage[]) {
		messages = _messages.filter((m) => m.role !== 'system');
	}

    onMount(() => {
        window.eel.expose(setProcessingState, 'setProcessingState');
        window.eel.expose(setMessages, 'setMessages');
    });

    async function startListening() {
        setProcessingState('聞いている');
        const result: string = await window.eel.start_listening()();
        // setProcessingState('');
        // messages = result.filter((m) => m.role !== 'system');

		var utterance = new SpeechSynthesisUtterance(result);
		utterance.lang = 'ja-JP'; 
		window.speechSynthesis.speak(utterance);
    }

    function fakeMessage() {
		let role: OpenAIMessageRole = 'assistant';
        if (messages.length == 0 || messages[messages.length - 1].role == 'assistant') {
			role = 'user';
        }

		messages = [
			...messages, { role: role, content: `${messages.length} 回目のメッセージ` }
		];
    }
</script>

<div class="content">
    <History {messages} />
</div>
<div class="actions">
    <!-- <button on:click={fakeMessage}> 偽る </button> -->
    <button on:click={startListening} disabled={processing !== ''}>
        {processing || '話す'}
    </button>
</div>

<style>
    .actions {
        display: flex;
        gap: 8px;
        padding: 12px;
    }
    .actions button:last-child {
        flex: 2;
    }
    .actions button:not(:last-child) {
        flex: 1;
    }

    button {
        font-size: 2rem;
        width: 100%;
    }
</style>

<script lang="ts">
    import { onMount } from 'svelte';

    import History from './History.svelte';
    import type { CorrectionMessage, OpenAIMessage, OpenAIMessageRole } from '../models/openai-message';

    let processing: string = '';
    let messages: CorrectionMessage[] = [];

    function setProcessingState(state: string) {
        processing = state;
    }

	function setMessages(_messages: CorrectionMessage[]) {
		messages = _messages;
	}

    onMount(async () => {
        window.eel.expose(setProcessingState, 'setProcessingState');
        window.eel.expose(setMessages, 'setMessages');

        messages = await window.eel.get_messages()();
    });

    async function startListening() {
        setProcessingState('聞いている');
        messages = await window.eel.start_listening()();

        const lastMessage = messages[messages.length - 1].content;

        setProcessingState('音声化中…');

		const utterance = new SpeechSynthesisUtterance(lastMessage);
		utterance.lang = 'ja-JP'; 
		window.speechSynthesis.speak(utterance);

        setProcessingState('');

        console.log(messages);
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

<script lang="ts">
	import type { OpenAIMessage } from "../models/openai-message";

    export let messages: OpenAIMessage[];
</script>


{#each messages as message}
    {#if message.role === 'assistant'}
        <p class="assistant">{message.content}</p>
    {:else}
        <p class="user">{message.content}</p>
    {/if}
{/each}


<style>
    .assistant {
        color: #fff;
        background-color: #333;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 10px;
    }

    .user {
        color: #333;
        background-color: #fff;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 10px;
    }
</style>
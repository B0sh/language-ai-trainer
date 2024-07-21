<script lang="ts">
    import { afterUpdate, beforeUpdate } from 'svelte';
    import type { OpenAIMessage } from '../models/openai-message';
    
	let div: any;
	let autoscroll = false;

	beforeUpdate(() => {
		if (div) {
			const scrollableDistance = div.scrollHeight - div.offsetHeight;
			autoscroll = div.scrollTop > scrollableDistance - 20;
		}
	});

	afterUpdate(() => {
		if (autoscroll) {
			div.scrollTo(0, div.scrollHeight);
		}
	});

    export let messages: OpenAIMessage[];
</script>

<div class="container">
    <div class="phone">
        <div class="chat" bind:this={div}>
            <header>
                <h1>
                    &nbsp; 
                </h1>
            </header>
            {#each messages as message}
                {#if message.role === 'assistant'}
                    <article class="assistant">
                        <span>{message.content}</span>
                    </article>
                {:else}
                    <article class="user">
                        <span>{message.content}</span>
                    </article>
                {/if}
            {/each}
        </div>
    </div>
</div>

<style>
    .container {
		display: grid;
		place-items: center;
		height: 440px;
	}

	.phone {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 440px;
        position: relative;
        font-size: 1rem;
        max-width: 32rem;
        border-radius: 1em;
        box-sizing: border-box;
	}

	header {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 4em 0 0 0;
		box-sizing: border-box;
	}

	h1 {
		flex: 1;
		font-size: 1.4em;
		text-align: center;
	}

	.chat {
		height: 0;
		flex: 1 1 auto;
		padding: 0 1em;
		overflow-y: auto;
		scroll-behavior: smooth;
        scrollbar-width: none;
	}

	article {
		margin: 0 0 0.5em 0;
	}

	.user {
		text-align: right;
	}

	span {
		padding: 0.5em 1em;
		display: inline-block;
	}

	.assistant span {
		background-color:#444;
		border-radius: 1em 1em 1em 0;
		color: white;
        margin-right: 25%;
	}

	.user span {
		background-color: #0074d9;
		color: white;
		border-radius: 1em 1em 0 1em;
		word-break: break-all;
        margin-left: 25%;
	}

	@media (prefers-reduced-motion) {
		.chat {
			scroll-behavior: auto;
		}
	}
    /* .history-container {
        max-width: 32rem;
        margin: 0 auto;
        overflow-y: auto;
        height: 440px;
        scrollbar-width: none;
        display: flex;
        position: relative;
    }

    .history {
        display: flex;
        flex-direction: column;
        width: 100%;
        justify-content: flex-end;
        font-size: 1rem;
        flex: 1 1 auto; 
        height: 0;
        scroll-behavior: smooth;
    }

    .user {
        display: flex;
        justify-content: flex-end;
    }
    .assistant {
        display: flex;
        justify-content: flex-start;
    }

    .assistant p {
        margin-right: 25%;
        background: #eee;
        border-radius: 1rem;
        padding: .5rem;
    }

    .user p {
        margin-left: 25%;
        text-align: right;
        background: linear-gradient(to bottom, #00D0EA 0%, #0085D1 100%);
        background-attachment: fixed;
        border-radius: 1rem;
        padding: .5rem;
        color: white;
    } */
</style>

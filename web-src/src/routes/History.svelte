<script lang="ts">
    import { afterUpdate, beforeUpdate } from 'svelte';
    import type { CorrectionMessage, OpenAIMessage } from '../models/openai-message';

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

    export let messages: CorrectionMessage[];

    function toggleCorrection(index: number) {
        messages[index].showCorrection = !messages[index].showCorrection;
    }
</script>

<div class="container">
    <div class="phone">
        <div class="chat" bind:this={div}>
            <header>
                <h1>&nbsp;</h1>
            </header>
            {#each messages as message, index}
                {#if message.role === 'assistant'}
                    <article class="assistant">
                        <div class="message">{message.content}</div>
                    </article>
                {:else}
                    <article class="user">
                        {#if message.showCorrection}
                            <div class="message strike-through">
                                {message.content}
                            </div>
                            <div class="message corrected">
                                {message.correctedText}
                            </div>
                            {#if message.notes}
                                <div class="notes">{message.notes}</div>
                            {/if}
                        {:else}
                            <div class="message">
                                {message.content}
                            </div>
                        {/if}

                        <div class="correction-button">
                            {#if message.correctedText}
                                <button class="toggle-button" on:click={() => toggleCorrection(index)}>
                                    {message.showCorrection ? '修正を隠す' : '修正を表示する'}
                                </button>
                            {/if}
                        </div>
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
    }

    .strike-through {
        text-decoration: line-through;
    }


    .message {
        display: inline-block;
        padding: 0.5em 1em;
        margin-top: 0.5rem;
    }

    .assistant .message {
        background-color: #444;
        border-radius: 1em 1em 1em 0;
        color: white;
        margin-right: 25%;
    }

    .user {
        text-align: right;
    }

    .user .message {
        text-align: left;
        display: inline-block;
        background-color: #0074d9;
        color: white;
        border-radius: 1em 1em 0 1em;
        word-break: break-all;
        margin-left: 25%;
    }

    .user .correction-button {
        margin-top: -0.25rem;
        font-size: 0.7rem;
        text-align: right;
    }

    .user .corrected {
        background-color: rgb(128 0 64);
    }
    
    .user .notes {
        font-size: 0.7rem;
        text-align: left;
    }

    .toggle-button {
        margin-left: 25%;
        margin-top: 0.5em;
        background: none;
        border: none;
        color: #0074d9;
        cursor: pointer;
        text-align: left;
        padding: 0;
    }


    .notes {
        margin-top: 0.5em;
    }

    @media (prefers-reduced-motion) {
        .chat {
            scroll-behavior: auto;
        }
    }
</style>

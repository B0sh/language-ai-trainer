import { useEffect, useRef } from "react";

/**
 * useKeypress is a hook that will call the given handler when one of the given keys is pressed.
 *
 * @param keys The key or keys to listen for.
 * @param handler The function to call when the key is pressed.
 *
 * @example
 * useKeypress([" ", "Enter"], (event) => {
 *     console.log("Space or Enter was pressed.");
 * });
 */
export const useKeypress = (keys: string | string[], handler: (event: KeyboardEvent) => void) => {
    const ref = useRef<(event: KeyboardEvent) => void>(null);

    useEffect(() => {
        ref.current = (event: KeyboardEvent) => {
            if (!event.repeat && Array.isArray(keys) ? keys.includes(event.key) : keys === event.key) {
                handler(event);
            }
        };
    }, [keys, handler]);

    useEffect(() => {
        const eventListener = (event: KeyboardEvent) => {
            ref.current(event);
        };

        window.addEventListener("keydown", eventListener);
        return () => {
            window.removeEventListener("keydown", eventListener);
        };
    }, []);
};

/**
 * useKeypressWithRepeat is a hook that will call the given handler when one of the given keys is pressed,
 * and will continue to call the handler while the key is held down.
 *
 * @param keys The key or keys to listen for.
 * @param handler The function to call when the key is pressed.
 *
 * @example
 * useKeypressWithRepeat([" ", "Enter"], (event) => {
 *     console.log("Space or Enter was pressed.");
 * });
 */
export const useKeypressWithRepeat = (keys: string | string[], handler: (event: KeyboardEvent) => void) => {
    const ref = useRef<(event: KeyboardEvent) => void>(null);

    useEffect(() => {
        ref.current = (event: KeyboardEvent) => {
            if (Array.isArray(keys) ? keys.includes(event.key) : keys === event.key) {
                handler(event);
            }
        };
    }, [keys, handler]);

    useEffect(() => {
        const eventListener = (event: KeyboardEvent) => {
            ref.current(event);
        };

        window.addEventListener("keydown", eventListener);
        return () => {
            window.removeEventListener("keydown", eventListener);
        };
    }, []);
};

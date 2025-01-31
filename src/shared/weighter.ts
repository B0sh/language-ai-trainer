export interface WeightedItem<T> {
    value: T;
    weight: number;
}
export class Weighter<T> {
    private items: WeightedItem<T>[] = [];

    add(value: T, weight: number): void {
        this.items.push({ value, weight });
    }

    getWeightedItem(): T {
        const totalWeight = this.items.reduce((sum, item) => sum + item.weight, 0);
        const randomWeight = Math.random() * totalWeight;

        let currentWeight = 0;
        for (const item of this.items) {
            currentWeight += item.weight;
            if (randomWeight <= currentWeight) {
                return item.value;
            }
        }

        return this.items[this.items.length - 1].value;
    }

    clear(): void {
        this.items = [];
    }
}

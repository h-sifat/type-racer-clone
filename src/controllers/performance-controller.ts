
import { writable } from "svelte/store";

export interface Performance {
  totalWords: number;
  timeTaken: number;
  wpm: number;
  topicTitle: string;
  paragraphIndex: number;
}

const performanceStore = writable<Performance[]>([]);


export default {
  subscribe: performanceStore.subscribe,
  addPerformance(performance: Performance) {
    performanceStore.update((state) => {
      return [...state, performance];
    });
  }
}

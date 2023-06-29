import topics from "../assets/topics.json";
import { writable } from "svelte/store";

export interface Paragraph {
  topicIndex: number;
  topicCount: number;
  paragraphIndex: number;
  paragraphsCount: number;
  title: string;
  text: string;
}


export const paragraphStore = writable<Paragraph>({
  topicIndex: 0,
  topicCount: topics.length,
  paragraphIndex: 0,
  paragraphsCount: topics[0].paragraphs.length,
  title: topics[0].title,
  text: topics[0].paragraphs[0],
});



export default {
  subscribe: paragraphStore.subscribe,
  nextParagraph() {
    paragraphStore.update((state) => {
      if (state.paragraphIndex + 1 < state.paragraphsCount) {
        const nextParagraphIndex = state.paragraphIndex + 1;
        return {
          ...state,
          paragraphIndex: nextParagraphIndex,
          text: topics[state.topicIndex].paragraphs[nextParagraphIndex],
        };
      }
      else if (state.topicIndex + 1 < state.topicCount) {
        const nextTopicIndex = state.topicIndex + 1;
        return {
          ...state,
          topicIndex: nextTopicIndex,
          paragraphIndex: 0,
          paragraphsCount: topics[nextTopicIndex].paragraphs.length,
          title: topics[nextTopicIndex].title,
          text: topics[nextTopicIndex].paragraphs[0],
        };
      }
      throw new Error("No more paragraphs");
    });
  }
}



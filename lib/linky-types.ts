export type PersonalityType = "talk" | "depth" | "spark" | "focus";

export type ScoreMap = Record<PersonalityType, number>;

export interface Choice {
  label: string;
  scores: ScoreMap;
  color?: string;
}

export interface Question {
  text: string;
  choices: Choice[];
}

export interface Gathering {
  name: string;
  link: string;
}

export interface ResultProfile {
  type: PersonalityType;
  title: string;
  subtitle: string;
  recommendations: Gathering[];
}

// Placeholder links - replace with real gathering URLs
export const gatheringLinks: Record<string, string> = {
  "와인모임": "https://linky-wine-party01.vercel.app/",
  "감튀소개팅": "https://tally.so/r/lbrdkN",
  "독서모임": "https://www.linkykorea.com/lounge",
  "몰입의 밤": "https://focus-night.vercel.app/",
  "회화스터디": "https://linky-study-homepage.vercel.app/",
};

export const questions: Question[] = [
  {
    text: "오늘 밤, 당신은 어떤 사람이 되고 싶나요?",
    choices: [
      {
        label: "말을 꺼내고 싶은 사람",
        scores: { talk: 3, depth: 0, spark: 1, focus: 0 },
      },
      {
        label: "조용히 듣고 싶은 사람",
        scores: { talk: 0, depth: 3, spark: 0, focus: 1 },
      },
      {
        label: "그냥 함께 있고 싶은 사람",
        scores: { talk: 1, depth: 1, spark: 2, focus: 0 },
      },
    ],
  },
  {
    text: "낯선 사람은 당신에게 무엇인가요?",
    choices: [
      {
        label: "설레는 가능성",
        scores: { talk: 1, depth: 0, spark: 3, focus: 0 },
      },
      {
        label: "조금은 어색한 존재",
        scores: { talk: 0, depth: 2, spark: 0, focus: 2 },
      },
      {
        label: "대화가 통하면 가까워질 사람",
        scores: { talk: 3, depth: 1, spark: 1, focus: 0 },
      },
    ],
  },
  {
    text: "당신이 끌리는 밤은",
    choices: [
      {
        label: "와인과 웃음이 있는 밤",
        scores: { talk: 2, depth: 0, spark: 3, focus: 0 },
        color: "mustard",
      },
      {
        label: "책과 생각이 있는 밤",
        scores: { talk: 0, depth: 3, spark: 0, focus: 2 },
        color: "sage",
      },
      {
        label: "언어가 오가는 밤",
        scores: { talk: 3, depth: 1, spark: 1, focus: 0 },
        color: "mint",
      },
      {
        label: "깊이 몰입하는 밤",
        scores: { talk: 0, depth: 1, spark: 0, focus: 3 },
        color: "rose-brown",
      },
    ],
  },
];

export const resultProfiles: Record<PersonalityType, ResultProfile> = {
  talk: {
    type: "talk",
    title: "대화가 흐르는 설렘의 밤",
    subtitle:
      "당신은 대화 속에서 사람을 만나는 사람이에요. 말을 통해 연결되는 그 순간이 당신에게는 가장 빛나는 밤이 됩니다.",
    recommendations: [
      { name: "와인모임", link: gatheringLinks["와인모임"] },
      { name: "감튀소개팅", link: gatheringLinks["감튀소개팅"] },
    ],
  },
  depth: {
    type: "depth",
    title: "조용히 깊어지는 연결의 밤",
    subtitle:
      "말이 많지 않아도 우리는 충분히 가까워질 수 있어요. 당신은 깊이 있는 만남을 원하는 사람입니다.",
    recommendations: [
      { name: "독서모임", link: gatheringLinks["독서모임"] },
      { name: "몰입의 밤", link: gatheringLinks["몰입의 밤"] },
    ],
  },
  spark: {
    type: "spark",
    title: "설레는 가능성의 밤",
    subtitle:
      "새로운 사람, 새로운 공기. 당신은 처음의 설렘을 즐기는 사람이에요. 그 어색함마저 아름다운 시작이 됩니다.",
    recommendations: [
      { name: "와인모임", link: gatheringLinks["와인모임"] },
      { name: "감튀소개팅", link: gatheringLinks["감튀소개팅"] },
    ],
  },
  focus: {
    type: "focus",
    title: "언어로 연결되는 확장의 밤",
    subtitle:
      "몰입하는 순간, 시간이 사라지죠. 당신은 함께 집중하며 연결되는 밤을 원하는 사람입니다.",
    recommendations: [
      { name: "회화스터디", link: gatheringLinks["회화스터디"] },
    ],
  },
};

export function calculateResult(answers: ScoreMap[]): PersonalityType {
  const totals: ScoreMap = { talk: 0, depth: 0, spark: 0, focus: 0 };

  for (const answer of answers) {
    for (const key of Object.keys(totals) as PersonalityType[]) {
      totals[key] += answer[key];
    }
  }

  const entries = Object.entries(totals) as [PersonalityType, number][];
  entries.sort((a, b) => b[1] - a[1]);

  return entries[0][0];
}

export function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const runtime = "edge";

// 简单伪随机：根据 seed 生成 [0, max) 的整数
function pseudoRandom(seed: string, max: number) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return h % max;
}

const levels = ["凶", "小吉", "中吉", "大吉"];

const overallTexts = [
  "今天情绪稍敏感，适合放慢节奏，多感受自己的步调。",
  "日常顺利，按计划行动就很好了。",
  "状态稳健，适合处理稍有难度的事情。",
  "勇敢一点，你会得到超出预期的正反馈。"
];

const careerTexts = [
  "注意避免情绪化判断，保持客观会更顺利。",
  "适合同事协作、稳步推进。",
  "适合主动表达，会被注意到你的认真。",
  "推进重要事项的好时机，别人会认可你的价值。"
];

const loveTexts = [
  "不适合情绪性讨论，多关心自己。",
  "轻松话题比严肃对话更合适。",
  "真诚表达会带来小惊喜。",
  "适合示好、约会、表达心意的一天！"
];

const luckyColors = [
  "白色", "黑色", "淡蓝色", "淡粉色", "绿色", "米黄色", "灰色", "酒红色"
];

export async function POST(req: Request) {
  let body: any = {};
  try {
    body = await req.json();
  } catch (e) {}

  const name: string = (body.name || "你").toString().slice(0, 20);

  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10);

  const seedBase = `${dateStr}-${name}`;

  const overallIndex = pseudoRandom(seedBase + "-overall", levels.length);
  const careerIndex = pseudoRandom(seedBase + "-career", levels.length);
  const loveIndex = pseudoRandom(seedBase + "-love", levels.length);
  const colorIndex = pseudoRandom(seedBase + "-color", luckyColors.length);

  const overallScore = pseudoRandom(seedBase + "-score", 5) + 1;
  const luckyNumber = pseudoRandom(seedBase + "-num", 9) + 1;

  const result = {
    date: dateStr,
    name,
    overall: {
      level: levels[overallIndex],
      score: overallScore,
      text: overallTexts[overallIndex]
    },
    career: {
      level: levels[careerIndex],
      score: careerIndex + 2,
      text: careerTexts[careerIndex]
    },
    love: {
      level: levels[loveIndex],
      score: loveIndex + 2,
      text: loveTexts[loveIndex]
    },
    luckyColor: luckyColors[colorIndex],
    luckyNumber
  };

  return new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  });
}
export async function GET() {
  // 不带 name 时，就默认用 “你”
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10);
  const seedBase = `${dateStr}-你`;

  const overallIndex = pseudoRandom(seedBase + "-overall", levels.length);
  const careerIndex = pseudoRandom(seedBase + "-career", levels.length);
  const loveIndex = pseudoRandom(seedBase + "-love", levels.length);
  const colorIndex = pseudoRandom(seedBase + "-color", luckyColors.length);

  const overallScore = pseudoRandom(seedBase + "-score", 5) + 1;
  const luckyNumber = pseudoRandom(seedBase + "-num", 9) + 1;

  const result = {
    date: dateStr,
    name: "你",
    overall: {
      level: levels[overallIndex],
      score: overallScore,
      text: overallTexts[overallIndex]
    },
    career: {
      level: levels[careerIndex],
      score: careerIndex + 2,
      text: careerTexts[careerIndex]
    },
    love: {
      level: levels[loveIndex],
      score: loveIndex + 2,
      text: loveTexts[loveIndex]
    },
    luckyColor: luckyColors[colorIndex],
    luckyNumber
  };

  return new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  });
}

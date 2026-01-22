"use client";

import { useEffect, useState, MouseEvent } from "react";

type Fortune = {
  date: string;
  name: string;
  overall: {
    level: string;
    score: number;
    text: string;
  };
  career: {
    level: string;
    score: number;
    text: string;
  };
  love: {
    level: string;
    score: number;
    text: string;
  };
  luckyColor: string;
  luckyNumber: number;
};

type FortuneTemplate = Omit<Fortune, "date" | "name">;

// 签池：可以以后慢慢加
const FORTUNE_TEMPLATES: FortuneTemplate[] = [
  {
    overall: {
      level: "大吉",
      score: 5,
      text: "今天万事向好，适合大胆一点，为自己争取机会。",
    },
    career: {
      level: "大吉",
      score: 5,
      text: "适合提出新想法、发邮件跟进、推进重要事项。",
    },
    love: {
      level: "中吉",
      score: 4,
      text: "温柔表达感受，会被好好接住的一天。",
    },
    luckyColor: "樱花粉",
    luckyNumber: 3,
  },
  {
    overall: {
      level: "中吉",
      score: 4,
      text: "节奏比较顺滑，适合稳稳推进计划中的事情。",
    },
    career: {
      level: "中吉",
      score: 4,
      text: "适合整理、复盘、补完之前没做完的部分。",
    },
    love: {
      level: "大吉",
      score: 5,
      text: "适合约见、聊天、拉近距离的一天。",
    },
    luckyColor: "淡蓝色",
    luckyNumber: 7,
  },
  {
    overall: {
      level: "小吉",
      score: 3,
      text: "小确幸的一天，把注意力放在微小的开心上。",
    },
    career: {
      level: "小吉",
      score: 3,
      text: "适合做不太费脑子的执行任务，别给自己太大压力。",
    },
    love: {
      level: "吉",
      score: 3,
      text: "适合轻松的互动，不要太用力，自然一点就好。",
    },
    luckyColor: "薄荷绿",
    luckyNumber: 9,
  },
  {
    overall: {
      level: "吉",
      score: 3,
      text: "整体平稳，保持心情舒展就很不错。",
    },
    career: {
      level: "吉",
      score: 3,
      text: "适合慢慢打基础、学习新东西。",
    },
    love: {
      level: "吉",
      score: 3,
      text: "适合好好陪自己、也可以和朋友多聊聊天。",
    },
    luckyColor: "奶油黄",
    luckyNumber: 1,
  },
  {
    overall: {
      level: "凶",
      score: 2,
      text: "可能比较容易在意别人的眼光，多对自己温柔一点。",
    },
    career: {
      level: "小吉",
      score: 3,
      text: "不适合硬刚，适合先观察、再行动。",
    },
    love: {
      level: "凶",
      score: 2,
      text: "别急着下结论，更适合安静照顾自己的情绪。",
    },
    luckyColor: "雾霾蓝",
    luckyNumber: 4,
  },
];

function getLevelTheme(level: string) {
  // 日系神社 + Q 版配色
  switch (level) {
    case "大吉":
      return {
        omikujiBg: "#fff7eb",
        omikujiBorder: "#f97316",
        omikujiText: "#b45309",
        ribbon: "#f97316",
        face: "٩(ˊᗜˋ*)و",
      };
    case "中吉":
      return {
        omikujiBg: "#eef2ff",
        omikujiBorder: "#4f46e5",
        omikujiText: "#3730a3",
        ribbon: "#6366f1",
        face: "(｡•̀ᴗ-)✧",
      };
    case "小吉":
      return {
        omikujiBg: "#ecfdf5",
        omikujiBorder: "#22c55e",
        omikujiText: "#15803d",
        ribbon: "#22c55e",
        face: "(๑•̀ㅂ•́)و✧",
      };
    case "吉":
      return {
        omikujiBg: "#fefce8",
        omikujiBorder: "#eab308",
        omikujiText: "#854d0e",
        ribbon: "#facc15",
        face: "(•ᴗ•)و",
      };
    case "凶":
      return {
        omikujiBg: "#fef2f2",
        omikujiBorder: "#ef4444",
        omikujiText: "#b91c1c",
        ribbon: "#ef4444",
        face: "(；´д｀)ゞ",
      };
    default:
      return {
        omikujiBg: "#f9fafb",
        omikujiBorder: "#cbd5f5",
        omikujiText: "#111827",
        ribbon: "#f97316",
        face: "(•ᴗ•)و",
      };
  }
}

function getTodayString() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function generateFortuneForToday(): Fortune {
  const today = getTodayString();
  const storageKey = `daily-fortune-v1-${today}`;

  if (typeof window !== "undefined") {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved) as Fortune;
      } catch {
        // 解析失败就重新生成
      }
    }
  }

  const template =
    FORTUNE_TEMPLATES[
      Math.floor(Math.random() * FORTUNE_TEMPLATES.length)
    ];

  const fortune: Fortune = {
    date: today,
    name: "你",
    ...template,
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(storageKey, JSON.stringify(fortune));
  }

  return fortune;
}

export default function Home() {
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [loading, setLoading] = useState(false);

  function fetchFortune() {
    setLoading(true);

    // 模拟摇签时间，看起来更有仪式感一点
    setTimeout(() => {
      const ft = generateFortuneForToday();
      setFortune(ft);
      setLoading(false);
    }, 500);
  }

  useEffect(() => {
    fetchFortune();
  }, []);

  const bigLevel = fortune?.overall.level ?? "—";
  const date = fortune?.date ?? "";
  const luckyColor = fortune?.luckyColor ?? "";
  const luckyNumber = fortune?.luckyNumber ?? "";
  const theme = getLevelTheme(bigLevel);

  const handleMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = "translateY(1px)";
    e.currentTarget.style.boxShadow = "0 4px 12px rgba(15, 23, 42, 0.25)";
  };

  const handleMouseUp = (e: MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 10px 28px rgba(15, 23, 42, 0.4)";
  };

  const handleMouseLeave = (e: MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 10px 28px rgba(15, 23, 42, 0.4)";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background:
          "radial-gradient(circle at 0% 0%, #fee2e2 0, transparent 45%), radial-gradient(circle at 100% 0%, #e0f2fe 0, transparent 45%), radial-gradient(circle at 50% 100%, #fef9c3 0, #f9fafb 55%)",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
      }}
    >
      <div
        style={{
          position: "relative",
          width: "360px",
          maxWidth: "100%",
        }}
      >
        {/* 顶部小鸟居 + 绳结 */}
        <div
          style={{
            position: "absolute",
            top: -32,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: 120,
              height: 32,
              borderRadius: "999px",
              background:
                "linear-gradient(to right, #b91c1c, #dc2626, #b91c1c)",
              boxShadow: "0 4px 10px rgba(185, 28, 28, 0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fef2f2",
              fontSize: 12,
              letterSpacing: "0.2em",
            }}
          >
            おみくじ
          </div>
          <div
            style={{
              width: 2,
              height: 22,
              background: theme.ribbon,
              marginTop: 2,
              borderRadius: 999,
            }}
          />
        </div>

        {/* 主容器 */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            background: "rgba(255, 255, 255, 0.96)",
            borderRadius: 24,
            padding: "30px 22px 18px",
            boxShadow:
              "0 20px 50px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(148, 163, 184, 0.25)",
            backdropFilter: "blur(14px)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 14,
              alignItems: "baseline",
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: "#6b7280",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              今日抽签
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>{date}</div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 30% 20%, #fee2e2 0, #fecaca 20%, #f9fafb 65%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              🌸
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>
              今天是你的<span style={{ color: "#ef4444" }}> 专属一签</span>。
              <br />
              同一天你在这台设备上，不管抽多少次，都是这支签噢。
            </div>
          </div>

          {/* 竖版和风小签纸 */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 140,
                borderRadius: 16,
                border: `2px solid ${theme.omikujiBorder}`,
                background: theme.omikujiBg,
                boxShadow:
                  "0 10px 24px rgba(148, 163, 184, 0.35), 0 0 0 1px rgba(248, 250, 252, 0.9) inset",
                padding: "14px 10px 10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 6,
                  width: 34,
                  height: 10,
                  borderRadius: 999,
                  border: `1px solid ${theme.ribbon}`,
                  background:
                    "radial-gradient(circle at 30% 10%, #fecaca 0, #fee2e2 40%, #ffffff 95%)",
                }}
              />
              <div
                style={{
                  marginTop: 12,
                  fontSize: 11,
                  color: "#9ca3af",
                  textAlign: "center",
                  marginBottom: 4,
                }}
              >
                {theme.face}
              </div>
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 800,
                  letterSpacing: "0.32em",
                  color: theme.omikujiText,
                  writingMode: "vertical-rl" as any,
                  textOrientation: "upright" as any,
                  margin: "4px 0",
                }}
              >
                {bigLevel}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#6b7280",
                  marginTop: 4,
                  textAlign: "center",
                  lineHeight: 1.4,
                }}
              >
                おみくじ
                <br />
                今日のきっぷ
              </div>
            </div>
          </div>

          {fortune && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                fontSize: 12,
                color: "#6b7280",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  borderRadius: 14,
                  background: "rgba(248, 250, 252, 0.98)",
                  border: "1px solid rgba(226, 232, 240, 0.9)",
                }}
              >
                <div
                  style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}
                >
                  幸运颜色
                </div>
                <div>{luckyColor}</div>
              </div>
              <div
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  borderRadius: 14,
                  background: "rgba(248, 250, 252, 0.98)",
                  border: "1px solid rgba(226, 232, 240, 0.9)",
                }}
              >
                <div
                  style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}
                >
                  幸运数字
                </div>
                <div>{luckyNumber}</div>
              </div>
            </div>
          )}

          <button
            onClick={fetchFortune}
            disabled={loading}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            style={{
              width: "100%",
              padding: "10px 0",
              borderRadius: 999,
              border: "none",
              background:
                "linear-gradient(to right, #b91c1c, #ef4444, #f97316)",
              color: "#fef2f2",
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.8 : 1,
              boxShadow: "0 10px 28px rgba(127, 29, 29, 0.45)",
              transition:
                "transform 0.12s ease, box-shadow 0.12s ease, opacity 0.12s ease",
            }}
          >
            {loading ? "摇签中…" : "再摇一次签筒"}
          </button>

          <div
            style={{
              marginTop: 8,
              fontSize: 10,
              color: "#9ca3af",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            小提示：每台设备、每天一支签。
            <br />
            换一个人 / 换一台设备，抽到的很可能就不一样啦。
          </div>
        </div>
      </div>
    </div>
  );
}

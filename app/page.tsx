"use client";

import React, { useEffect, useState } from "react";

type FortuneLevel = "大吉" | "中吉" | "小吉" | "吉" | "末吉" | "凶" | "大凶" | string;

interface FortuneResponse {
  date: string;
  name: string;
  overall: {
    level: FortuneLevel;
    score: number;
    text: string;
  };
  career: {
    level: FortuneLevel;
    score: number;
    text: string;
  };
  love: {
    level: FortuneLevel;
    score: number;
    text: string;
  };
  luckyColor?: string; // 接口里有就收着，但前端自己算展示色
  luckyNumber: number;
}

const colorPalette = [
  "#ffb7c5", // さくらピンク
  "#ffe0b2", // ミルクティーベージュ
  "#fff4b2", // たまごイエロー
  "#c9f4c5", // ミントグリーン
  "#a7d8ff", // ソーダブルー
  "#d8c6ff", // ラベンダー
  "#ffd6e8", // いちごミルク
  "#ffc8a2", // サンセットオレンジ
];

function getFaceByLevel(level: FortuneLevel): string {
  if (level.includes("大吉")) return "(๑•̀ㅂ•́)و✧";
  if (level.includes("吉")) return "(◍•ᴗ•◍)";
  if (level.includes("大凶")) return "(x_x)";
  if (level.includes("凶")) return "(T﹏T)";
  return "(・◡・)";
}

export default function Home() {
  const [fortune, setFortune] = useState<FortuneResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchFortune(withAnimation = false) {
    try {
      if (withAnimation) {
        setShaking(true);
      }
      setLoading(true);
      setError(null);

      const res = await fetch("/api/daily-fortune");
      if (!res.ok) {
        throw new Error("failed to fetch fortune");
      }
      const data = (await res.json()) as FortuneResponse;
      setFortune(data);
    } catch (e) {
      console.error(e);
      setError("おみくじの取得に失敗しました… 少し待ってからもう一度試してください。");
    } finally {
      setLoading(false);
      if (withAnimation) {
        setTimeout(() => setShaking(false), 650);
      }
    }
  }

  useEffect(() => {
    fetchFortune(false);
  }, []);

  const handleShake = () => {
    // 只是重抽动画，接口本身会保证「同一天同一设备是同一支签」
    fetchFortune(true);
  };

  const luckyNumber = fortune?.luckyNumber ?? 7;
  const luckyColorHex =
    colorPalette[(luckyNumber - 1 + colorPalette.length * 10) % colorPalette.length];

  const overallLevel: FortuneLevel = fortune?.overall.level ?? "吉";
  const face = getFaceByLevel(overallLevel);

  return (
    <div
      style={{
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at 0% 0%, #ffd6e8 0, #ffe9cf 28%, #f5f7ff 55%, #e1f3ff 100%)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, -apple-system, "Hiragino Sans", "Noto Sans JP", "PingFang SC", sans-serif',
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          padding: "32px 20px 40px",
        }}
      >
        {/* 顶部 tabs / 标题卡片 */}
        <div
          style={{
            margin: "0 auto 18px",
            width: 140,
            height: 40,
            borderRadius: 999,
            background:
              "linear-gradient(135deg, #ff6b6b, #ff9966)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 15,
            letterSpacing: "0.12em",
            fontWeight: 600,
            boxShadow: "0 10px 25px rgba(255, 137, 98, 0.45)",
          }}
        >
          おみくじ
        </div>

        {/* 主卡片 */}
        <div
          style={{
            margin: "0 auto",
            borderRadius: 32,
            padding: "26px 28px 30px",
            background: "rgba(255,255,255,0.94)",
            boxShadow:
              "0 18px 40px rgba(182, 137, 255, 0.18), 0 0 0 1px rgba(255,255,255,0.9)",
            backdropFilter: "blur(18px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* 卡片内浅色渐变 */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 0% 0%, rgba(255,214,232,0.28), transparent 55%), radial-gradient(circle at 100% 100%, rgba(186,223,255,0.28), transparent 55%)",
              pointerEvents: "none",
            }}
          />

          {/* 顶部文案 */}
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 18,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "999px",
                    background: "radial-gradient(circle, #ff5f6d 0, #ff9966 55%, #ffb88c 100%)",
                    boxShadow: "0 0 0 4px rgba(255,153,102,0.18)",
                  }}
                />
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    color: "#333",
                  }}
                >
                  今日おみくじ
                </span>
              </div>
              <div
                style={{
                  fontSize: 12,
                  lineHeight: 1.7,
                  color: "#777",
                }}
              >
                今日はあなたの <span style={{ color: "#ff6b6b", fontWeight: 600 }}>専属一签</span>。<br />
                このデバイスで、今日はずっとこの一枚だけ。
              </div>
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#999",
                marginTop: 4,
              }}
            >
              {fortune?.date ?? ""}
            </div>
          </div>

          {/* 中间：签纸本体（带纸纹理） */}
          <div
            style={{
              position: "relative",
              margin: "18px auto 24px",
              width: 230,
              borderRadius: 32,
              padding: "18px 18px 26px",
              backgroundImage:
                "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(255,249,230,0.97)), repeating-linear-gradient(0deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 2px, rgba(248,242,226,0.6) 2px, rgba(248,242,226,0.6) 4px)",
              boxShadow:
                "0 16px 28px rgba(255,137,98,0.22), 0 0 0 1px rgba(255,224,190,0.9)",
              border: "1px solid rgba(255, 220, 180, 0.9)",
              overflow: "hidden",
              transition: "transform 0.25s ease-out",
              transform: shaking ? "translateY(-6px) rotate(-2deg)" : "translateY(0) rotate(0deg)",
            }}
          >
            {/* 纸纹噪点层 */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "radial-gradient(circle at 10% 20%, rgba(255,255,255,0.55) 0, transparent 55%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.35) 0, transparent 60%)",
                opacity: 0.85,
                pointerEvents: "none",
              }}
            />

            {/* 内容 */}
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              {/* 上方小签牌 */}
              <div
                style={{
                  padding: "2px 16px",
                  borderRadius: 999,
                  background: "rgba(255,198,173,0.9)",
                  color: "#fff",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textIndent: "0.18em",
                  boxShadow: "0 6px 12px rgba(255,137,98,0.6)",
                  marginBottom: 4,
                }}
              >
                おみくじ
              </div>

              {/* 颜文字 */}
              <div
                style={{
                  fontSize: 18,
                  color: "#999",
                  marginTop: 2,
                  marginBottom: 2,
                }}
              >
                {face}
              </div>

              {/* 大字：大吉 / 吉 / 凶 … */}
              <div
                style={{
                  fontSize: 64,
                  lineHeight: 1.1,
                  letterSpacing: "0.12em",
                  textIndent: "0.12em",
                  color:
                    overallLevel.includes("凶") || overallLevel.includes("大凶")
                      ? "#4285f4"
                      : "#e67a2e",
                  textShadow: "0 8px 16px rgba(0,0,0,0.08)",
                  marginBottom: 2,
                }}
              >
                {overallLevel}
              </div>

              {/* 小标题 */}
              <div
                style={{
                  fontSize: 12,
                  color: "#999",
                  letterSpacing: "0.16em",
                  textIndent: "0.16em",
                }}
              >
                今日のおきっぷ
              </div>
            </div>
          </div>

          {/* 信息区：ラッキーカラー / ラッキーナンバー */}
          <div
            style={{
              position: "relative",
              display: "flex",
              gap: 10,
              marginBottom: 22,
            }}
          >
            {/* ラッキーカラー */}
            <div
              style={{
                flex: 1,
                borderRadius: 18,
                padding: "10px 14px 12px",
                background: "rgba(255,255,255,0.9)",
                boxShadow: "0 8px 18px rgba(0,0,0,0.02)",
                border: "1px solid rgba(246, 230, 255, 0.8)",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 8,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "#999",
                  marginBottom: 2,
                }}
              >
                ラッキーカラー
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "999px",
                    background: luckyColorHex,
                    boxShadow: "0 0 0 3px rgba(255,255,255,0.9), 0 0 10px rgba(0,0,0,0.12)",
                  }}
                />
              </div>
            </div>

            {/* ラッキーナンバー */}
            <div
              style={{
                flex: 1,
                borderRadius: 18,
                padding: "10px 14px 12px",
                background: "rgba(255,255,255,0.9)",
                boxShadow: "0 8px 18px rgba(0,0,0,0.02)",
                border: "1px solid rgba(255, 230, 210, 0.9)",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 8,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "#999",
                  marginBottom: 2,
                }}
              >
                ラッキーナンバー
              </div>
              <div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "4px 18px",
                    borderRadius: 999,
                    background:
                      "linear-gradient(135deg, #ffe3c2, #ffd0a5)",
                    boxShadow: "0 6px 14px rgba(255,137,98,0.3)",
                    color: "#a54107",
                    fontWeight: 700,
                    fontSize: 15,
                    letterSpacing: "0.16em",
                    textIndent: "0.16em",
                  }}
                >
                  {luckyNumber}
                </div>
              </div>
            </div>
          </div>

          {/* 按钮 */}
          <div style={{ position: "relative", marginBottom: 10 }}>
            <button
              onClick={handleShake}
              disabled={loading}
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                borderRadius: 999,
                padding: "14px 16px",
                cursor: loading ? "wait" : "pointer",
                background:
                  "linear-gradient(135deg, #ff6b6b, #ff8e53)",
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textIndent: "0.06em",
                boxShadow:
                  "0 16px 30px rgba(255,137,98,0.55), 0 0 0 1px rgba(255,255,255,0.5)",
                transform: loading ? "translateY(2px) scale(0.99)" : "translateY(0)",
                transition: "transform 0.16s ease-out, box-shadow 0.16s ease-out, opacity 0.16s",
                opacity: loading ? 0.78 : 1,
              }}
            >
              {loading ? "しゃかしゃか中… ( ˘ω˘ )" : "もう一回ひきたい！(๑•̀ㅂ•́)ง✧"}
            </button>
          </div>

          {/* 小提示 */}
          <div
            style={{
              position: "relative",
              textAlign: "center",
              fontSize: 11,
              lineHeight: 1.6,
              color: "#b3b3b3",
            }}
          >
            每台设备毎天一签。  
            换一个人 / 换一台设备，  
            抽到的签运也许会完全不一样哦 ✨
          </div>

          {error && (
            <div
              style={{
                marginTop: 12,
                fontSize: 11,
                color: "#d93025",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

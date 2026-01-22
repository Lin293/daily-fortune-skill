"use client";

import React, { useEffect, useState } from "react";

type FortuneLevel = "大吉" | "中吉" | "小吉" | "吉" | "凶";

interface FortuneResult {
  level: FortuneLevel;
  luckyColor: string;
  luckyNumber: number;
}

const FORTUNES: FortuneResult[] = [
  { level: "大吉", luckyColor: "ミルキーピンク", luckyNumber: 3 },
  { level: "大吉", luckyColor: "やさしいラベンダー", luckyNumber: 8 },
  { level: "中吉", luckyColor: "クリームホワイト", luckyNumber: 5 },
  { level: "中吉", luckyColor: "ペールブルー", luckyNumber: 9 },
  { level: "小吉", luckyColor: "ミントグリーン", luckyNumber: 6 },
  { level: "小吉", luckyColor: "ハニーイエロー", luckyNumber: 2 },
  { level: "吉", luckyColor: "ミルクティーベージュ", luckyNumber: 1 },
  { level: "吉", luckyColor: "さくらいろ", luckyNumber: 7 },
  { level: "凶", luckyColor: "あわいブルーグレー", luckyNumber: 4 },
];

function getTodayKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return {
    key: `daily-fortune-${y}-${m}-${d}`,
    label: `${y}-${m}-${d}`,
  };
}

function pickFortune(): FortuneResult {
  const index = Math.floor(Math.random() * FORTUNES.length);
  return FORTUNES[index];
}

export default function Home() {
  const [fortune, setFortune] = useState<FortuneResult | null>(null);
  const [dateLabel, setDateLabel] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    const { key, label } = getTodayKey();
    setDateLabel(label);

    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as FortuneResult;
        setFortune(parsed);
        setLoading(false);
        return;
      } catch {
        // ignore parse error and regenerate
      }
    }

    const newFortune = pickFortune();
    window.localStorage.setItem(key, JSON.stringify(newFortune));
    setFortune(newFortune);
    setLoading(false);
  }, []);

  const handleShake = () => {
    if (loading) return;
    setShaking(true);
    setTimeout(() => {
      setShaking(false);
    }, 700);
  };

  const levelFace = (level: FortuneLevel) => {
    switch (level) {
      case "大吉":
        return "(๑´ڡ`๑)";
      case "中吉":
        return("(๑•͈ᴗ•͈)");
      case "小吉":
        return("( ˘ω˘ )");
      case "吉":
        return("(｡•̀ᴗ-)✧");
      case "凶":
      default:
        return("(T﹏T)");
    }
  };

  return (
    <>
      <main className="omk-page">
        {/* 漂浮装饰物 */}
        <div className="omk-decos">
          <span className="omk-deco omk-deco-sakura1">🌸</span>
          <span className="omk-deco omk-deco-sakura2">🌸</span>
          <span className="omk-deco omk-deco-bell">🎐</span>
          <span className="omk-deco omk-deco-paw">🫧</span>
        </div>

        <div className="omk-card">
          <div className="omk-card-inner">
            {/* 标题行 */}
            <div className="omk-header">
              <div className="omk-header-dot" />
              <div className="omk-header-title">今日おみくじ</div>
              <div className="omk-header-date">
                {dateLabel.replace(/-/g, "-")}
              </div>
            </div>

            {/* 说明文字 */}
            <div className="omk-subtext">
              今日はあなたの
              <span className="omk-highlight">専属一枚</span>。
              <br />
              このデバイスで、今日はずっとこの一枚だけ。
            </div>

            {/* みくじ卡片 */}
            <div
              className={
                "omk-paper-wrapper" + (shaking ? " omk-paper-shake" : "")
              }
            >
              <div className="omk-paper-top-tag">おみくじ</div>
              <div className="omk-paper-face">
                {fortune ? levelFace(fortune.level) : "(・・；)"}
              </div>
              <div className="omk-paper-level">
                {fortune ? fortune.level : "ひみつ"}
              </div>
              <div className="omk-paper-caption">今日のきっぷ</div>
            </div>

            {/* 信息区 */}
            <div className="omk-info-row">
              <div className="omk-info-pill">
                <div className="omk-info-label">ラッキーカラー</div>
                <div className="omk-info-value">
                  {fortune ? fortune.luckyColor : "…"}
                </div>
              </div>
              <div className="omk-info-pill">
                <div className="omk-info-label">ラッキーナンバー</div>
                <div className="omk-info-value">
                  {fortune ? fortune.luckyNumber : "…"}
                </div>
              </div>
            </div>

            {/* 按钮 */}
            <button
              className="omk-button"
              type="button"
              onClick={handleShake}
              disabled={loading}
            >
              {loading ? "ひみつ準備中…" : "もう一回ひきたい！！ (๑•̀ㅂ•́)و✧"}
            </button>

            {/* 底部提示 */}
            <div className="omk-footer">
              小提示：毎台設備毎日一枚。毎天一支おみくじ。<br />
              換一個人／換一台設備，抽到的おみくじはきっと違うかも ✨
            </div>
          </div>
        </div>
      </main>

      {/* 样式 & 动画 */}
      <style jsx global>{`
        .omk-page {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 16px;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 15% 0%, #ffeef4 0, #ffeef4 25%, transparent 60%),
            radial-gradient(circle at 85% 100%, #e8f5ff 0, #e8f5ff 30%, transparent 65%),
            radial-gradient(circle at 50% 50%, #fffaf4 0, #fffaf4 40%, #f9f7ff 100%);
          backdrop-filter: blur(4px);
        }

        .omk-decos {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .omk-deco {
          position: absolute;
          font-size: 26px;
          opacity: 0.65;
          filter: drop-shadow(0 4px 8px rgba(255, 255, 255, 0.7));
        }

        .omk-deco-sakura1 {
          top: 14%;
          left: 8%;
          animation: omk-float-soft 9s ease-in-out infinite;
        }

        .omk-deco-sakura2 {
          bottom: 12%;
          right: 10%;
          animation: omk-float-soft 11s ease-in-out infinite;
        }

        .omk-deco-bell {
          top: 10%;
          right: 22%;
          animation: omk-sway 7s ease-in-out infinite;
        }

        .omk-deco-paw {
          bottom: 18%;
          left: 20%;
          animation: omk-bubble 13s linear infinite;
        }

        .omk-card {
          position: relative;
          max-width: 480px;
          width: 100%;
          z-index: 1;
        }

        .omk-card-inner {
          background: radial-gradient(circle at 0% 0%, #fffaf8 0, #ffffff 30%, #fdf9ff 100%);
          border-radius: 28px;
          padding: 28px 26px 26px;
          box-shadow:
            0 18px 45px rgba(234, 160, 175, 0.18),
            0 0 0 1px rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
        }

        .omk-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .omk-header-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: radial-gradient(circle, #ff6272 0, #ff3c4f 80%);
          box-shadow: 0 0 0 4px rgba(255, 99, 132, 0.2);
          margin-right: 8px;
        }

        .omk-header-title {
          flex: 1;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #333;
        }

        .omk-header-date {
          font-size: 12px;
          color: #b3b0c1;
          letter-spacing: 0.06em;
        }

        .omk-subtext {
          font-size: 13px;
          line-height: 1.7;
          color: #6f6b7a;
          margin-bottom: 22px;
        }

        .omk-highlight {
          color: #ff4b6a;
          font-weight: 600;
        }

        .omk-paper-wrapper {
          position: relative;
          margin: 0 auto 22px;
          width: 220px;
          max-width: 100%;
          aspect-ratio: 3 / 4;
          background: linear-gradient(180deg, #f8f5ff 0%, #ffffff 40%, #fef7ff 100%);
          border-radius: 24px;
          border: 1px solid rgba(168, 174, 255, 0.3);
          box-shadow:
            0 14px 30px rgba(154, 133, 255, 0.18),
            0 0 0 1px rgba(255, 255, 255, 0.9);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        }

        .omk-paper-top-tag {
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          padding: 4px 16px;
          border-radius: 999px;
          font-size: 12px;
          letter-spacing: 0.22em;
          color: #ff7f6b;
          background: linear-gradient(135deg, #ffe0d5, #ffd0ce);
          box-shadow: 0 6px 18px rgba(255, 169, 140, 0.45);
        }

        .omk-paper-face {
          margin-bottom: 8px;
          font-size: 22px;
          color: #9d8ce0;
        }

        .omk-paper-level {
          font-size: 50px;
          letter-spacing: 0.18em;
          text-indent: 0.18em;
          color: #4f64d8;
          text-shadow: 0 6px 15px rgba(79, 100, 216, 0.35);
          margin-bottom: 6px;
        }

        .omk-paper-caption {
          font-size: 11px;
          letter-spacing: 0.22em;
          color: #9a96b8;
        }

        .omk-info-row {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .omk-info-pill {
          flex: 1;
          padding: 10px 14px;
          border-radius: 16px;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.92),
            rgba(250, 244, 255, 0.95)
          );
          box-shadow: 0 6px 18px rgba(210, 187, 255, 0.18);
          border: 1px solid rgba(230, 222, 255, 0.8);
        }

        .omk-info-label {
          font-size: 11px;
          color: #a59fc3;
          margin-bottom: 2px;
          letter-spacing: 0.08em;
        }

        .omk-info-value {
          font-size: 13px;
          color: #433c68;
          font-weight: 600;
        }

        .omk-button {
          width: 100%;
          margin-bottom: 16px;
          padding: 12px 18px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: #fff;
          background: linear-gradient(90deg, #ff6b6b, #ff884d);
          box-shadow:
            0 14px 30px rgba(255, 120, 84, 0.45),
            0 0 0 1px rgba(255, 255, 255, 0.7);
          transform: translateY(0);
          transition:
            box-shadow 0.15s ease-out,
            transform 0.15s ease-out,
            filter 0.15s ease-out;
        }

        .omk-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow:
            0 18px 34px rgba(255, 120, 84, 0.6),
            0 0 0 1px rgba(255, 255, 255, 0.8);
          filter: brightness(1.03);
        }

        .omk-button:disabled {
          opacity: 0.7;
          cursor: default;
        }

        .omk-footer {
          text-align: center;
          font-size: 11px;
          line-height: 1.7;
          color: #b3afc5;
        }

        .omk-paper-shake {
          animation: omk-shake 0.7s ease-in-out;
        }

        @keyframes omk-shake {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          20% {
            transform: translateY(-6px) rotate(-2deg);
          }
          40% {
            transform: translateY(4px) rotate(2deg);
          }
          60% {
            transform: translateY(-3px) rotate(-1deg);
          }
          80% {
            transform: translateY(2px) rotate(1deg);
          }
          100% {
            transform: translateY(0) rotate(0deg);
          }
        }

        @keyframes omk-float-soft {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) translateX(6px) rotate(4deg);
          }
          100% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
        }

        @keyframes omk-sway {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(4px) rotate(6deg);
          }
          50% {
            transform: translateY(0) rotate(-4deg);
          }
          75% {
            transform: translateY(4px) rotate(3deg);
          }
          100% {
            transform: translateY(0) rotate(0deg);
          }
        }

        @keyframes omk-bubble {
          0% {
            transform: translateY(12px) scale(0.9);
            opacity: 0;
          }
          20% {
            opacity: 0.7;
          }
          80% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-22px) scale(1.05);
            opacity: 0;
          }
        }

        @media (max-width: 600px) {
          .omk-card-inner {
            padding: 22px 18px 22px;
          }
          .omk-paper-wrapper {
            width: 200px;
          }
        }
      `}</style>
    </>
  );
}

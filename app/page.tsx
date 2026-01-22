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

export default function Home() {
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchFortune() {
    setLoading(true);
    try {
      const res = await fetch("/api/daily-fortune");
      const data = (await res.json()) as Fortune;
      setFortune(data);
    } catch (e) {
      console.error("Failed to fetch fortune", e);
    } finally {
      setLoading(false);
    }
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
          {/* 简化小鸟居 */}
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
          {/* 垂下的小绳子 */}
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
          {/* 顶部说明 */}
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
            <div style={{ fontSize: 11, color: "#9ca3af" }}>
              {date || "加载中…"}
            </div>
          </div>

          {/* Q 版小脸 + 提示 */}
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
              同一天不管抽多少次，都是这支签哦。
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
              {/* 小红绳结 */}
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
              {/* Q 版表情 */}
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
              {/* 大字：凶吉 */}
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
              {/* 小注释 */}
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

          {/* 幸运信息 */}
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

          {/* 按钮 */}
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
            小提示：结果是按日期生成的日签，
            <br />
            不能刷出别的签，只能刷出同一支「今天的你」。
          </div>
        </div>
      </div>
    </div>
  );
}

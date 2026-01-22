'use client';

import React, { useEffect, useState } from 'react';

type FortuneLevel = '大吉' | '吉' | '小吉' | '凶' | string;

type Fortune = {
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
  luckyColor: string;
  luckyNumber: number;
};

const EMPTY_FORTUNE: Fortune = {
  date: '',
  name: 'あなた',
  overall: {
    level: '吉',
    score: 3,
    text: '',
  },
  career: {
    level: '吉',
    score: 3,
    text: '',
  },
  love: {
    level: '吉',
    score: 3,
    text: '',
  },
  luckyColor: '',
  luckyNumber: 0,
};

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function levelFace(level: FortuneLevel) {
  switch (level) {
    case '大吉':
      return 'ヽ(✿ﾟ▽ﾟ)ノ';
    case '吉':
      return '(*´∀`)♪';
    case '小吉':
      return '(◍•ᴗ•◍)';
    case '凶':
      return '(╥﹏╥)';
    default:
      return '(・ω・)';
  }
}

function levelColors(level: FortuneLevel) {
  // 卡片背景色 + 边框色
  switch (level) {
    case '大吉':
      return {
        bg: '#fff5d7',
        border: '#ffb74d',
        text: '#c75b00',
      };
    case '吉':
      return {
        bg: '#fff9e6',
        border: '#ffc36b',
        text: '#c47a00',
      };
    case '小吉':
      return {
        bg: '#fdf3ff',
        border: '#e0a6ff',
        text: '#9b4fdc',
      };
    case '凶':
      return {
        bg: '#f2f7ff',
        border: '#90a4ff',
        text: '#3f51b5',
      };
    default:
      return {
        bg: '#fff9f0',
        border: '#ffcc80',
        text: '#c47a00',
      };
  }
}

export default function Home() {
  const [fortune, setFortune] = useState<Fortune>(EMPTY_FORTUNE);
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);

  const fetchFortune = async () => {
    try {
      setLoading(true);
      setShaking(true);

      // 抖动一下
      setTimeout(() => {
        setShaking(false);
      }, 400);

      const res = await fetch('/api/daily-fortune');
      const data = await res.json();
      setFortune(data as Fortune);
    } catch (e) {
      console.error('Failed to fetch fortune', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 首次进入自动抽一次
    fetchFortune();
  }, []);

  const colors = levelColors(fortune.overall.level);
  const displayDate = formatDate(fortune.date);

  return (
    <div className="page">
      <div className="bgGradient" />
      <div className="center">
        <div className="tab">おみくじ</div>

        <div className="card">
          <div className="cardHeader">
            <div className="titleRow">
              <div className="dot" />
              <div className="title">今日おみくじ</div>
            </div>
            <div className="date">{displayDate}</div>
          </div>

          <div className="subtitle">
            <span>今日はあなたの</span>
            <span className="highlight">専属一签</span>
            <span>。</span>
            <br />
            <span>このデバイスで、今日はずっとこの一枚だけ。</span>
          </div>

          {/* 签卡 */}
          <div
            className={`omikujiWrapper ${
              shaking ? 'omikujiWrapper--shake' : ''
            }`}
          >
            <div
              className="omikujiCard"
              style={{
                backgroundColor: colors.bg,
                borderColor: colors.border,
              }}
            >
              <div className="omikujiTop">
                <span className="tag">おみくじ</span>
              </div>

              <div className="face">{levelFace(fortune.overall.level)}</div>
              <div
                className="level"
                style={{ color: colors.text }}
              >
                {fortune.overall.level || '吉'}
              </div>
              <div className="smallText">今日のきっぷ</div>
            </div>
          </div>

          {/* 信息区 */}
          <div className="infoRow">
            <div className="pill">
              <div className="pillLabel">ラッキーカラー</div>
              <div className="pillValue">
                {fortune.luckyColor || '—'}
              </div>
            </div>

            <div className="pill">
              <div className="pillLabel">ラッキーナンバー</div>
              <div className="pillValue">
                {fortune.luckyNumber || '—'}
              </div>
            </div>
          </div>

          {/* 按钮 */}
          <button
            className="drawButton"
            onClick={fetchFortune}
            disabled={loading}
          >
            {loading ? 'シャカシャカ中…' : 'もう一回ひきたい！(๑•̀ㅂ•́)و✧'}
          </button>

          {/* 提示文案 */}
          <div className="tip">
            <div>小提示：</div>
            <div>每台设备每天一签，换一个人 / 换一台设备，</div>
            <div>抽到的签运也许会完全不一样哦 ✨</div>
          </div>
        </div>
      </div>

      {/* 样式 */}
      <style jsx>{`
        .page {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          font-family: system-ui, -apple-system, BlinkMacSystemFont,
            'SF Pro Text', 'Helvetica Neue', 'PingFang SC', 'Hiragino Sans',
            'Yu Gothic', '微软雅黑', sans-serif;
          background: #fdf5ff;
        }

        .bgGradient {
          position: absolute;
          inset: 0;
          background: radial-gradient(
              circle at 20% 20%,
              rgba(255, 204, 204, 0.9),
              transparent 60%
            ),
            radial-gradient(
              circle at 80% 30%,
              rgba(204, 220, 255, 0.9),
              transparent 60%
            ),
            radial-gradient(
              circle at 50% 90%,
              rgba(255, 245, 204, 0.9),
              transparent 65%
            );
          animation: bgMove 25s ease-in-out infinite alternate;
          z-index: 0;
        }

        .center {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .tab {
          padding: 10px 36px;
          border-radius: 999px;
          background: linear-gradient(135deg, #e53935, #ff7043);
          color: #fff;
          font-size: 16px;
          letter-spacing: 0.12em;
          box-shadow: 0 8px 20px rgba(244, 81, 30, 0.4);
        }

        .card {
          width: 420px;
          max-width: 90vw;
          border-radius: 32px;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 20px 60px rgba(255, 152, 120, 0.26);
          padding: 28px 28px 26px;
          backdrop-filter: blur(16px);
        }

        .cardHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .titleRow {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff8a80, #ff5252);
          box-shadow: 0 0 8px rgba(255, 82, 82, 0.6);
        }

        .title {
          font-size: 18px;
          font-weight: 600;
          color: #444;
        }

        .date {
          font-size: 13px;
          color: #999;
        }

        .subtitle {
          font-size: 13px;
          color: #777;
          line-height: 1.6;
          margin-bottom: 18px;
        }

        .highlight {
          color: #ff5c7a;
          font-weight: 600;
        }

        .omikujiWrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .omikujiCard {
          width: 180px;
          height: 240px;
          border-radius: 24px;
          border: 2px solid;
          box-shadow: 0 16px 30px rgba(158, 158, 158, 0.22);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding-top: 22px;
          animation: float 3s ease-in-out infinite;
        }

        .omikujiTop {
          display: flex;
          justify-content: center;
          margin-bottom: 10px;
        }

        .tag {
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 11px;
          color: #ff7043;
          background: rgba(255, 224, 187, 0.7);
        }

        .face {
          font-size: 14px;
          color: #999;
          margin-bottom: 6px;
        }

        .level {
          font-size: 56px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .smallText {
          font-size: 11px;
          color: #999;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .infoRow {
          display: flex;
          gap: 12px;
          margin-bottom: 18px;
        }

        .pill {
          flex: 1;
          padding: 12px 14px;
          border-radius: 999px;
          background: #fafafa;
          border: 1px solid #f1e5ff;
        }

        .pillLabel {
          font-size: 11px;
          color: #999;
          margin-bottom: 4px;
        }

        .pillValue {
          font-size: 14px;
          font-weight: 500;
          color: #555;
        }

        .drawButton {
          width: 100%;
          margin: 4px 0 10px;
          padding: 12px 16px;
          border-radius: 999px;
          border: none;
          outline: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          background: linear-gradient(120deg, #ff5f6d, #ff8e53);
          box-shadow: 0 12px 25px rgba(255, 111, 97, 0.4);
          transition: transform 0.15s ease, box-shadow 0.15s ease,
            opacity 0.15s ease;
        }

        .drawButton:hover:not(:disabled) {
          transform: translateY(-1px) scale(1.01);
          box-shadow: 0 16px 30px rgba(255, 111, 97, 0.46);
        }

        .drawButton:active:not(:disabled) {
          transform: scale(0.96);
          box-shadow: 0 8px 18px rgba(255, 111, 97, 0.36);
        }

        .drawButton:disabled {
          opacity: 0.75;
          cursor: default;
        }

        .tip {
          text-align: center;
          font-size: 11px;
          color: #aaa;
          line-height: 1.5;
        }

        @keyframes bgMove {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-3%, 3%, 0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes shake {
          0% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          50% {
            transform: translateX(4px);
          }
          75% {
            transform: translateX(-3px);
          }
          100% {
            transform: translateX(0);
          }
        }

        .omikujiWrapper--shake .omikujiCard {
          animation: shake 0.35s ease;
        }

        @media (max-width: 480px) {
          .card {
            width: 340px;
            padding: 22px 18px 22px;
          }

          .omikujiCard {
            width: 160px;
            height: 220px;
          }

          .infoRow {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

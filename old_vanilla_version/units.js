export const units = [
  { id: 1, name: "시민", baseDamage: 10, period: 10, growth: 1.20, traits: [], recipe: {} },
  { id: 2, name: "농부", baseDamage: 50, period: 10, growth: 1.18, traits: [], recipe: {} },
  { id: 3, name: "광부", baseDamage: 40, period: 15, growth: 1.21, traits: [], recipe: {} },
  { id: 4, name: "대장장이", baseDamage: 80, period: 20, growth: 1.21, traits: [{ name: "탭 데미지 배율", base: 1, growth: 1.2 }], recipe: {} },
  { id: 5, name: "도둑", baseDamage: 5, period: 5, growth: 1.22, traits: [{ name: "골드 드랍 배율", base: 1, growth: 1.2 }], recipe: {} },
  { id: 6, name: "사냥꾼", baseDamage: 30, period: 18, growth: 1.215, traits: [], recipe: {} },
  { id: 7, name: "병사", baseDamage: 20, period: 12, growth: 1.205, traits: [], recipe: {} },
  { id: 8, name: "학자", baseDamage: 5, period: 10, growth: 1.23, traits: [{ name: "스와이프 주기 감소", base: 1, growth: 0.995 }], recipe: {} },
  { id: 9, name: "견습사제", baseDamage: 15, period: 12, growth: 1.205, traits: [{ name: "동료 데미지 배율", base: 1, growth: 1.2 }], recipe: {} },
  { id: 10, name: "이교도", baseDamage: 25, period: 10, growth: 1.21, traits: [{ name: "동료 공격 주기 감소", base: 0.995, growth: 0.995 }], recipe: {} },
  
  { id: 11, name: "약초꾼", baseDamage: 5000, period: 8, growth: 1.80, traits: [
      { name: "탭 데미지 배율", base: 1.5, growth: 1.5 },
      { name: "스와이프 주기 감소", base: 0.99, growth: 0.99 }
    ], recipe: { 1: 5, 2: 10 } },
  { id: 12, name: "전사", baseDamage: 10000, period: 10, growth: 1.80, traits: [{ name: "동료 데미지 배율", base: 1.5, growth: 1.5 }], recipe: { 1: 5, 7: 10 } },
  { id: 13, name: "광전사", baseDamage: 30000, period: 15, growth: 1.81, traits: [
      { name: "동료 데미지 배율", base: 1.5, growth: 1.5 },
      { name: "동료 공격 주기 감소", base: 0.99, growth: 0.99 }
    ], recipe: { 1: 5, 7: 5, 10: 10 } },
  { id: 14, name: "궁병", baseDamage: 4000, period: 5, growth: 1.815, traits: [], recipe: { 1: 5, 6: 10 } },
  { id: 15, name: "마법사", baseDamage: 15000, period: 12, growth: 1.805, traits: [], recipe: { 1: 5, 8: 10 } },
  { id: 16, name: "사제", baseDamage: 12000, period: 12, growth: 1.80, traits: [{ name: "동료 데미지 배율", base: 2, growth: 2 }], recipe: { 1: 5, 8: 5, 9: 10 } },
  { id: 17, name: "상인", baseDamage: 50000, period: 10, growth: 1.75, traits: [{ name: "주기적 골드 획득", base: 120, growth: 0.9057 }], recipe: { 1: 5, 2: 5, 3: 5, 4: 5 } },
  { id: 18, name: "음유시인", baseDamage: 6000, period: 6, growth: 1.80, traits: [
      { name: "동료 데미지 배율", base: 1.5, growth: 1.5 },
      { name: "골드 드랍 배율", base: 1.2, growth: 1.2 }
    ], recipe: { 1: 5, 5: 5, 6: 5, 7: 5 } },
  { id: 19, name: "흑마법사", baseDamage: 8000, period: 15, growth: 1.83, traits: [{ name: "동료 공격 주기 감소", base: 0.99, growth: 0.99 }], recipe: { 1: 5, 15: 5, 10: 10 } },
  { id: 20, name: "추방자", baseDamage: 9000, period: 5, growth: 1.81, traits: [{ name: "골드 드랍 배율", base: 1.5, growth: 1.5 }], recipe: { 1: 5, 5: 5, 6: 5, 10: 10 } },
  
  { id: 21, name: "기사", baseDamage: 5000000, period: 10, growth: 2.50, traits: [
      { name: "탭 데미지 배율", base: 200, growth: 2 },
      { name: "동료 데미지 배율", base: 200, growth: 2 }
    ], recipe: { 1: 10, 4: 10, 7: 10, 12: 10 } },
  { id: 22, name: "연금술사", baseDamage: 1000000, period: 15, growth: 2.52, traits: [{ name: "주기적 아이템 획득", base: 120, growth: 0.9117 }], recipe: { 1: 10, 8: 10, 11: 10 } },
  { id: 23, name: "대상인", baseDamage: 20000000, period: 10, growth: 2.45, traits: [{ name: "주기적 골드 획득", base: 60, growth: 0.8951 }], recipe: { 1: 10, 11: 5, 17: 10, 18: 5 } },
  { id: 24, name: "백마법사", baseDamage: 8000000, period: 12, growth: 2.505, traits: [
      { name: "스와이프 주기 감소", base: 0.95, growth: 0.99 },
      { name: "동료 데미지 배율", base: 500, growth: 3 }
    ], recipe: { 1: 10, 15: 10, 16: 5 } },
  { id: 25, name: "암살자", baseDamage: 2000000, period: 4, growth: 2.51, traits: [
      { name: "동료 공격 주기 감소", base: 0.95, growth: 0.99 },
      { name: "골드 드랍 배율", base: 27, growth: 3 }
    ], recipe: { 1: 10, 5: 10, 18: 5, 20: 5 } },
  
  { id: 26, name: "대마법사", baseDamage: 10000000000, period: 12, growth: 4.0, traits: [
      { name: "탭 데미지 배율", base: 50000, growth: 4 },
      { name: "스와이프 주기 감소", base: 0.925, growth: 0.9875 },
      { name: "동료 데미지 배율", base: 50000, growth: 4 },
      { name: "동료 공격 주기 감소", base: 0.925, growth: 0.9875 }
    ], recipe: { 1: 20, 15: 10, 19: 5, 24: 5 } },
  { id: 27, name: "성기사", baseDamage: 50000000000, period: 5, growth: 3.5, traits: [
      { name: "탭 데미지 배율", base: 25000, growth: 5 },
      { name: "스와이프 주기 감소", base: 0.95, growth: 0.99 },
      { name: "동료 데미지 배율", base: 25000, growth: 5 },
      { name: "동료 공격 주기 감소", base: 0.95, growth: 0.99 }
    ], recipe: { 1: 20, 9: 20, 16: 10, 21: 5 } },
  { id: 28, name: "암흑기사", baseDamage: 500000000000, period: 25, growth: 3.2, traits: [
      { name: "탭 데미지 배율", base: 100000, growth: 3 },
      { name: "스와이프 주기 감소", base: 0.9, growth: 0.985 },
      { name: "동료 데미지 배율", base: 100000, growth: 3 },
      { name: "동료 공격 주기 감소", base: 0.9, growth: 0.985 }
    ], recipe: { 1: 20, 10: 20, 13: 10, 21: 5 } },
  
  { id: 29, name: "요리사", baseDamage: 6000, period: 12, growth: 1.7, traits: [{ name: "동료 데미지 배율", base: 1, growth: 1.2 }], recipe: { 1: 10, 2: 10, 3: 10 } },
  { id: 30, name: "서기관", baseDamage: 4000, period: 10, growth: 1.8, traits: [{ name: "동료 공격 주기 감소", base: 1, growth: 0.99 }], recipe: { 1: 10, 8: 10, 3: 10 } },
  { id: 31, name: "도박사", baseDamage: 10000, period: 8, growth: 1.5, traits: [{ name: "골드 드랍 배율", base: 1, growth: 1.2 }], recipe: { 1: 10, 5: 10 } },
  { id: 32, name: "정찰병", baseDamage: 8000, period: 14, growth: 1.75, traits: [{ name: "스와이프 주기 감소", base: 0.99, growth: 0.99 }], recipe: { 1: 10, 6: 10, 5: 10 } },
  { id: 33, name: "스파이", baseDamage: 7000, period: 6, growth: 1.8, traits: [{ name: "동료 공격 주기 감소", base: 0.99, growth: 0.99 }], recipe: { 1: 10, 5: 10, 8: 10 } },
  { id: 34, name: "유목민", baseDamage: 9000, period: 11, growth: 1.7, traits: [{ name: "골드 드랍 배율", base: 1, growth: 1.2 }], recipe: { 1: 10, 2: 10, 6: 10 } },
  { id: 35, name: "수도승", baseDamage: 12000, period: 9, growth: 1.75, traits: [{ name: "탭 데미지 배율", base: 1, growth: 1.2 }], recipe: { 1: 10, 9: 10, 7: 10 } },
  { id: 36, name: "결투가", baseDamage: 13000, period: 6, growth: 1.8, traits: [{ name: "탭 데미지 배율", base: 1, growth: 1.2 }], recipe: { 1: 10, 7: 10, 5: 10 } },
  { id: 37, name: "총잡이", baseDamage: 15000, period: 16, growth: 1.85, traits: [{ name: "동료 데미지 배율", base: 1, growth: 1.2 }], recipe: { 1: 10, 6: 10, 3: 10 } },
  
  { id: 38, name: "형상변환자", baseDamage: 6000000, period: 9, growth: 2.5, traits: [
      { name: "골드 드랍 배율", base: 200, growth: 2.5 },
      { name: "동료 데미지 배율", base: 200, growth: 2.5 }
    ], recipe: { 1: 15, 11: 10, 32: 10 } },
  { id: 39, name: "전술가", baseDamage: 4000000, period: 12, growth: 2.4, traits: [
      { name: "동료 공격 주기 감소", base: 0.95, growth: 0.98 },
      { name: "동료 데미지 배율", base: 200, growth: 2.5 }
    ], recipe: { 1: 15, 7: 20, 30: 10 } },
  { id: 40, name: "요술사", baseDamage: 6000000, period: 14, growth: 2.5, traits: [
      { name: "탭 데미지 배율", base: 200, growth: 2.5 },
      { name: "동료 데미지 배율", base: 200, growth: 2.5 }
    ], recipe: { 1: 15, 9: 20, 30: 10 } },
  { id: 41, name: "지질학자", baseDamage: 8000000, period: 18, growth: 2.45, traits: [
      { name: "스와이프 주기 감소", base: 0.95, growth: 0.98 },
      { name: "탭 데미지 배율", base: 200, growth: 2.5 }
    ], recipe: { 1: 15, 3: 20, 9: 20 } },
  { id: 42, name: "오컬티스트", baseDamage: 7000000, period: 13, growth: 2.5, traits: [
      { name: "동료 데미지 배율", base: 200, growth: 2.5 },
      { name: "골드 드랍 배율", base: 200, growth: 2.5 }
    ], recipe: { 1: 15, 10: 20, 30: 10 } },
  { id: 43, name: "드루이드", baseDamage: 6000000, period: 11, growth: 2.5, traits: [
      { name: "동료 공격 주기 감소", base: 0.95, growth: 0.98 },
      { name: "동료 데미지 배율", base: 200, growth: 2.5 }
    ], recipe: { 1: 15, 11: 10, 34: 10 } },
  { id: 44, name: "정령술사", baseDamage: 9000000, period: 14, growth: 2.55, traits: [
      { name: "동료 데미지 배율", base: 200, growth: 2.5 },
      { name: "스와이프 주기 감소", base: 0.95, growth: 0.98 }
    ], recipe: { 1: 15, 41: 10, 19: 10 } },
  { id: 45, name: "환술사", baseDamage: 5000000, period: 9, growth: 2.48, traits: [
      { name: "스와이프 주기 감소", base: 0.95, growth: 0.98 },
      { name: "골드 드랍 배율", base: 200, growth: 2.5 }
    ], recipe: { 1: 15, 40: 10, 5: 20 } },
  
  { id: 46, name: "야수조련사", baseDamage: 40000000000, period: 10, growth: 3.4, traits: [
      { name: "동료 데미지 배율", base: 50000, growth: 4 },
      { name: "동료 공격 주기 감소", base: 0.925, growth: 0.985 }
    ], recipe: { 1: 20, 43: 10, 38: 10 } },
  { id: 47, name: "바이킹", baseDamage: 300000000000, period: 8, growth: 3.5, traits: [], recipe: { 1: 20, 13: 20, 34: 10 } },
  { id: 48, name: "강령술사", baseDamage: 40000000000, period: 13, growth: 3.4, traits: [
      { name: "골드 드랍 배율", base: 50000, growth: 4 },
      { name: "동료 데미지 배율", base: 50000, growth: 4 },
      { name: "스와이프 주기 감소", base: 0.925, growth: 0.985 }
    ], recipe: { 1: 20, 19: 20, 42: 10 } },
  { id: 49, name: "주술사", baseDamage: 35000000000, period: 12, growth: 3.3, traits: [
      { name: "주기적 아이템 획득", base: 20, growth: 1 },
      { name: "동료 데미지 배율", base: 50000, growth: 4 },
      { name: "동료 공격 주기 감소", base: 0.925, growth: 0.985 }
    ], recipe: { 1: 20, 41: 10, 18: 10 } },
  { id: 50, name: "마궁수", baseDamage: 45000000000, period: 8, growth: 3.5, traits: [
      { name: "동료 데미지 배율", base: 50000, growth: 4 },
      { name: "탭 데미지 배율", base: 50000, growth: 4 },
      { name: "스와이프 주기 감소", base: 0.925, growth: 0.985 }
    ], recipe: { 1: 20, 14: 20, 40: 10 } },
  { id: 51, name: "템플러", baseDamage: 55000000000, period: 7, growth: 3.6, traits: [
      { name: "동료 데미지 배율", base: 50000, growth: 4 },
      { name: "탭 데미지 배율", base: 50000, growth: 4 },
      { name: "동료 공격 주기 감소", base: 0.925, growth: 0.985 }
    ], recipe: { 1: 20, 21: 10, 16: 20 } },
  { id: 52, name: "혈기사", baseDamage: 60000000000, period: 8, growth: 3.4, traits: [
      { name: "탭 데미지 배율", base: 50000, growth: 4 },
      { name: "스와이프 주기 감소", base: 0.925, growth: 0.985 },
      { name: "골드 드랍 배율", base: 50000, growth: 4 }
    ], recipe: { 1: 20, 13: 10, 42: 10 } },
  { id: 53, name: "감시자", baseDamage: 50000000000, period: 10, growth: 3.3, traits: [
      { name: "동료 공격 주기 감소", base: 0.925, growth: 0.985 },
      { name: "스와이프 주기 감소", base: 0.925, growth: 0.985 },
      { name: "동료 데미지 배율", base: 50000, growth: 4 }
    ], recipe: { 1: 20, 43: 10, 15: 10 } },
  { id: 54, name: "사무라이", baseDamage: 70000000000, period: 6, growth: 3.8, traits: [
      { name: "스와이프 주기 감소", base: 0.925, growth: 0.985 },
      { name: "탭 데미지 배율", base: 50000, growth: 4 },
      { name: "동료 데미지 배율", base: 50000, growth: 4 }
    ], recipe: { 1: 20, 36: 10, 12: 20 } },
  
  { id: 55, name: "야수군주", baseDamage: 3000000000000000, period: 4, growth: 6.4, traits: [], recipe: {} },
  { id: 56, name: "초월자", baseDamage: 150000000000000, period: 5, growth: 7.0, traits: [
      { name: "탭 데미지 배율", base: 5000000, growth: 10 },
      { name: "동료 데미지 배율", base: 5000000, growth: 10 },
      { name: "골드 드랍 배율", base: 5000000, growth: 10 },
      { name: "동료 공격 주기 감소", base: 0.9, growth: 0.98 }
    ], recipe: { 1: 30, 27: 10, 26: 10 } },
  { id: 57, name: "시공술사", baseDamage: 80000000000000, period: 10, growth: 7.2, traits: [
      { name: "동료 공격 주기 감소", base: 0.9, growth: 0.98 },
      { name: "스와이프 주기 감소", base: 0.9, growth: 0.98 },
      { name: "동료 데미지 배율", base: 5000000, growth: 10 },
      { name: "골드 드랍 배율", base: 5000000, growth: 10 }
    ], recipe: { 1: 30, 26: 10, 45: 10 } },
  { id: 58, name: "공허의마법사", baseDamage: 200000000000000, period: 15, growth: 6.8, traits: [
      { name: "동료 데미지 배율", base: 5000000, growth: 10 },
      { name: "주기적 아이템 획득", base: 10, growth: 1 },
      { name: "동료 공격 주기 감소", base: 0.9, growth: 0.98 },
      { name: "스와이프 주기 감소", base: 0.9, growth: 0.98 }
    ], recipe: { 1: 30, 28: 10, 26: 10 } },
  { id: 59, name: "팔라딘", baseDamage: 120000000000000, period: 8, growth: 6.5, traits: [
      { name: "동료 데미지 배율", base: 5000000, growth: 10 },
      { name: "탭 데미지 배율", base: 5000000, growth: 10 },
      { name: "동료 공격 주기 감소", base: 0.9, growth: 0.98 },
      { name: "골드 드랍 배율", base: 5000000, growth: 10 }
    ], recipe: {} },
  { id: 60, name: "인형술사", baseDamage: 90000000000000, period: 9, growth: 6.9, traits: [
     { name: "스와이프 주기 감소", base: 0.9, growth: 0.98 },
     { name: "동료 공격 주기 감소", base: 0.9, growth: 0.98 },
     { name: "골드 드랍 배율", base: 5000000, growth: 10 },
     { name: "탭 데미지 배율", base: 5000000, growth: 10 }
    ], recipe: {} },
  { id: 61, name: "스칼드", baseDamage: 50000000000000, period: 7, growth: 6.7, traits: [
      { name: "동료 데미지 배율", base: 5000000, growth: 10 },
      { name: "골드 드랍 배율", base: 5000000, growth: 10 },
      { name: "동료 공격 주기 감소", base: 0.9, growth: 0.98 },
      { name: "탭 데미지 배율", base: 5000000, growth: 10 }
    ], recipe: {} }
];

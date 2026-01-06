"use client";

import { useState, useMemo } from 'react';
import { units, Unit } from '@/data/units';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Calculator, 
  BookOpen, 
  Search, 
  Sword, 
  Zap, 
  TrendingUp, 
  Sparkles, 
  Package,
  Layers,
  Hammer,
  Trophy,
  Star,
  Swords,
  Activity,
  Coins
} from "lucide-react";

const RECOMMENDED_COMBINATIONS = [
  {
    title: "최적 유틸 조합",
    subtitle: "버프 & 파밍 밸런스",
    description: "4성 최강 바이킹과 대마법사를 딜러로 세우고, 주술사와 야수조련사의 버프 및 유틸리티를 극대화한 조합입니다.",
    units: [47, 26, 49, 27, 46], // 바이킹, 대마법사, 주술사, 성기사, 야수조련사
    tags: ["동료버프", "파밍 효율", "안정성"],
    color: "blue",
    tier: 4
  },
  {
    title: "5성 빌드업 정석",
    subtitle: "T5 유닛 제작 예비 단계",
    description: "성장률이 높은 4성 바이킹을 중심으로, 최종 5성 유닛(초월자, 야수군주 등)으로 넘어가기 전 가장 효율적인 빌드업 라인입니다.",
    units: [47, 26, 27, 28, 46], // 바이킹, 대마법사, 성기사, 암흑기사, 야수조련사
    tags: ["5성 준비", "재료 선점", "높은 성장"],
    color: "emerald",
    tier: 4
  },
  {
    title: "신적 존재의 강림",
    subtitle: "T5 종결 스쿼드",
    description: "성장률 7.0~7.5에 달하는 신계의 유닛들입니다. 특히 야수군주(7.5)의 합류로 물리칠 수 없는 절대 화력을 완성했습니다.",
    units: [55, 56, 57, 58, 61], // 야수군주, 초월자, 시공술사, 공허의마법사, 스칼드
    tags: ["T5 종결", "성장률 7.5", "최종 목적지"],
    color: "orange",
    tier: 5
  }
];

const getTier = (id: number) => {
  if (id <= 10) return 1;
  if ((id >= 11 && id <= 20) || (id >= 29 && id <= 37)) return 2;
  if ((id >= 21 && id <= 25) || (id >= 38 && id <= 45)) return 3;
  if ((id >= 26 && id <= 28) || (id >= 46 && id <= 54)) return 4;
  return 5;
};

const getTierColor = (tier: number) => {
  switch (tier) {
    case 1: return "text-slate-400 border-slate-500/50 bg-slate-500/10";
    case 2: return "text-emerald-400 border-emerald-500/50 bg-emerald-500/10";
    case 3: return "text-blue-400 border-blue-500/50 bg-blue-500/10";
    case 4: return "text-purple-400 border-purple-500/50 bg-purple-500/10";
    case 5: return "text-orange-400 border-orange-500/50 bg-orange-500/10";
    default: return "text-slate-400 border-slate-500/50 bg-slate-500/10";
  }
};

const formatNumber = (num: number | string) => {
  if (typeof num === 'string') return num;
  if (num === Infinity) return "∞";
  if (num >= 10000) {
    return num.toExponential(2).replace('+', '');
  }
  return num.toLocaleString();
};

const calculateBigDPS = (unit: Unit) => {
  const tier = getTier(unit.id);
  let maxLevel = 800;
  if (tier === 1) maxLevel = 100;
  else if (tier === 2) maxLevel = 200;
  else if (tier === 3) maxLevel = 400;
  
  const level = maxLevel - 1; // 성장은 레벨-1회 발생
  const baseDamage = unit.baseDamage;
  const growth = unit.growth;
  const attackInterval = unit.period * 0.1;

  // log10(DPS) = log10(baseDamage) + level * log10(growth) - log10(interval)
  const logDPS = Math.log10(baseDamage) + level * Math.log10(growth) - Math.log10(attackInterval);
  
  const exponent = Math.floor(logDPS);
  const mantissa = Math.pow(10, logDPS - exponent);

  if (exponent < 4) return (Math.pow(10, logDPS)).toLocaleString(undefined, { maximumFractionDigits: 0 });
  return `${mantissa.toFixed(2)}e${exponent}`;
};

const unitMap: Record<number, Unit> = {};
units.forEach(u => unitMap[u.id] = u);

const getFullBreakdown = (unitId: number, multiplier: number = 1): Record<number, number> => {
  const unit = unitMap[unitId];
  if (!unit) return {};
  const recipe = unit.recipe || {};
  const ingredientIds = Object.keys(recipe);
  if (ingredientIds.length === 0) return { [unitId]: multiplier };
  const breakdown: Record<number, number> = {};
  for (const [id, count] of Object.entries(recipe)) {
    const subBreakdown = getFullBreakdown(parseInt(id), count * multiplier);
    for (const [subId, subCount] of Object.entries(subBreakdown)) {
      const sid = parseInt(subId);
      breakdown[sid] = (breakdown[sid] || 0) + subCount;
    }
  }
  return breakdown;
};

export default function Home() {
  const [targetUnitId, setTargetUnitId] = useState<string>("56");
  const [targetCount, setTargetCount] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("all");

  const selectedUnit = unitMap[parseInt(targetUnitId)];

  const calculation = useMemo(() => {
    if (!selectedUnit) return null;
    const scaledBreakdown = getFullBreakdown(parseInt(targetUnitId), targetCount);
    const totalBaseUnits = Object.values(scaledBreakdown).reduce((a, b) => a + b, 0);
    return { totalBaseUnits, scaledBreakdown };
  }, [targetUnitId, targetCount, selectedUnit]);

  const filteredUnits = useMemo(() => {
    let result = units;
    if (searchQuery) {
      result = result.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (selectedTier !== "all") {
      result = result.filter(u => getTier(u.id) === parseInt(selectedTier));
    }
    return result;
  }, [searchQuery, selectedTier]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* 헤더 */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-xl font-bold text-white tracking-tight">Pixel Unit 도감</h1>
          <p className="text-slate-500 text-xs mt-0.5">유닛 정보 및 제작 재료 가이드</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <Tabs defaultValue="recipe" className="space-y-12">
          {/* 탭 메뉴 */}
          <div className="flex justify-start sm:justify-center overflow-x-auto pb-2 scrollbar-hide">
            <TabsList className="bg-slate-900 border border-slate-800 p-1 h-14 sm:h-16 rounded-xl sm:rounded-2xl shadow-2xl flex-shrink-0">
              <TabsTrigger 
                value="recipe" 
                className="px-6 sm:px-10 md:px-14 h-full text-sm sm:text-base font-bold transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-xl rounded-lg sm:rounded-xl gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="whitespace-nowrap">유닛 도감</span>
              </TabsTrigger>
              {/* <TabsTrigger 
                value="recommend" 
                className="px-6 sm:px-10 md:px-14 h-full text-sm sm:text-base font-bold transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-xl rounded-lg sm:rounded-xl gap-2 cursor-pointer"
              >
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="whitespace-nowrap">추천 조합</span>
              </TabsTrigger>
              <TabsTrigger 
                value="calculator" 
                className="px-6 sm:px-10 md:px-14 h-full text-sm sm:text-base font-bold transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-xl rounded-lg sm:rounded-xl gap-2 cursor-pointer"
              >
                <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="whitespace-nowrap">계산기</span>
              </TabsTrigger> */}
            </TabsList>
          </div>

          {/* 계산기 탭 */}
          {/* <TabsContent value="calculator" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              ... (Calculator content omitted for brevity in comment) ...
              <div className="lg:col-span-1 space-y-6">
                <Card className="bg-slate-900 border-slate-800 shadow-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-white font-semibold">제작 목표</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">대상 유닛</label>
                      <Select value={targetUnitId} onValueChange={setTargetUnitId}>
                        <SelectTrigger className="h-12 bg-slate-950 border-slate-800 text-white focus:ring-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800">
                          {units.filter(u => Object.keys(u.recipe).length > 0).map(u => (
                            <SelectItem 
                              key={u.id} 
                              value={u.id.toString()}
                              className="text-slate-200 focus:bg-blue-600 focus:text-white"
                            >
                              {u.name} <span className="text-slate-500 text-xs ml-2">T{getTier(u.id)}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">목표 수량</label>
                      <Input 
                        type="number" 
                        value={targetCount}
                        onChange={(e) => setTargetCount(Math.max(1, parseInt(e.target.value) || 1))}
                        className="h-12 text-xl text-center font-bold bg-slate-950 border-slate-800 text-white focus:ring-blue-500"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-600 border-none shadow-xl overflow-hidden relative group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <div className="w-24 h-24 border-8 border-white rounded-full" />
                  </div>
                  <CardContent className="py-8 relative z-10">
                    <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-2">총 1성 유닛 필요량</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-4xl font-black text-white">
                        {calculation?.totalBaseUnits.toLocaleString()}
                      </p>
                      <span className="text-blue-100 text-lg font-bold">개</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-8">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <Card className="bg-[#0B1120] border-slate-800 shadow-2xl overflow-hidden rounded-xl">
                    <CardHeader className="pb-5 px-6 pt-6">
                      <CardTitle className="text-xl text-white font-bold">직계 조합 재료</CardTitle>
                    </CardHeader>
                    <div className="h-[1px] bg-slate-800 w-full" />
                    <CardContent className="p-6 pt-8 space-y-4">
                      {Object.keys(selectedUnit?.recipe || {}).length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-slate-500 italic mb-2">기초 유닛입니다.</p>
                          <p className="text-slate-400 text-sm">추가 조합 재료가 필요하지 않습니다.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {Object.entries(selectedUnit?.recipe || {}).map(([id, count]) => {
                            const ingredient = unitMap[parseInt(id)];
                            const totalNeeded = count * targetCount;
                            const oneStarEquivalent = Object.values(getFullBreakdown(parseInt(id), totalNeeded)).reduce((a, b) => a + b, 0);
                            
                            return (
                              <div key={id} className="bg-[#0f172a]/50 p-6 rounded-2xl border border-slate-800 space-y-4">
                                <div className="flex justify-between items-start">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <p className="text-2xl font-black text-white">{ingredient?.name}</p>
                                      <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-500 font-mono">T{getTier(ingredient.id)}</Badge>
                                    </div>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">개당 {count}개 필요 (총 {totalNeeded.toLocaleString()}개)</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-3xl font-black text-blue-500 leading-none">
                                      {totalNeeded.toLocaleString()}
                                    </p>
                                    <p className="text-[10px] font-black text-slate-500 mt-1 uppercase">필요 수량</p>
                                  </div>
                                </div>

                                {Object.keys(ingredient?.recipe || {}).length > 0 && (
                                  <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50 space-y-2">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                      <Hammer className="w-3 h-3" /> 하위 직계 재료
                                    </p>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                      {Object.entries(ingredient.recipe).map(([subId, subCount]) => (
                                        <div key={subId} className="flex justify-between text-[11px]">
                                          <span className="text-slate-400">{unitMap[parseInt(subId)]?.name}</span>
                                          <span className="text-slate-200 font-bold">x{subCount}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <div className="flex justify-between items-center pt-2 border-t border-slate-800/50">
                                  <div className="flex items-center gap-1.5">
                                    <Sparkles className="w-3 h-3 text-blue-500" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase">1성 환산 합계</span>
                                  </div>
                                  <span className="text-sm font-black text-blue-400/80">
                                    {oneStarEquivalent.toLocaleString()} <span className="text-[10px] text-slate-500 ml-0.5">UNIT</span>
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-[#0B1120] border-slate-800 shadow-2xl overflow-hidden rounded-xl">
                    <CardHeader className="pb-5 px-6 pt-6">
                      <CardTitle className="text-xl text-white font-bold">기초 재료 상세</CardTitle>
                    </CardHeader>
                    <div className="h-[1px] bg-slate-800 w-full" />
                    <CardContent className="p-8 pt-10">
                      <div className="space-y-6">
                        {Object.entries(calculation?.scaledBreakdown || {})
                          .sort((a, b) => b[1] - a[1])
                          .map(([id, count]) => (
                            <div key={id} className="flex justify-between items-center">
                              <span className="text-slate-400 text-lg">
                                {unitMap[parseInt(id)]?.name}
                              </span>
                              <span className="text-white font-mono font-bold text-xl">
                                {count.toLocaleString()}
                              </span>
                            </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent> */}

          {/* 도감 탭 */}
          <TabsContent value="recipe" className="space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* 검색 및 필터 */}
            <div className="flex flex-col gap-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-xl">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input 
                  placeholder="유닛 이름을 검색하세요..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border-slate-800 pl-11 h-14 text-base focus:ring-blue-500 w-full rounded-xl"
                />
              </div>
              <div className="flex justify-center">
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto overflow-x-auto scrollbar-hide">
                  {['all', '1', '2', '3', '4', '5'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTier(t)}
                      className={`px-6 sm:px-8 py-2.5 rounded-lg text-xs font-black transition-all whitespace-nowrap flex-grow sm:flex-grow-0 ${
                        selectedTier === t 
                          ? 'bg-blue-600 text-white shadow-lg' 
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {t === 'all' ? 'ALL' : `T${t}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2">
              <div className="h-px bg-slate-800 flex-grow" />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                검색된 유닛 수: <span className="text-blue-400">{filteredUnits.length}</span>
              </p>
              <div className="h-px bg-slate-800 flex-grow" />
            </div>

            {/* 유닛 목록 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {filteredUnits.map((u) => {
                const tier = getTier(u.id);
                const maxLv = tier === 1 ? 100 : tier === 2 ? 200 : tier === 3 ? 400 : 800;
                const breakdown = getFullBreakdown(u.id, 1);
                const totalBaseCount = Object.values(breakdown).reduce((a, b) => a + b, 0);
                const dpsData = calculateBigDPS(u);

                return (
                  <Card key={u.id} className="bg-slate-900 border-slate-800 hover:border-blue-500/50 transition-all rounded-xl sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl group">
                    <CardHeader className="p-5 sm:p-8 pb-4 sm:pb-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 bg-blue-600/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                      <div className="flex justify-between items-start relative z-10">
                        <div className="space-y-1">
                          <CardTitle className="text-xl sm:text-2xl text-white font-black tracking-tight group-hover:text-blue-400 transition-colors uppercase italic">{u.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-0.5">Rank {tier === 5 ? 4 : (tier === 4 ? 3 : (tier === 3 ? 2 : (tier === 2 ? 1 : 0)))} UNIT</p>
                            <span className="text-[10px] text-slate-600 font-bold tracking-tight">| 환산 {totalBaseCount.toLocaleString()}</span>
                          </div>
                        </div>
                        <Badge className={`${getTierColor(tier)} px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] font-black border-none shadow-lg`}>
                          TIER {tier}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="p-5 sm:p-8 space-y-6 sm:space-y-8 flex-grow relative z-10">
                      {/* 스탯 표시 */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="bg-slate-950/50 p-3 sm:p-4 rounded-xl border border-slate-800/50">
                          <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                            <Sword className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-wider">기본 데미지</span>
                          </div>
                          <p className="text-xs sm:text-sm font-black text-white">{formatNumber(u.baseDamage)}</p>
                        </div>
                        <div className="bg-slate-950/50 p-3 sm:p-4 rounded-xl border border-slate-800/50">
                          <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                            <Zap className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-wider">공격 주기</span>
                          </div>
                          <p className="text-xs sm:text-sm font-black text-white">{u.period * 100}ms</p>
                        </div>
                        <div className="bg-slate-950/50 p-3 sm:p-4 rounded-xl border border-slate-800/50">
                          <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-wider">성장률</span>
                          </div>
                          <p className="text-xs sm:text-sm font-black text-blue-400">{u.growth}</p>
                        </div>
                        <div className="bg-blue-600/10 p-3 sm:p-4 rounded-xl border border-blue-500/20">
                          <div className="flex items-center gap-1.5 text-blue-400 mb-1">
                            <Activity className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-wider">{maxLv}레벨 DPS</span>
                          </div>
                          <p className="text-xs sm:text-sm font-black text-blue-400">{dpsData}</p>
                        </div>
                      </div>

                      {/* 제작 재료 */}
                      {Object.keys(u.recipe).length > 0 && (
                        <div className="space-y-6 sm:space-y-8">
                          <div className="space-y-3">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                              <Package className="w-4 h-4 text-blue-500" /> 직계 조합 재료
                            </p>
                            <div className="bg-slate-950 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-800/60 shadow-inner">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                                {Object.entries(u.recipe).map(([ingId, count]) => (
                                  <div key={ingId} className="flex justify-between items-center text-[10px] sm:text-xs">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-slate-400 font-medium">{unitMap[parseInt(ingId)]?.name}</span>
                                      <Badge variant="outline" className="text-[8px] py-0 px-1 border-slate-800 text-slate-600 uppercase">T{getTier(parseInt(ingId))}</Badge>
                                    </div>
                                    <span className="text-white font-black italic">x{count}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-emerald-500" /> 1성 기초 재료 상세
                            </p>
                            <div className="bg-slate-950 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-800/60 shadow-inner">
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                                {Object.entries(breakdown)
                                  .sort((a, b) => b[1] - a[1])
                                  .map(([bid, bcount]) => (
                                    <div key={bid} className="flex justify-between items-center text-[10px]">
                                      <span className="text-slate-400 font-medium truncate mr-1.5">{unitMap[parseInt(bid)]?.name}</span>
                                      <span className="text-white font-black italic shrink-0">x{bcount}</span>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 특성 */}
                      {u.traits.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-purple-500" /> 유닛 특성 및 버프
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {u.traits.map((trait, idx) => (
                              <div key={idx} className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-300 flex items-center gap-2">
                                <span>{trait.name}</span>
                                <span className="text-blue-500 uppercase">x{trait.growth}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* 추천 조합 탭 */}
          {/* <TabsContent value="recommend" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            ... (Recommend content omitted for brevity in comment) ...
            <div className="max-w-4xl mx-auto text-center space-y-4 mb-8">
              <h2 className="text-3xl font-black text-white tracking-tight">4성 최적 조합 가이드</h2>
              <p className="text-slate-400 leading-relaxed uppercase text-xs font-black tracking-widest">
                800레벨 기대 DPS와 1성 재료 효율을 분석한 5가지 핵심 전략
              </p>
            </div>

            <div className="space-y-16">
              {[4, 5].map(tier => {
                const tierCombos = RECOMMENDED_COMBINATIONS.filter(c => c.tier === tier);
                if (tierCombos.length === 0) return null;

                return (
                  <div key={tier} className="space-y-8">
                    <div className="flex items-center gap-4 px-2">
                      <div className="h-px flex-grow bg-slate-800"></div>
                      <h3 className="text-xl font-black text-white flex items-center gap-2">
                        <Star className={`w-5 h-5 ${tier === 5 ? 'text-orange-400' : 'text-blue-400'}`} />
                        Tier {tier} 추천 조합
                      </h3>
                      <div className="h-px flex-grow bg-slate-800"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {tierCombos.map((combo, idx) => {
                        const totalBreakdown: Record<number, number> = {};
                        combo.units.forEach(unitId => {
                          const breakdown = getFullBreakdown(unitId, 1);
                          Object.entries(breakdown).forEach(([id, count]) => {
                            const bid = parseInt(id);
                            totalBreakdown[bid] = (totalBreakdown[bid] || 0) + count;
                          });
                        });

                        const totalUnits = Object.values(totalBreakdown).reduce((a, b) => a + b, 0);

                        let maxLogDPS = -Infinity;
                        combo.units.forEach(unitId => {
                          const unit = unitMap[unitId];
                          if (!unit) return;
                          const uTier = getTier(unit.id);
                          let mLevel = 800;
                          if (uTier === 1) mLevel = 100;
                          else if (uTier === 2) mLevel = 200;
                          else if (uTier === 3) mLevel = 400;
                          
                          const currentLogDPS = Math.log10(unit.baseDamage) + (mLevel - 1) * Math.log10(unit.growth) - Math.log10(unit.period * 0.1);
                          if (currentLogDPS > maxLogDPS) maxLogDPS = currentLogDPS;
                        });
                        
                        const exp = Math.floor(maxLogDPS);
                        const mant = Math.pow(10, maxLogDPS - exp);
                        const comboTotalDPS = exp < 4 ? Math.pow(10, maxLogDPS).toLocaleString() : `${mant.toFixed(2)}e${exp}`;

                        return (
                          <Card key={idx} className="bg-[#0B1120] border-slate-800 hover:border-blue-500/50 transition-all rounded-2xl overflow-hidden flex flex-col shadow-2xl group">
                            <CardHeader className={`p-8 pb-6 border-b border-slate-800/50 bg-${combo.color}-600/10`}>
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Star className={`w-5 h-5 text-${combo.color}-400 fill-${combo.color}-400/20`} />
                                    <CardTitle className="text-2xl text-white font-black tracking-tight">{combo.title}</CardTitle>
                                  </div>
                                  <p className="text-slate-400 font-bold text-sm">{combo.subtitle}</p>
                                </div>
                                <Badge className={`${getTierColor(tier)} px-3 py-1 text-[10px]`}>
                                  {tier === 5 ? 'END-GAME' : 'BEST 4-STAR'}
                                </Badge>
                              </div>
                            </CardHeader>
                            
                            <CardContent className="p-8 space-y-8 flex-grow">
                              <p className="text-slate-300 text-sm leading-relaxed italic">"{combo.description}"</p>
                              
                              <div className="space-y-4">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                  <Swords className="w-4 h-4 text-blue-500" /> 조합 구성 유닛
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {combo.units.map(uid => (
                                    <div key={uid} className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-sm font-bold text-white shadow-inner">
                                      {unitMap[uid]?.name}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                                    <Activity className="w-4 h-4" />
                                    <span className="text-[9px] font-black uppercase tracking-wider">만렙 총합 DPS</span>
                                  </div>
                                  <p className="text-xl font-black text-white">{comboTotalDPS}</p>
                                </div>
                                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                                    <Layers className="w-4 h-4" />
                                    <span className="text-[9px] font-black uppercase tracking-wider">총 1성 환산</span>
                                  </div>
                                  <p className="text-xl font-black text-blue-400">{totalUnits.toLocaleString()}</p>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                  <Package className="w-4 h-4 text-emerald-500" /> 모든 1성 기초 재료 필요량
                                </p>
                                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/60 shadow-inner grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
                                  {Object.entries(totalBreakdown)
                                    .sort((a, b) => b[1] - a[1])
                                    .map(([bid, bcount]) => (
                                      <div key={bid} className="flex justify-between items-center text-[10px]">
                                        <span className="text-slate-400 font-medium truncate mr-2">{unitMap[parseInt(bid)]?.name}</span>
                                        <span className="text-white font-black italic shrink-0">x{bcount.toLocaleString()}</span>
                                      </div>
                                    ))}
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2 pt-2">
                                {combo.tags.map(tag => (
                                  <span key={tag} className="text-[9px] font-black text-slate-500 border border-slate-800 px-3 py-1 rounded-full bg-slate-900/50">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent> */}
        </Tabs>
      </main>
    </div>
  );
}

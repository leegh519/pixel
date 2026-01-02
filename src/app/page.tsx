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
  Hammer
} from "lucide-react";

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

const formatNumber = (num: number) => {
  if (num >= 10000) {
    return num.toExponential(2).replace('+', '');
  }
  return num.toLocaleString();
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

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="recipe" className="space-y-12">
          {/* 탭 메뉴 숨김 처리 */}
          <div className="hidden">
            <TabsList>
              <TabsTrigger value="calculator">계산기</TabsTrigger>
              <TabsTrigger value="recipe">도감</TabsTrigger>
            </TabsList>
          </div>

          {/* 계산기 탭 */}
          <TabsContent value="calculator" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* 입력 및 총합 영역 (왼쪽 1컬럼) */}
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

              {/* 조합 상세 (오른쪽 2컬럼) */}
              <div className="lg:col-span-2 space-y-8">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  {/* 직계 조합 재료 */}
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

                                {/* 해당 재료의 하위 조합법 */}
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

                  {/* 기초 재료 상세 */}
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
          </TabsContent>

          {/* 도감 탭 */}
          <TabsContent value="recipe" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* 검색 및 필터 */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="w-full md:max-w-md space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">유닛 검색</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <Input 
                      placeholder="유닛 이름을 입력하세요..." 
                      className="pl-12 h-14 text-lg bg-slate-900 border-slate-800 text-white rounded-2xl focus:ring-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">검색된 유닛 수</p>
                  <p className="text-3xl font-black text-white">{filteredUnits.length}</p>
                </div>
              </div>

              {/* 티어 필터 버튼 */}
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setSelectedTier("all")}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                    selectedTier === 'all' 
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  전체
                </button>
                {[1, 2, 3, 4, 5].map(t => (
                  <button 
                    key={t}
                    onClick={() => setSelectedTier(t.toString())}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                      selectedTier === t.toString() 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    Tier {t}
                  </button>
                ))}
              </div>
            </div>

            {/* 티어별 유닛 목록 */}
            <div className="space-y-16">
              {[5, 4, 3, 2, 1].map(tier => {
                const tierUnits = filteredUnits.filter(u => getTier(u.id) === tier);
                if (tierUnits.length === 0) return null;

                return (
                  <section key={tier} className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-px flex-grow bg-slate-800" />
                      <div className="flex items-center gap-2">
                        <Badge className={`${getTierColor(tier)} px-4 py-1.5 text-xs font-black rounded-lg border-2 uppercase tracking-tighter`}>
                          Tier {tier}
                        </Badge>
                        <h2 className="text-xl font-black text-white tracking-tight uppercase">
                          {tier === 1 ? '기초 유닛' : '상위 유닛'}
                        </h2>
                      </div>
                      <div className="h-px flex-grow bg-slate-800" />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {tierUnits.map(unit => {
                        const totalBaseCount = Object.values(getFullBreakdown(unit.id, 1)).reduce((a, b) => a + b, 0);
                        
                        return (
                          <Card key={unit.id} className="bg-[#0B1120] border-slate-800 hover:border-blue-500/50 transition-all hover:-translate-y-1 hover:shadow-2xl shadow-blue-500/10 group overflow-hidden flex flex-col rounded-xl">
                            <CardHeader className="p-5 pb-4 border-b border-slate-800/50 bg-slate-900/40">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-lg text-white font-black group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                                  {unit.name}
                                </CardTitle>
                                <div className="text-right">
                                  <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">환산</p>
                                  <p className="text-sm font-black text-white">{totalBaseCount.toLocaleString()}</p>
                                </div>
                              </div>
                            </CardHeader>
                            
                            <CardContent className="p-5 space-y-6 flex-grow">
                              {/* 스탯 표시 */}
                              <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                                    <Sword className="w-3.5 h-3.5" />
                                    <span className="text-[9px] font-black uppercase tracking-wider">데미지</span>
                                  </div>
                                  <p className="text-sm font-black text-slate-100">{formatNumber(unit.baseDamage)}</p>
                                </div>
                                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                                    <Zap className="w-3.5 h-3.5" />
                                    <span className="text-[9px] font-black uppercase tracking-wider">공격 주기</span>
                                  </div>
                                  <p className="text-sm font-black text-slate-100">{unit.period}</p>
                                </div>
                                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50 col-span-2">
                                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    <span className="text-[9px] font-black uppercase tracking-wider">성장률</span>
                                  </div>
                                  <p className="text-sm font-black text-blue-400">{unit.growth.toFixed(3)}</p>
                                </div>
                              </div>

                              {/* 제작 재료 - 직계 재료와 기초 재료 분리 */}
                              {Object.keys(unit.recipe).length > 0 && (
                                <div className="space-y-5">
                                  {/* 직계 조합 재료 */}
                                  <div className="space-y-3">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                      <Package className="w-3.5 h-3.5 text-blue-500" /> 직계 조합 재료
                                    </p>
                                    <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800/60">
                                      <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                                        {Object.entries(unit.recipe).map(([ingId, count]) => {
                                          const ingredient = unitMap[parseInt(ingId)];
                                          const tier = getTier(parseInt(ingId));
                                          return (
                                            <div key={ingId} className="flex justify-between items-center text-[11px]">
                                              <div className="flex items-center gap-1.5">
                                                <span className="text-slate-300 font-medium">{ingredient?.name}</span>
                                                <span className="text-[8px] font-black text-slate-500 bg-slate-800/50 px-1.5 py-0.5 rounded">T{tier}</span>
                                              </div>
                                              <span className="text-blue-500 font-black">x{count}</span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>

                                  {/* 1성 기초 재료 분해 */}
                                  <div className="space-y-3">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> 1성 기초 재료
                                    </p>
                                    <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800/60">
                                      <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                                        {Object.entries(getFullBreakdown(unit.id, 1))
                                          .sort((a, b) => b[1] - a[1])
                                          .map(([baseId, baseCount]) => (
                                            <div key={baseId} className="flex justify-between items-center text-[11px]">
                                              <span className="text-slate-300 font-medium">{unitMap[parseInt(baseId)]?.name}</span>
                                              <span className="text-white font-black">x{baseCount}</span>
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* 특수 능력 */}
                              {unit.traits.length > 0 && (
                                <div className="space-y-2.5">
                                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                    <Sparkles className="w-3.5 h-3.5" /> 특수 능력
                                  </p>
                                  <div className="space-y-1.5">
                                    {unit.traits.map((trait, idx) => (
                                      <div key={idx} className="text-[10px] text-slate-200 bg-blue-500/5 border border-blue-500/10 px-3 py-2 rounded-lg flex justify-between items-center italic">
                                        <span>{trait.name}</span>
                                        <span className="text-blue-400 font-black">x{trait.growth}</span>
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
                  </section>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

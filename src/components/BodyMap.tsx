import React, { useState, useEffect } from 'react';
import { WorkoutService } from '../services/workoutService';

interface MuscleGroup {
  id: string;
  name: string;
  recentVolume: number;
  lastWorked?: Date;
  exercises: number;
}

const BodyMap: React.FC = () => {
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [muscleData, setMuscleData] = useState<Record<string, MuscleGroup>>({});
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);

  useEffect(() => {
    loadMuscleData();
  }, []);

  const loadMuscleData = async () => {
    try {
      const volumeData = await WorkoutService.getVolumeByMuscleGroup();
      
      // Create muscle group data
      const muscles: Record<string, MuscleGroup> = {
        chest: { id: 'chest', name: 'Chest', recentVolume: volumeData.chest || 0, exercises: 0 },
        shoulders: { id: 'shoulders', name: 'Shoulders', recentVolume: volumeData.shoulders || 0, exercises: 0 },
        biceps: { id: 'biceps', name: 'Biceps', recentVolume: volumeData.biceps || 0, exercises: 0 },
        triceps: { id: 'triceps', name: 'Triceps', recentVolume: volumeData.triceps || 0, exercises: 0 },
        back: { id: 'back', name: 'Back', recentVolume: volumeData.back || 0, exercises: 0 },
        core: { id: 'core', name: 'Core', recentVolume: volumeData.core || 0, exercises: 0 },
        glutes: { id: 'glutes', name: 'Glutes', recentVolume: volumeData.glutes || 0, exercises: 0 },
        quadriceps: { id: 'quadriceps', name: 'Quadriceps', recentVolume: volumeData.quadriceps || 0, exercises: 0 },
        hamstrings: { id: 'hamstrings', name: 'Hamstrings', recentVolume: volumeData.hamstrings || 0, exercises: 0 },
        calves: { id: 'calves', name: 'Calves', recentVolume: volumeData.calves || 0, exercises: 0 },
      };

      setMuscleData(muscles);
    } catch (error) {
      console.error('Failed to load muscle data:', error);
    }
  };

  const getMuscleIntensity = (volume: number): string => {
    if (volume === 0) return 'opacity-30';
    if (volume < 1000) return 'opacity-60';
    if (volume < 5000) return 'opacity-80';
    return 'opacity-100';
  };

  const getMuscleColor = (muscleId: string): string => {
    const muscle = muscleData[muscleId];
    if (!muscle) return 'fill-dark-400';
    
    if (muscle.recentVolume === 0) return 'fill-dark-400';
    if (muscle.recentVolume < 1000) return 'fill-primary-400';
    if (muscle.recentVolume < 5000) return 'fill-primary-500';
    return 'fill-primary-600';
  };

  const handleMuscleClick = (muscleId: string) => {
    setSelectedMuscle(muscleId);
    // Navigate to exercises filtered by muscle group
    window.location.href = `/exercises?muscle=${muscleId}`;
  };

  const activeMuscle = hoveredMuscle || selectedMuscle;
  const activeData = activeMuscle ? muscleData[activeMuscle] : null;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-semibold text-xl text-dark-900">
          Body Map
        </h3>
        <div className="text-sm text-dark-600">
          Click muscle groups to see exercises
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Human Figure */}
        <div className="lg:col-span-2 flex items-center justify-center bg-dark-100 rounded-lg p-8 min-h-[500px]">
          <div className="relative">
            <svg 
              width="320" 
              height="480" 
              viewBox="0 0 320 480" 
              className="drop-shadow-lg"
            >
              {/* Head - more anatomical */}
              <path d="M138,20 Q160,15 182,20 Q190,30 188,45 Q185,60 160,65 Q135,60 132,45 Q130,30 138,20 Z" fill="#3f3f46" stroke="#71717a" strokeWidth="2"/>
              <circle cx="150" cy="35" r="2" fill="#71717a"/>
              <circle cx="170" cy="35" r="2" fill="#71717a"/>
              <path d="M155,45 Q160,48 165,45" fill="none" stroke="#71717a" strokeWidth="1"/>
              
              {/* Neck - more defined */}
              <path d="M148,65 Q160,68 172,65 L170,90 Q160,95 150,90 Z" fill="#3f3f46" stroke="#71717a" strokeWidth="1"/>
              <line x1="155" y1="75" x2="165" y2="75" stroke="#52525b" strokeWidth="1" strokeDasharray="1,1"/>
              
              {/* Torso outline - more anatomical */}
              <path d="M120,95 Q140,85 160,85 Q180,85 200,95 Q205,130 200,165 Q195,200 160,205 Q125,200 120,165 Q115,130 120,95 Z" fill="none" stroke="#52525b" strokeWidth="2" strokeDasharray="3,3"/>
              <path d="M145,95 Q160,90 175,95" fill="none" stroke="#52525b" strokeWidth="1" strokeDasharray="2,2"/>

              {/* Shoulders - deltoids with muscle fiber definition */}
              <path 
                d="M120,95 Q105,100 95,110 Q88,125 95,140 Q110,145 125,140 Q135,125 132,110 Q128,100 120,95 Z"
                className={`${getMuscleColor('shoulders')} ${getMuscleIntensity(muscleData.shoulders?.recentVolume || 0)} hover:opacity-100 cursor-pointer transition-all duration-200`}
                stroke={hoveredMuscle === 'shoulders' ? '#7c56ff' : '#71717a'} 
                strokeWidth={hoveredMuscle === 'shoulders' ? '3' : '2'}
                onMouseEnter={() => setHoveredMuscle('shoulders')}
                onMouseLeave={() => setHoveredMuscle(null)}
                onClick={() => handleMuscleClick('shoulders')}
              />
              <path 
                d="M200,95 Q215,100 225,110 Q232,125 225,140 Q210,145 195,140 Q185,125 188,110 Q192,100 200,95 Z"
                className={`${getMuscleColor('shoulders')} ${getMuscleIntensity(muscleData.shoulders?.recentVolume || 0)} hover:opacity-100 cursor-pointer transition-all duration-200`}
                stroke={hoveredMuscle === 'shoulders' ? '#7c56ff' : '#71717a'} 
                strokeWidth={hoveredMuscle === 'shoulders' ? '3' : '2'}
                onMouseEnter={() => setHoveredMuscle('shoulders')}
                onMouseLeave={() => setHoveredMuscle(null)}
                onClick={() => handleMuscleClick('shoulders')}
              />
              <path d="M110,115 Q120,120 130,115" fill="none" stroke="#52525b" strokeWidth="1" strokeDasharray="1,1"/>
              <path d="M190,115 Q200,120 210,115" fill="none" stroke="#52525b" strokeWidth="1" strokeDasharray="1,1"/>

              {/* Chest - pectorals with more definition */}
              <path 
                d="M135,105 Q147,95 160,100 Q173,95 185,105 Q190,115 188,130 Q185,145 160,150 Q135,145 132,130 Q130,115 135,105 Z"
                className={`${getMuscleColor('chest')} ${getMuscleIntensity(muscleData.chest?.recentVolume || 0)} hover:opacity-100 cursor-pointer transition-all duration-200`}
                stroke={hoveredMuscle === 'chest' ? '#7c56ff' : '#71717a'} 
                strokeWidth={hoveredMuscle === 'chest' ? '3' : '2'}
                onMouseEnter={() => setHoveredMuscle('chest')}
                onMouseLeave={() => setHoveredMuscle(null)}
                onClick={() => handleMuscleClick('chest')}
              />
              <line x1="160" y1="110" x2="160" y2="145" stroke="#52525b" strokeWidth="1" strokeDasharray="1,2"/>

              {/* Arms - anatomical shape */}
              {/* Left Bicep - more muscular definition */}
              <path 
                d="M100,140 Q85,145 75,160 Q70,175 78,190 Q88,195 100,190 Q110,180 108,165 Q106,150 100,140 Z"
                className={`${getMuscleColor('biceps')} ${getMuscleIntensity(muscleData.biceps?.recentVolume || 0)} hover:opacity-100 cursor-pointer transition-all duration-200`}
                stroke={hoveredMuscle === 'biceps' ? '#7c56ff' : '#71717a'} 
                strokeWidth={hoveredMuscle === 'biceps' ? '3' : '2'}
                onMouseEnter={() => setHoveredMuscle('biceps')}
                onMouseLeave={() => setHoveredMuscle(null)}
                onClick={() => handleMuscleClick('biceps')}
              />
              {/* Right Bicep - more muscular definition */}
              <path 
                d="M220,140 Q235,145 245,160 Q250,175 242,190 Q232,195 220,190 Q210,180 212,165 Q214,150 220,140 Z"
                className={`${getMuscleColor('biceps')} ${getMuscleIntensity(muscleData.biceps?.recentVolume || 0)} hover:opacity-100 cursor-pointer transition-all duration-200`}
                stroke={hoveredMuscle === 'biceps' ? '#7c56ff' : '#71717a'} 
                strokeWidth={hoveredMuscle === 'biceps' ? '3' : '2'}
                onMouseEnter={() => setHoveredMuscle('biceps')}
                onMouseLeave={() => setHoveredMuscle(null)}
                onClick={() => handleMuscleClick('biceps')}
              />
              <path d="M90,165 Q100,170 105,165" fill="none" stroke="#52525b" strokeWidth="1" strokeDasharray="1,1"/>
              <path d="M215,165 Q220,170 230,165" fill="none" stroke="#52525b" strokeWidth="1" strokeDasharray="1,1"/>

              {/* Triceps - back of arms */}
              <path 
                d="M105,145 Q90,150 85,165 Q90,180 105,185 Q120,180 115,165 Q110,150 105,145 Z"
                className={`${getMuscleColor('triceps')} ${getMuscleIntensity(muscleData.triceps?.recentVolume || 0)} hover:opacity-100 cursor-pointer transition-all duration-200`}
                stroke={hoveredMuscle === 'triceps' ? '#7c56ff' : '#71717a'} 
                strokeWidth={hoveredMuscle === 'triceps' ? '3' : '1'}
                fill="none"
                strokeDasharray="4,4"
                onMouseEnter={() => setHoveredMuscle('triceps')}
                onMouseLeave={() => setHoveredMuscle(null)}
                onClick={() => handleMuscleClick('triceps')}
              />
              <path 
                d="M215,145 Q230,150 235,165 Q230,180 215,185 Q200,180 205,165 Q210,150 215,145 Z"
                className={`${getMuscleColor('triceps')} ${getMuscleIntensity(muscleData.triceps?.recentVolume || 0)} hover:opacity-100 cursor-pointer transition-all duration-200`}
                stroke={hoveredMuscle === 'triceps' ? '#7c56ff' : '#71717a'} 
                strokeWidth={hoveredMuscle === 'triceps' ? '3' : '1'}
                fill="none"
                strokeDasharray="4,4"
                onMouseEnter={() => setHoveredMuscle('triceps')}
                onMouseLeave={() => setHoveredMuscle(null)}
                onClick={() => handleMuscleClick('triceps')}
              />

              {/* Core - abs with anatomical definition */}
              <path 
                d="M140,155 Q160,150 180,155 Q185,175 182,195 Q180,210 160,215 Q140,210 138,195 Q135,175 140,155 Z"
                className={`${getMuscleColor('core')} ${getMuscleIntensity(muscleData.core?.recentVolume || 0)} hover:opacity-100 cursor-pointer transition-all duration-200`}
                stroke={hoveredMuscle === 'core' ? '#7c56ff' : '#71717a'} 
                strokeWidth={hoveredMuscle === 'core' ? '3' : '2'}
                onMouseEnter={() => setHoveredMuscle('core')}
                onMouseLeave={() => setHoveredMuscle(null)}
                onClick={() => handleMuscleClick('core')}
              />
              {/* Six-pack definition lines */}
              <line x1="160" y1="160" x2="160" y2="210" stroke="#52525b" strokeWidth="1" strokeDasharray="2,2"/>
              <line x1="148" y1="170" x2="172" y2="170" stroke="#52525b" strokeWidth="1" strokeDasharray="2,2"/>
              <line x1="148" y1="185" x2="172" y2="185" stroke="#52525b" strokeWidth="1" strokeDasharray="2,2"/>
              <line x1="148" y1="200" x2="172" y2="200" stroke="#52525b" strokeWidth="1" strokeDasharray="2,2"/>
              {/* V-line definition */}
              <path d="M145,195 Q155,205 160,210" fill="none" stroke="#52525b" strokeWidth="1" strokeDasharray="1,1"/>
              <path d="M175,195 Q165,205 160,210" fill="none" stroke="#52525b" strokeWidth="1" strokeDasharray="1,1"/>

              {/* Back (shown as outline) */}
              <path 
                d="M135,105 Q160,100 185,105 Q190,125 185,145 Q160,150 135,145 Q130,125 135,105 Z"
                className={`${getMuscleColor('back')} ${getMuscleIntensity(muscleData.back?.recentVolume || 0)} hover:opacity-100 cursor-pointer transition-all duration-200`}
                stroke={hoveredMuscle === 'back' ? '#7c56ff' : '#71717a'} 
                strokeWidth={hoveredMuscle === 'back' ? '3' : '1'}
                fill="none"
                strokeDasharray="5,5"
                onMouseEnter={() => setHoveredMuscle('back')}
                onMouseLeave={() => setHoveredMuscle(null)}
                onClick={() => handleMuscleClick('back')}
              />

              {/* Pelvis/Hip area - more anatomical */}
              <path d="M135,215 Q160,210 185,215 Q190,225 185,240 Q160,245 135,240 Q130,225 135,215 Z" fill="none" stroke="#52525b" strokeWidth="1" strokeDasharray="2,2"/>
              <path d="M145,225 Q160,220 175,225" fill="none" stroke="#52525b" strokeWidth="1" strokeDasharray="1,2"/>

              {/* Glutes - more anatomical roundness */}
              <path 
                d="M135,220 Q140,215 150,218 Q155,230 150,245 Q140,250 130,245 Q128,235 135,220 Z"
                className={`${getMuscleColor('glutes')} ${getMuscleIntensity(muscleData.glutes?.recentVolume || 0)} hover:opacity-100 cursor-pointer transition-all duration-200`}
                stroke={hoveredMuscle === 'glutes' ? '#7c56ff' : '#71717a'} 
                strokeWidth={hoveredMuscle === 'glutes' ? '3' : '2'}
                onMouseEnter={() => setHoveredMuscle('glutes')}
                onMouseLeave={() => setHoveredMuscle(null)}
                onClick={() => handleMuscleClick('glutes')}
              />
              <path 
                d="M170,218 Q180,215 185,220 Q192,235 190,245 Q180,250 170,245 Q165,230 170,218 Z"
                className={`${getMuscleColor('glutes')} ${getMuscleIntensity(muscleData.glutes?.recentVolume || 0)} hover:opacity-100 cursor-pointer transition-all duration-200`}
                stroke={hoveredMuscle === 'glutes' ? '#7c56ff' : '#71717a'} 
                strokeWidth={hoveredMuscle === 'glutes' ? '3' : '2'}
                onMouseEnter={() => setHoveredMuscle('glutes')}
                onMouseLeave={() => setHoveredMuscle(null)}
                onClick={() => handleMuscleClick('glutes')}
              />

              {/* Thighs - Quadriceps with muscle definition */}
              <path 
                d="M140,250 Q128,255 122,275 Q118,310 125,345 Q135,355 148,350 Q158,315 155,275 Q150,255 140,250 Z"
                className={`${getMuscleColor('quadriceps')} ${getMuscleIntensity(muscleData.quadriceps?.recentVolume || 0)} hover:opacity-100 cursor-pointer transition-all duration-200`}
                stroke={hoveredMuscle === 'quadriceps' ? '#7c56ff' : '#71717a'} 
                strokeWidth={hoveredMuscle === 'quadriceps' ? '3' : '2'}
                onMouseEnter={() => setHoveredMuscle('quadriceps')}
                onMouseLeave={() => setHoveredMuscle(null)}
                onClick={() => handleMuscleClick('quadriceps')}
              />
              <path 
                d="M180,250 Q192,255 198,275 Q202,310 195,345 Q185,355 172,350 Q162,315 165,275 Q170,255 180,250 Z"
                className={`${getMuscleColor('quadriceps')} ${getMuscleIntensity(muscleData.quadriceps?.recentVolume || 0)} hover:opacity-100 cursor-pointer transition-all duration-200`}
                stroke={hoveredMuscle === 'quadriceps' ? '#7c56ff' : '#71717a'} 
                strokeWidth={hoveredMuscle === 'quadriceps' ? '3' : '2'}
                onMouseEnter={() => setHoveredMuscle('quadriceps')}
                onMouseLeave={() => setHoveredMuscle(null)}
                onClick={() => handleMuscleClick('quadriceps')}
              />
              <path d="M135,290 Q142,295 148,290" fill="none" stroke="#52525b" strokeWidth="1" strokeDasharray="1,1"/>
              <path d="M172,290 Q178,295 185,290" fill="none" stroke="#52525b" strokeWidth="1" strokeDasharray="1,1"/>

              {/* Hamstrings (back of thighs - dashed) */}
              <path 
                d="M135,245 Q125,250 120,270 Q115,310 125,340 Q135,345 145,340 Q150,310 145,270 Q140,250 135,245 Z"
                className={`${getMuscleColor('hamstrings')} ${getMuscleIntensity(muscleData.hamstrings?.recentVolume || 0)} hover:opacity-100 cursor-pointer transition-all duration-200`}
                stroke={hoveredMuscle === 'hamstrings' ? '#7c56ff' : '#71717a'} 
                strokeWidth={hoveredMuscle === 'hamstrings' ? '3' : '1'}
                fill="none"
                strokeDasharray="5,5"
                onMouseEnter={() => setHoveredMuscle('hamstrings')}
                onMouseLeave={() => setHoveredMuscle(null)}
                onClick={() => handleMuscleClick('hamstrings')}
              />
              <path 
                d="M185,245 Q195,250 200,270 Q205,310 195,340 Q185,345 175,340 Q170,310 175,270 Q180,250 185,245 Z"
                className={`${getMuscleColor('hamstrings')} ${getMuscleIntensity(muscleData.hamstrings?.recentVolume || 0)} hover:opacity-100 cursor-pointer transition-all duration-200`}
                stroke={hoveredMuscle === 'hamstrings' ? '#7c56ff' : '#71717a'} 
                strokeWidth={hoveredMuscle === 'hamstrings' ? '3' : '1'}
                fill="none"
                strokeDasharray="5,5"
                onMouseEnter={() => setHoveredMuscle('hamstrings')}
                onMouseLeave={() => setHoveredMuscle(null)}
                onClick={() => handleMuscleClick('hamstrings')}
              />

              {/* Calves - more anatomical calf muscle shape */}
              <path 
                d="M140,355 Q128,360 122,375 Q120,395 128,410 Q140,420 150,415 Q158,400 155,385 Q152,370 140,355 Z"
                className={`${getMuscleColor('calves')} ${getMuscleIntensity(muscleData.calves?.recentVolume || 0)} hover:opacity-100 cursor-pointer transition-all duration-200`}
                stroke={hoveredMuscle === 'calves' ? '#7c56ff' : '#71717a'} 
                strokeWidth={hoveredMuscle === 'calves' ? '3' : '2'}
                onMouseEnter={() => setHoveredMuscle('calves')}
                onMouseLeave={() => setHoveredMuscle(null)}
                onClick={() => handleMuscleClick('calves')}
              />
              <path 
                d="M180,355 Q192,360 198,375 Q200,395 192,410 Q180,420 170,415 Q162,400 165,385 Q168,370 180,355 Z"
                className={`${getMuscleColor('calves')} ${getMuscleIntensity(muscleData.calves?.recentVolume || 0)} hover:opacity-100 cursor-pointer transition-all duration-200`}
                stroke={hoveredMuscle === 'calves' ? '#7c56ff' : '#71717a'} 
                strokeWidth={hoveredMuscle === 'calves' ? '3' : '2'}
                onMouseEnter={() => setHoveredMuscle('calves')}
                onMouseLeave={() => setHoveredMuscle(null)}
                onClick={() => handleMuscleClick('calves')}
              />
              <path d="M135,385 Q142,390 148,385" fill="none" stroke="#52525b" strokeWidth="1" strokeDasharray="1,1"/>
              <path d="M172,385 Q178,390 185,385" fill="none" stroke="#52525b" strokeWidth="1" strokeDasharray="1,1"/>

              {/* Feet - more anatomical */}
              <path d="M125,425 Q135,420 145,425 Q150,435 145,445 Q135,450 125,445 Q120,435 125,425 Z" fill="#3f3f46" stroke="#71717a" strokeWidth="1"/>
              <path d="M175,425 Q185,420 195,425 Q200,435 195,445 Q185,450 175,445 Q170,435 175,425 Z" fill="#3f3f46" stroke="#71717a" strokeWidth="1"/>
              <circle cx="130" cy="430" r="1" fill="#71717a"/>
              <circle cx="135" cy="432" r="1" fill="#71717a"/>
              <circle cx="140" cy="430" r="1" fill="#71717a"/>
              <circle cx="180" cy="430" r="1" fill="#71717a"/>
              <circle cx="185" cy="432" r="1" fill="#71717a"/>
              <circle cx="190" cy="430" r="1" fill="#71717a"/>
              
              {/* Forearms - more anatomical */}
              <path d="M85,195 Q72,200 68,220 Q70,240 80,245 Q90,240 95,220 Q92,200 85,195 Z" fill="#3f3f46" stroke="#71717a" strokeWidth="1"/>
              <path d="M235,195 Q248,200 252,220 Q250,240 240,245 Q230,240 225,220 Q228,200 235,195 Z" fill="#3f3f46" stroke="#71717a" strokeWidth="1"/>
              <line x1="82" y1="215" x2="88" y2="215" stroke="#52525b" strokeWidth="1" strokeDasharray="1,1"/>
              <line x1="232" y1="215" x2="238" y2="215" stroke="#52525b" strokeWidth="1" strokeDasharray="1,1"/>
              
              {/* Hands - more anatomical */}
              <path d="M75,250 Q80,245 85,250 Q88,255 85,265 Q80,270 75,265 Q72,255 75,250 Z" fill="#3f3f46" stroke="#71717a" strokeWidth="1"/>
              <path d="M235,250 Q240,245 245,250 Q248,255 245,265 Q240,270 235,265 Q232,255 235,250 Z" fill="#3f3f46" stroke="#71717a" strokeWidth="1"/>
              <circle cx="77" cy="257" r="1" fill="#71717a"/>
              <circle cx="80" cy="259" r="1" fill="#71717a"/>
              <circle cx="83" cy="257" r="1" fill="#71717a"/>
              <circle cx="237" cy="257" r="1" fill="#71717a"/>
              <circle cx="240" cy="259" r="1" fill="#71717a"/>
              <circle cx="243" cy="257" r="1" fill="#71717a"/>
            </svg>

            {/* Muscle Label */}
            {activeData && (
              <div className="absolute -right-4 top-8 bg-dark-100 border border-primary-400 rounded-lg p-3 shadow-xl min-w-[200px]">
                <div className="text-sm font-semibold text-primary-400 mb-1">
                  {activeData.name}
                </div>
                <div className="text-xs text-dark-700 space-y-1">
                  <div>Volume (30d): {activeData.recentVolume.toLocaleString()} kg</div>
                  <div className={`${activeData.recentVolume > 0 ? 'text-strength-400' : 'text-dark-500'}`}>
                    {activeData.recentVolume > 0 ? 'Recently trained' : 'Not trained recently'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Muscle Info Panel */}
        <div className="space-y-4">
          <div className="text-sm font-medium text-dark-700 mb-3">
            Training Status (Last 30 Days)
          </div>

          {Object.values(muscleData)
            .sort((a, b) => b.recentVolume - a.recentVolume)
            .map((muscle) => (
              <div 
                key={muscle.id}
                className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                  hoveredMuscle === muscle.id 
                    ? 'border-primary-400 bg-primary-900/10' 
                    : 'border-dark-300 bg-dark-200/50 hover:border-dark-400'
                }`}
                onMouseEnter={() => setHoveredMuscle(muscle.id)}
                onMouseLeave={() => setHoveredMuscle(null)}
                onClick={() => handleMuscleClick(muscle.id)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-dark-800">{muscle.name}</span>
                  <div className={`w-3 h-3 rounded-full ${
                    muscle.recentVolume === 0 ? 'bg-dark-400' :
                    muscle.recentVolume < 1000 ? 'bg-primary-400' :
                    muscle.recentVolume < 5000 ? 'bg-primary-500' : 'bg-primary-600'
                  }`} />
                </div>
                <div className="text-xs text-dark-600">
                  {muscle.recentVolume > 0 
                    ? `${muscle.recentVolume.toLocaleString()} kg volume`
                    : 'No recent activity'
                  }
                </div>
              </div>
            ))
          }

          <div className="pt-4 border-t border-dark-300">
            <div className="text-xs text-dark-600 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-primary-600"></div>
                <span>High Volume (&gt;5000kg)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-primary-400"></div>
                <span>Moderate Volume</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-dark-400"></div>
                <span>Not Trained</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyMap;
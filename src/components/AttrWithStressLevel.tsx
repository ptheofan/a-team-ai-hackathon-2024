import { StressLevel } from '../structs/gpt.interface.ts';

export interface IAttrWithStressLevelProps {
  attrName: string;
  stressLevels: StressLevel;

}

export const AttrWithStressLevel = ({ attrName, stressLevels }: IAttrWithStressLevelProps) => {
  console.log(stressLevels)
  return (
    <div>
      <h3>{attrName}</h3>
      <div>
        <h4>High Levels</h4>
        {stressLevels && stressLevels.highLevel && Array.isArray(stressLevels.highLevel) && stressLevels.highLevel.length > 0 &&
          stressLevels.highLevel.map((emotionScore, index) => (
            <div key={index}>
              {emotionScore.name}: {emotionScore.score}
            </div>
          ))
        }
      </div>
      <div>
        <h4>Low Levels</h4>
        {stressLevels && stressLevels.lowLevel && Array.isArray(stressLevels.lowLevel) && stressLevels.lowLevel.length > 0 &&
          stressLevels.lowLevel.map((emotionScore, index) => (
            <div key={index}>
              {emotionScore.name}: {emotionScore.score}
            </div>
          ))
        }
      </div>
    </div>
  );
};

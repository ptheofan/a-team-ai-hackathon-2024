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
        {Object.entries(stressLevels.highLevel).map(([emotion, score], index) => (
          <div key={index}>
            {emotion}: {score}
          </div>
        ))}
      </div>
      <div>
        <h4>Low Levels</h4>
        {Object.entries(stressLevels.lowLevel).map(([emotion, score], index) => (
          <div key={index}>
            {emotion}: {score}
          </div>
        ))}
      </div>
    </div>
  );
};

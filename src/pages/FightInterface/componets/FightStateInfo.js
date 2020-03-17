import React from 'react';
import { Popover, Progress, Tag } from 'antd';

const FightStateInfo = ({state,type,renderState}) => {


  const getStatus = () => {
     const percent = state.life/state.lifeMax;
     if(percent > 0.7) {
       return 'success'
     }  else if(percent > 0.3) {
       return 'normal'
     }
     return 'exception'
  };

  return(
    <div className={'flexColumn'}>
      <div className={'flexRow'}>
        <span style={{paddingRight:20}}>{state.name}</span>
        攻击：<span style={{paddingRight:10,color:'red'}}>{renderState.atk}</span>
        防御：<span style={{paddingRight:10,color:'green'}}>{renderState.def}</span>
        速度：<span style={{paddingRight:10,color:'blue'}}>{renderState.speed}</span>
        暴击：<span style={{paddingRight:10,color:'blue'}}>{renderState.cri}%</span>
        闪避：<span style={{paddingRight:10,color:'blue'}}>{renderState.miss}%</span>
        暴伤：<span style={{paddingRight:10,color:'blue'}}>{renderState.criDamage*100}%</span>
      </div>
      <div className={'flexRow'}>
        <div style={{width:50}}>血量：</div>
        <Progress percent={state.life/renderState.lifeMax*100} showInfo={false} status={getStatus()}/>
        <div style={{width:60}}>{state.life}/{renderState.lifeMax}</div>
      </div>
      <div className={'flexRow'}>
        <div style={{width:60}}>NP：</div>
        <Progress percent={state.pow} strokeColor={'orange'} />
      </div>
      <div className={'flexRow'}>
        <div style={{width:60}}>行动条：</div>
        <Progress percent={state.process} status={'active'} style={{width:1000}} />
      </div>
      <div className={'flexRow'}>
        <div style={{width:60}}>状态：</div>
        {state.state.map(state => (
          <Popover key={state.id} content={state.desc} placement={'bottom'}>
            <Tag color={state.color}>
              {state.name}({state.restTurn})
            </Tag>
          </Popover>
        ))}
      </div>
    </div>
  )
};

export default FightStateInfo;

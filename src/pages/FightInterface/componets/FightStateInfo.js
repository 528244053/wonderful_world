import React from 'react';
import { Popover, Progress, Tag } from 'antd';

const FightStateInfo = ({person,type,renderPerson}) => {


  const getStatus = () => {
     const percent = renderPerson.life/renderPerson.lifeMax;
     if(percent > 0.7) {
       return 'success'
     }  else if(percent > 0.3) {
       return 'normal'
     }
     return 'exception'
  };

  return(
    <div className={'flexColumn'}>
      <div className={'contentBox'}>
        <span style={{paddingRight:20}}>{renderPerson.name}</span>
        <span style={{ display:'inline-block' }}>攻击：<span style={{paddingRight:10,color:'red'}}>{renderPerson.atk}</span></span>
        <span style={{ display:'inline-block' }}>防御：<span style={{paddingRight:10,color:'green'}}>{renderPerson.def}</span></span>
        {type === "role" && <span style={{ display:'inline-block' }}>嘲讽：<span style={{paddingRight:10,color:'pink'}}>{renderPerson.taunt}</span></span>}
        <span style={{ display:'inline-block' }}>速度：<span style={{paddingRight:10,color:'blue'}}>{renderPerson.speed}</span></span>
        <span style={{ display:'inline-block' }}>暴击：<span style={{paddingRight:10,color:'blue'}}>{renderPerson.cri}%</span></span>
        <span style={{ display:'inline-block' }}>闪避：<span style={{paddingRight:10,color:'blue'}}>{renderPerson.miss}%</span></span>
        <span style={{ display:'inline-block' }}>暴伤：<span style={{paddingRight:10,color:'blue'}}>{renderPerson.criDamage*100}%</span></span>
      </div>
      <div className={'flexRow'}>
        <div style={{width:60}}>血量：</div>
        <Progress style={{width:'75%'}}  percent={renderPerson.life/renderPerson.lifeMax*100} showInfo={false} status={getStatus()}/>
        <div style={{width:60}}>{renderPerson.life}/{renderPerson.lifeMax}</div>
      </div>
      <div className={'flexRow'}>
        <div style={{width:60}}>内力：</div>
        <Progress style={{ width:'80%' }} percent={renderPerson.pow} strokeColor={'orange'} />
      </div>
      <div className={'flexRow'}>
        <div style={{width:60}}>行动条：</div>
        <Progress percent={renderPerson.process} status={'active'} style={{width:'80%'}} />
      </div>
      <div className={'flexRow'}>
        <div style={{width:60}}>状态：</div>
        {renderPerson.state.map(state => (
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

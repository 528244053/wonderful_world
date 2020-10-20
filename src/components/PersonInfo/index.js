import React from 'react';

class PersonInfo extends React.PureComponent{
  
  render() {
    const { person } = this.props;
    return (
      <div className={'flexColumn'}>
        <div className={'contentBox'}>
          <span style={{paddingRight:20}}>{person.name}</span>
          <span style={{ display:'inline-block' }}>攻击：<span style={{paddingRight:10,color:'red'}}>{person.atk}</span></span>
          <span style={{ display:'inline-block' }}>防御：<span style={{paddingRight:10,color:'green'}}>{person.def}</span></span>
          <span style={{ display:'inline-block' }}>速度：<span style={{paddingRight:10,color:'blue'}}>{person.speed}</span></span>
          <span style={{ display:'inline-block' }}>暴击：<span style={{paddingRight:10,color:'blue'}}>{person.cri}%</span></span>
          <span style={{ display:'inline-block' }}>闪避：<span style={{paddingRight:10,color:'blue'}}>{person.miss}%</span></span>
          <span style={{ display:'inline-block' }}>暴伤：<span style={{paddingRight:10,color:'blue'}}>{person.criDamage*100}%</span></span>
        </div>
        <div className={'flexRow'}>
          <div style={{width:60}}>血量：</div>
          <div style={{width:60}}>{person.life}/{person.lifeMax}</div>
        </div>
        <div className={'flexRow'}>
          <div style={{width:60}}>内力：</div>
        </div>
        <div className={'flexRow'}>
          <div style={{width:60}}>行动条：</div>
        </div>
        <div className={'flexRow'}>
          <div style={{width:60}}>状态：</div>
          <div className={"flexColumn"}>
            {person.state.map(state => (
              <div key={state.id}>
                {`${state.name}:${state.desc}`}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

}

export default PersonInfo;

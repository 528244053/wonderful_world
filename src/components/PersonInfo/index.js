import React from 'react';
import Image from '@/components/Image';
import style from './index.less';

class PersonInfo extends React.PureComponent{

  renderSimpleInfo = () => {
    const { person,personList = [] } = this.props;
    return (
      <>
        <div className={'flexRow'}>
          <div style={{width:60,textAlign:'center'}}>技能:</div>
          {person.skill.map(skill => (
            <div key={skill.id} style={{ margin:'0px 5px' }}>
              {skill.name}
            </div>
          ))}
        </div>
      </>
    )
  };

  renderDetailInfo = () => {
    const { person,personList = [] } = this.props;
    return (
      <>
        <div className={'flexRow'}>
          <div style={{width:60,textAlign:'center'}}>技能:</div>
          <div className={"flexColumn"}>
            {person.skill.map(skill => (
              <div key={skill.id} style={{ margin:'0px 5px' }}>
                {`${skill.name}:${skill.desc}`}
              </div>
            ))}
          </div>
        </div>
      </>
    )
  };

  render() {
    const { person,showDetailInfo = false,personList = [] } = this.props;
    return (
      <div className={'flexColumn'} style={{width:400,fontSize:16}}>
        <div className={'flexRow'} style={{ justifyContent:'spaceBetween',width:'100%',height:300 }}>
          <Image
            url={person.imgUrl}
            title={person.name}
          />
          <div className={style.sectionProperty}>
            <div>{person.name}</div>
            <div>血量：<span style={{paddingRight:10,color:'red'}}>{person.lifeMax}</span></div>
            <div>攻击：<span style={{paddingRight:10,color:'red'}}>{person.atk}</span></div>
            <div>防御：<span style={{paddingRight:10,color:'green'}}>{person.def}</span></div>
            <div>速度：<span style={{paddingRight:10,color:'blue'}}>{person.speed}</span></div>
            <div>暴击：<span style={{paddingRight:10,color:'blue'}}>{person.cri}%</span></div>
            <div>闪避：<span style={{paddingRight:10,color:'blue'}}>{person.miss}%</span></div>
            <div>暴伤：<span style={{paddingRight:10,color:'blue'}}>{person.criDamage*100}%</span></div>
          </div>
        </div>
        {!showDetailInfo?this.renderSimpleInfo():null}
        {showDetailInfo?this.renderDetailInfo():null}
      </div>

    )
  }

}

export default PersonInfo;

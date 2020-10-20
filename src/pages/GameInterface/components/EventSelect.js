import React from 'react';
import style from '../index.css';
import SelectOption from '@/components/SelectOption';
import PersonInfo from '@/components/PersonInfo';
import roleMap from '@/gameConfig/role';
import { connect } from 'react-redux';

@connect()
class EventSelect extends React.PureComponent {

  fight = enemy => {
    const { dispatch } = this.props;
    dispatch({
      type:'gameModel/fightEnemy',
      payload:{
        enemy
      }
    })
  };

  personJoin = role => {
    const { dispatch } = this.props;
    dispatch({
      type:'gameModel/personJoin',
      payload:role
    })
  };

  renderContent = () => {
    const { currentNode,roleList = [] } = this.props;
    const otherRoleList = Object.values(roleMap).filter(role => !roleList.some(insideRole => insideRole.id === role.id));
    switch (currentNode.eventType) {
      case 'fight':return <SelectOption handleSelect={() => this.fight(currentNode.target)}><PersonInfo person={currentNode.target} /></SelectOption>;
      case 'personJoin':return <SelectOption handleSelect={() => this.personJoin(otherRoleList[0])}><PersonInfo person={otherRoleList[0]} /></SelectOption>;
      default: return null;
    }
  };

  render() {
    return (
      <div className={style.eventSelectSection}>
        {this.renderContent()}
      </div>
    )
  }


}

export default EventSelect;

import React from 'react'
import RoleSelect from '@/pages/GameStartBefore/components/RoleSelect';
import { connect } from 'react-redux';
import { routerRedux } from 'dva';

@connect(({ dispatch }) => ({ dispatch }))
class GameStartBefore extends React.Component {

  handleOnSelect = role => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname:'/GameInterface',
      query:{
        roleId:role.id,
      }
    }))
  };

  render() {
    return (
      <div>
        <div style={{ width:'100%',height:40,fontSize:20,padding:2,borderBottom:'solid 2px' }}>选择你的角色</div>
        <RoleSelect onSelect={this.handleOnSelect}/>
      </div>
    )
  }
}

export default GameStartBefore;

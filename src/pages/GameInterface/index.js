import React from 'react';
import { connect } from 'react-redux';
import { routerRedux } from 'dva';
import Map from '@/gameConfig/map';
import style from './index.css';
import EventSelect from '@/pages/GameInterface/components/EventSelect';

@connect(({ dispatch,gameModel }) => ({ dispatch,gameModel }))
class GameInterface extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectModalVisible:false,
    }
  }

  componentDidMount() {
    const { gameModel : { roleList = [] },dispatch } = this.props;
    if(!roleList.length) {
      dispatch(routerRedux.push(
        { pathname:'/GameStartBefore',}
      ))
    }
  }


  render() {
    const { gameModel } = this.props;
    const { roleList,systemInfo } = gameModel;
    return(
      <div className={style.gameInterface}>
        <EventSelect currentNode={Map[systemInfo.stage-1]} roleList={roleList} />
        <div className={style.roleInfo}>

        </div>
      </div>
    );
  }
}


export default GameInterface;

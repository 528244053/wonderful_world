import React from 'react';
import { Button,Modal } from 'antd';
import { connect } from 'react-redux';
import enemyList from '@/gameConfig/enemy';

@connect(({ dispatch,gameModel }) => ({ dispatch,gameModel }))
class GameInterface extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectModalVisible:false,
    }
  }

  fight = enemy => {
    const { dispatch } = this.props;
    dispatch({
      type:'gameModel/fightEnemy',
      payload:{
        enemy
      }
    })
  };

  render() {
    const { selectModalVisible } = this.state;
    return(
      <div>
        <Button onClick={() => this.setState({ selectModalVisible:true })}>开战</Button>
        <Modal
          visible={selectModalVisible}
          title={'请选择敌人'}
          onOk={() => this.setState({ selectModalVisible:false })}
          onCancel={() => this.setState({ selectModalVisible:false })}
        >
          {Object.values(enemyList).map(enemy => (
            <Button
              key={enemy.id}
              onClick={() => this.fight(enemy)}
            >
              {enemy.name}
            </Button>
          ))}
        </Modal>
      </div>
    );
  }
}


export default GameInterface;

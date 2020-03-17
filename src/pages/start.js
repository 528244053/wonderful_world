import styles from './index.css';
import React, { CSSProperties } from 'react';
import { startMenu,startTitle } from '@/gameConfig/layoutConfig'
import { routerRedux,connect } from 'dva'
import { Button } from 'antd';

@connect(({ dispatch }) => ({ dispatch }))
class GameStartInterface extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      stratMenuStyles:startMenu,
      startTitleStyles:startTitle,
    }
    window.addEventListener('resize',this.onResize);
  }

  componentDidMount() {
    this.onResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize',this.onResize);
  }

  onResize = () => {
    const { stratMenuStyles = {},startTitleStyles = {} } = this.state;
    stratMenuStyles.left = (window.innerWidth - stratMenuStyles.width) / 2;
    stratMenuStyles.top = window.innerHeight - stratMenuStyles.height;
    startTitleStyles.left = (window.innerWidth - startTitleStyles.width) / 2;
    this.setState({
      stratMenuStyles,
      startTitleStyles
    })
  }

  gameStart = () => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
          pathname: '/GameStartBefore'
      })
    )
  }

  render() {
    const { stratMenuStyles,startTitleStyles } = this.state;
    return (
      <div>
        <div style={{...startTitleStyles}}>
          奇妙冒险
        </div>
          <div style={{...stratMenuStyles}}>
            <Button className={styles.button} onClick={this.gameStart}>
              新的冒险
            </Button>
          </div>
      </div>
    )
  }

}

export default GameStartInterface;

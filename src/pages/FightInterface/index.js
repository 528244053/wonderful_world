import React from 'react';
import { connect } from 'react-redux';
import FightStateInfo from '@/pages/FightInterface/componets/FightStateInfo';
import OperateMenu from '@/pages/FightInterface/componets/OperateMenu';
import roleList from '@/gameConfig/role'
import enemyList from '@/gameConfig/enemy';
import { calculateDamage, renderDamage, stateFilter } from '@/utils/fightUtils';
import { getElementToPageTop } from '@/utils/commonUtil';
import lodash from  'lodash';


@connect(({ dispatch,fightModel }) => ({ dispatch,fightModel }))
class FightInterFace extends React.Component {

  constructor(props) {
    super(props);
    this.consoleRef = React.createRef();
    this.state = {
      isRun:true,
      message:[],
      role:roleList.jojo,
      enemy:enemyList.slime,
      renderRole:roleList.jojo,
      renderEnemy:enemyList.slime,
      consoleHeight:400
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'fightModel/init',
      payload: {},
      callback: this.fightStart
    });
    this.onresize();
    window.addEventListener('resize',this.onresize)
  }

  componentWillMount() {
    window.removeEventListener('resize',this.onresize)
  }

  onresize = () => {
    this.setState({
      consoleHeight:this.getConsoleHeight()
    })
  };

  fightStart = (role,enemy) => {
    const roleState = { ...role,process:0 };
    const enemyState = { ...enemy,process:0 };
    this.setState({
      role:roleState,
      enemy:enemyState,
      message:[<div key="0">开始战斗</div>]
    });
    this.processInterval = setTimeout(() => this.processRun(),800);
  };

  componentWillUnmount() {
    window.clearInterval(this.processInterval);
  }

  processRun = () => {
    const { role,enemy,isRun=true,message } = this.state;
    if(!isRun) return;
    const newRole = this.renderState(role);
    const newEnemy = this.renderState(enemy);
    const newRP = role.process + newRole.speed;
    const newEP = enemy.process + newEnemy.speed;
    let run = isRun;
    let enemyDo = false;
    if(newRP >= 100 && newEP >= 100) {
      const costR = (100 - role.process) / newRole.speed;
      const costE = (100 - enemy.process) / newEnemy.speed;
      if(costR<=costE) {
        role.process = 0;
        enemy.process =  enemy.process +  Number.parseInt((newEnemy.speed*costR).toString());
        run = false;
        if(enemy.process >= 100) enemy.process -= 2;
        message.push(<div key={message.length} style={{color:'green'}}>{newRole.name}-行动</div>);
      } else {
        role.process = role.process + Number.parseInt((newEnemy.speed*costR).toString());
        enemy.process = 0;
        message.push(<div key={message.length} style={{color:'red'}}>{newEnemy.name}-行动</div>);
        if(role.process >= 100) role.process -= 2;
        enemyDo = true;
      }
    } else if(newRP >= 100 || newEP >= 100) {
      if(newRP >= 100) {
        role.process = newRP - 100;
        enemy.process = newEP;
        run = false;
        message.push(<div key={message.length} style={{color:'green'}}>{newRole.name}-行动</div>);
      }
      if(newEP >= 100) {
        enemy.process = newEP - 100;
        role.process = newRP;
        enemyDo = true;
        message.push(<div key={message.length} style={{color:'red'}}>{newEnemy.name}-行动</div>);
      }
    } else {
      role.process = newRP;
      enemy.process = newEP;
    }
    this.setState({
      role:role,
      enemy:enemy,
      renderRole:newRole,
      renderEnemy:newEnemy,
      isRun:run,
      message
    },() =>{
      if(run && !enemyDo) this.processInterval = setTimeout(() => this.processRun(),800);
      if(enemyDo) this.handleEnemyDo()
    });
  };

  renderState = state => {
    const { message } = this.state;
    const renderState = lodash.cloneDeep(state);
    state.state.forEach(_ => {if(_.onRender) _.onRender(renderState,message,state)});
    stateFilter(state);
    return renderState;
  };

  renderStateAfterAttack = (sRender,tRender,message,source,target) => {
    sRender.skill.forEach(skill => {if(skill.onEndAttack) skill.onEndAttack(sRender,tRender,message,source,target)});
  };
  
  handleEnemyDo = () => {
    const { enemy } = this.state;
    const canUseSkill = enemy.skill.find(_ => _.cost <= enemy.pow && _.restCd <= 0);
    if(canUseSkill) {
      this.handleUseSkill('enemy',canUseSkill);
    } else {
      this.handleAttack('enemy');
    }
  };

  handleAttack = (sourceType) => {
    let source,target,sRender,tRender;
    const { message,role,enemy,renderRole,renderEnemy } = this.state;
    const isRole = sourceType === 'role';
    if(isRole) {
      source = role;
      sRender = renderRole;
      target = enemy;
      tRender = renderEnemy;
    } else {
      source = enemy;
      sRender = renderEnemy;
      tRender = renderRole;
      target = role;
    }
    const damage = calculateDamage(sRender,tRender,message,'普通攻击');
    renderDamage(damage,source,target,message,sRender,tRender,'normal');
    this.renderStateAfterAttack(sRender,tRender,message,source,target);
    this.setState({
      role: sourceType === 'role'?source:target,
      enemy:sourceType === 'enemy'?source:target,
      renderRole: sourceType === 'role'?sRender:tRender,
      renderEnemy:sourceType === 'enemy'?sRender:tRender,
      message,
    },() => this.handleTurnEnd(sourceType))
  };


  handleUseSkill = (sourceType,skill) => {
    let source,target,sRender,tRender;
    const { message,role,enemy,renderRole,renderEnemy } = this.state;
    const isRole = sourceType === 'role';
    if(isRole) {
      source = role;
      sRender = renderRole;
      target = enemy;
      tRender = renderEnemy;
    } else {
      source = enemy;
      sRender = renderEnemy;
      tRender = renderRole;
      target = role;
    }
    skill.onUse(sRender,tRender,message,source,target);
    this.setState({
      role: sourceType === 'role'?source:target,
      enemy:sourceType === 'enemy'?source:target,
      renderRole:sourceType === 'role'?sRender:tRender,
      renderEnemy:sourceType === 'enemy'?sRender:tRender,
      message,
      isRun:true,
    },() => this.handleTurnEnd(sourceType))
  };

  handleTurnEnd = sourceType => {
    let source,target,sRender,tRender;
    const { message,role,enemy,renderRole,renderEnemy } = this.state;
    const isRole = sourceType === 'role';
    if(isRole) {
      source = role;
      sRender = renderRole;
      target = enemy;
      tRender = renderEnemy;
    } else {
      source = enemy;
      sRender = renderEnemy;
      tRender = renderRole;
      target = role;
    }
    source.skill.forEach(skill => {
        if(skill.restCd > 0) skill.restCd--;
      });
    source.state.forEach( _ => {if(_.onEndTurn) _.onEndTurn(sRender,message,source)});
    console.log(source.state);
    stateFilter(source);
    this.setState({
      role: sourceType === 'role'?source:target,
      enemy:sourceType === 'enemy'?source:target,
      renderRole: sourceType === 'role'?sRender:tRender,
      renderEnemy:sourceType === 'enemy'?sRender:tRender,
      message,
      isRun:true
    },() => this.processInterval = setTimeout(() => this.processRun(),700))
  };

  getConsoleHeight = () => {
    if(!this.consoleRef) return 600;
    const offsetTop = getElementToPageTop(this.consoleRef.current) || 600;
    return window.innerHeight - offsetTop;
  };

  render() {
    const {
      isRun,
      role,
      enemy,
      renderRole,
      renderEnemy,
      message = [],
      consoleHeight,
    } = this.state;
    return(
      <div>
        <div>
          <FightStateInfo state={enemy} type={'enemy'} renderState={renderEnemy} />
          <FightStateInfo state={role} type={'role'} renderState={renderRole} />
          <OperateMenu handleAttack={this.handleAttack} handleUseSkill={this.handleUseSkill} role={role} isRun={isRun}/>
        </div>
        <div className={'flexColumn'} ref={this.consoleRef} style={{height:consoleHeight}}>
          <div>控制台</div>
          <div className={'console'}>
            {[...message].reverse()}
          </div>
        </div>
      </div>
    )
  }
}

export default FightInterFace;

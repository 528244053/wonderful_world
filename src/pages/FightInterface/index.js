import React from 'react';
import { connect } from 'react-redux';
import FightStateInfo from '@/pages/FightInterface/componets/FightStateInfo';
import OperateMenu from '@/pages/FightInterface/componets/OperateMenu';
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
      roleList:[],
      enemy:enemyList.slime,
      renderRoleList:[],
      renderEnemy:enemyList.slime,
      personWillDoId:null,
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

  fightStart = (roleList,enemy) => {
    this.setState({
      roleList,
      renderRoleList:roleList.map(role => lodash.cloneDeep(role)),
      renderEnemy:lodash.cloneDeep(enemy),
      enemy,
      message:[<div key="0">开始战斗</div>]
    },() => setTimeout(() => this.processRun(),800));
  };

  componentWillUnmount() {
    window.clearInterval(this.processInterval);
  }

  processRun = () => {
    const { roleList,enemy,renderRoleList,renderEnemy,isRun=true,message } = this.state;
    console.log(renderRoleList,"run");
    if(!isRun) return;
    renderRoleList.forEach(renderRole => {
      const role = roleList.find(role => role.id === renderRole.id);
      this.renderState(role,renderRole);
    });
   this.renderState(enemy,renderEnemy);
    //处理行动逻辑
    let personWillDoId = null; //行动人物id
    const handleRun = () => {
      const sortPersonBySpeed = [...renderRoleList,renderEnemy].sort((a,b) => b.process - a.process);
      if(sortPersonBySpeed[0].process >= 100) {
        const personWillDo = sortPersonBySpeed[0];
        personWillDoId = personWillDo.id;
        const diffProcess = personWillDo.process - 100;
        personWillDo.process = 0;
        sortPersonBySpeed.forEach((person,index) => (index && (person.process -= diffProcess)));
      }
    };
    handleRun();
    if(!personWillDoId) {
      renderEnemy.process = (renderEnemy.process || 0) + renderEnemy.speed;
      renderRoleList.forEach(role => role.process = (role.process || 0) + role.speed);
      handleRun();
    }
    this.setState({
      roleList,
      enemy,
      renderRoleList,
      renderEnemy,
      personWillDoId,
      message
    },() =>{
      if(!personWillDoId) this.processInterval = setTimeout(() => this.processRun(),800);
      if(enemy.id === personWillDoId) this.handleEnemyDo()
    });
  };

  renderState = (person,renderPerson) => {
    const { message } = this.state;
    renderPerson.state.forEach(_ => {if(_.onRender) _.onRender(renderPerson,message,person)});
    stateFilter(renderPerson);
  };

  renderStateAfterAttack = (sRender,tRender,message,source,target) => {
    sRender.skill.forEach(skill => {if(skill.onEndAttack) skill.onEndAttack(sRender,tRender,message,source,target)});
  };
  
  handleEnemyDo = () => {
    const { enemy,renderRoleList } = this.state;
    const canUseSkill = enemy.skill.find(_ => _.cost <= enemy.pow && _.restCd <= 0);
    const targetRole = [...renderRoleList].sort((a,b) => b.taunt || 0 - a.taunt || 0)[0];
    if(canUseSkill) {
      this.handleUseSkill(enemy.id,targetRole.id,canUseSkill);
    } else {
      this.handleAttack(enemy.id,targetRole.id);
    }
  };

  handleAttack = (sourcePersonId,targetPersonId) => {
    const { message,roleList,enemy,renderRoleList,renderEnemy } = this.state;
    const allRenderPerson = [...renderRoleList,renderEnemy];
    const sourceRenderPerson = allRenderPerson.find(person => person.id === sourcePersonId);
    const targetRenderPerson = allRenderPerson.find(person => person.id === targetPersonId);
    const allPerson = [...roleList,enemy];
    const sourcePerson = allPerson.find(person => person.id === sourcePersonId);
    const targetPerson = allPerson.find(person => person.id === targetPersonId);
    const damage = calculateDamage(sourceRenderPerson,targetRenderPerson,message,'普通攻击');
    renderDamage(damage,sourcePerson,targetPerson,message,sourceRenderPerson,targetRenderPerson,'normal');
    this.renderStateAfterAttack(sourcePerson,targetPerson,message,sourceRenderPerson,targetRenderPerson);
    this.setState({
      renderRoleList,
      renderEnemy,
      message,
    },() => this.handleTurnEnd(sourcePersonId))
  };

  getPersonInfoById = (personId,roleList,enemy,renderRoleList,renderEnemy) => {
    const allRenderPerson = [...renderRoleList,renderEnemy];
    const person = allRenderPerson.find(person => person.id === personId);
    const allPerson = [...roleList,enemy];
    const renderPerson = allPerson.find(person => person.id === personId);
    return [person,renderPerson];
  };


  handleUseSkill = (sourceId,targetId,skill) => {
    const { message,roleList,enemy,renderRoleList,renderEnemy } = this.state;
    const sourceInfo = this.getPersonInfoById(sourceId,roleList,enemy,renderRoleList,renderEnemy);
    const targetInfo = this.getPersonInfoById(targetId,roleList,enemy,renderRoleList,renderEnemy);
    skill.onUse(sourceInfo[1],targetInfo[1],message,sourceInfo[0],targetInfo[0],renderRoleList);
    this.setState({
      roleList,
      enemy,
      renderRoleList,
      renderEnemy,
      message,
      personWillDoId:null,
    },() => this.handleTurnEnd(sourceId))
  };



  handleTurnEnd = sourcePersonId => {
    const { message,roleList,enemy,renderRoleList,renderEnemy } = this.state;
    const personList = this.getPersonInfoById(sourcePersonId,roleList,enemy,renderRoleList,renderEnemy);
    const person = personList[0];
    const renderPerson = personList[1];
    (renderPerson.skill || []).forEach(skill => {
      if(skill.restCd > 0) skill.restCd--;
    });

    renderPerson.state.forEach( _ => {if(_.onEndTurn) _.onEndTurn(renderPerson,message,person)});
    stateFilter(renderPerson);
    this.setState({
      roleList,
      enemy,
      renderRoleList,
      renderEnemy,
      message,
      personWillDoId:null,
    },() => this.processInterval = setTimeout(() => this.processRun(),700))
  };

  getConsoleHeight = () => {
    if(!this.consoleRef) return 600;
    const offsetTop = getElementToPageTop(this.consoleRef.current) || 600;
    return window.innerHeight - offsetTop;
  };

  render() {
    const {
      personWillDoId,
      roleList = [],
      enemy,
      renderRoleList = [],
      renderEnemy,
      message = [],
      consoleHeight,
    } = this.state;
    return(
      <div>
        <div>
          <FightStateInfo person={enemy} type={'enemy'} renderPerson={renderEnemy} />
          {renderRoleList.map(renderRole => {
            const role = roleList.find(role => role.id === renderRole.id);
            return (
              <div key={renderRole.id}>
                <FightStateInfo person={role} type={'role'} renderPerson={renderRole} />
                <OperateMenu handleAttack={this.handleAttack} handleUseSkill={this.handleUseSkill} role={renderRole} targetPerson={enemy} isRun={personWillDoId !== renderRole.id}/>
              </div>
            );
          })}
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

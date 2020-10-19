import React,{ useState } from 'react';
import { Button, Popover, Spin } from 'antd';
import styles from '../index.css'

const OperateMenu = ({handleAttack,isRun=true,role,handleUseSkill,targetPerson = {}}) => {

  const [mode,setMode] = useState('main');

  const renderOperation = () => {
    if(mode === 'skill') {
      const operateList = [
        <Button onClick={() => setMode('normal')} key={'return'}>返回</Button>
      ];
      role.skill.forEach(skill => {
        const restCd = skill.restCd;
        const canUse = restCd <= 0 && role.pow >= skill.cost;
        operateList.push(
          <Popover key={skill.id} placement={'bottom'} content={skill.desc}>
            <Button onClick={() => handleUseSkill(role.id,targetPerson.id,skill)} disabled={!canUse}>{skill.name}{restCd>0?`(${skill.restCd})`:''}</Button>
          </Popover>
        );
      });
      console.log(role.skill);
      return operateList;
    }
    return [
      <Button onClick={() => handleAttack(role.id,targetPerson.id)} key={'attack'}>攻击</Button>,
      <Button onClick={() => setMode('skill')} key={'skill'}>技能</Button>
    ]
  };

  return(
    <Spin spinning={isRun}>
      <div className={'flexColumn'}>
       <div className={styles.flexOperate}>
         {renderOperation()}
       </div>
      </div>
    </Spin>
  )
};

export default OperateMenu;

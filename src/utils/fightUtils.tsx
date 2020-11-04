// @ts-ignore
import lodash from 'lodash';

//100的基数计算
import { liveThings } from '@/gameConfig/role';
import React from 'react';
import { state } from '@/gameConfig/state';

export const calculateDamage = (sourceState:liveThings, targetState:liveThings, message?:any[],skillName?:string):number => {
  const cri = sourceState.cri || 0;
  const criDamage = sourceState.criDamage || 1.8;
  const miss = targetState.miss || 0;
  const isCri = getRandomResultByRate(cri);
  const isMiss = getRandomResultByRate(miss);
  let damage = 0;
  const damageRate = 1 - (targetState.def - 20) * 1.8 / (80 + targetState.def );
  if(isCri) {
    damage = Number.parseInt((sourceState.atk * damageRate * criDamage).toString());
  } else if (!isMiss) {
    damage = Number.parseInt((sourceState.atk * damageRate).toString());
  }
  const isRole = lodash.get(sourceState,'level');
  if(message) {
    if(isCri || !isMiss) {
      message.push(
        <div key={message.length}>
          <span style={{ color: isRole ? 'green' : 'red' }}>{sourceState.name}</span>
          使用{skillName},{isCri ? '产生了暴击,' : ''}对
          <span style={{ color: isRole ? 'red' : 'green' }}>{targetState.name}</span>
          造成了<span style={{ color: isCri ? 'orange' : 'blue',fontWeight:isCri?'bold':'inherit' }}>{damage}</span>点伤害
        </div>
      );
    } else {
      message.push(
        <div key={message.length}>
          <span style={{ color: isRole ? 'green' : 'red' }}>{sourceState.name}</span>
          使用{skillName},被
          <span style={{ color: isRole ? 'red' : 'green' }}>{targetState.name}</span>
          闪避
        </div>
      );
    }
  }
  return damage;
};

export const renderDamage = (damage:number,source:liveThings,target:liveThings,message:any[],sRender:liveThings,tRender:liveThings,attackType:string):void => {
  const isRole = lodash.get(source,'taunt') !== undefined;
  if(attackType === 'normal') {
    sRender.pow += sRender.powGet;
    if(sRender.pow > 100) sRender.pow = 100;
  }
  tRender.life -= damage;
  if(isRole) {
    // @ts-ignore
    sRender.taunt += damage;
  }
  if(sRender.suck && damage>0) {
    sRender.life += numberToInt(sRender.suck * damage / 100);
    if(sRender.life > sRender.lifeMax) sRender.life = sRender.lifeMax;
    message.push(
      <div key={message.length}>
        <span style={{ color: isRole ? 'green' : 'red' }}>{sRender.name}</span>
        通过伤害回复了<span style={{ color: 'green' }}>{numberToInt(sRender.suck * damage / 100)}点生命</span>
      </div>
    )
  }
};

export const getDeadPerson = (roleList:liveThings[] = [],enemy:liveThings) => {
  const deadRole = roleList.find(role => role.life <= 0);
  if(deadRole) {
    return deadRole;
  }
  if(enemy.life <= 0) {
    return enemy;
  }
  return null;
};

export const getSelf = (state:liveThings,type:string,id:string):any => {
  return (lodash.get(state,type) || []).find((value: { id: string; }) => value.id === id);
};

export const stateFilter = (state:liveThings):void => {
  state.state = state.state.filter(state => state.restTurn > 0);
};

export const stateAdd = (source:liveThings,stateToAdd:state):void => {
  const self =source.state.find(_ => _.id === stateToAdd.id);
  if(self) {
    self.restTurn += stateToAdd.restTurn;
  } else {
    source.state.push(stateToAdd)
  }
};

export const getRandomResultByRate = (rate:number):boolean => {
  const random = Math.random() * 100;
  return rate >= random;
};

export const getRandomRange = (start:number,end:number):number => {
  const random = Math.random() * (end - start);
  return start + random;
};

export const numberToInt = (num:number):number => {
  return Number.parseInt(num.toString());
};

export const relatePosite = (num:number):number => {
  return num>0?num:-num;
};

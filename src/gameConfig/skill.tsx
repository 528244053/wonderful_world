import { liveThings } from '@/gameConfig/role';
import {
  calculateDamage,
  getRandomResultByRate,
  numberToInt,
  relatePosite,
  renderDamage,
  stateAdd,
} from '@/utils/fightUtils';
import React from 'react';
import stateList from '@/gameConfig/state';


export interface skill {
  id: string,
  name: string,
  desc: string,
  cost: number,
  cd: number,
  restCd: number,
  level:number,
  levelConfig:any,
  onUse?: (stateRenderA: liveThings, stateRenderD: liveThings, message: any[], source: liveThings, sourceB: liveThings) => any,
  onEndAttack?: (stateRenderA: liveThings, stateRenderD: liveThings, message: any[], source: liveThings, sourceB: liveThings) => any
}


const oula:skill = {
  id:'oula',
  name:'欧拉欧拉欧拉',
  desc:'NP:60,CD:6,承太郎使用白金之星连续打出5/7/9（根据等级提升）拳，每拳造成60%的攻击伤害',
  cost:60,
  restCd:0,
  cd:6,
  level:1,
  levelConfig:[5,7,9],
  onUse:(sRender,tRender,message,source,target) => {
    sRender.atk = sRender.atk*0.6;
    let selfSkill = source.skill.find(skill => skill.id === 'oula');
    if(!selfSkill) {
      source.skill.push(oula);
      selfSkill = oula;
    }
    for (let i=0;i<selfSkill.levelConfig[selfSkill.level-1];i++) {
      const damage = calculateDamage(sRender,tRender,message,selfSkill.name);
      renderDamage(damage,source,target,message,sRender,tRender,'skill');
    }
    source.pow -= selfSkill.cost;
    selfSkill.restCd = selfSkill.cd + 1;
  }
};

const timeStopSkill:skill = {
  id:'timeStopSkill',
  name:'时停-扎瓦鲁多',
  desc:'NP:80,CD:7/8/9,承太郎使用扎瓦鲁多时停6/10/14秒',
  cost:80,
  restCd:0,
  cd:7,
  level:1,
  levelConfig:[6,10,14],
  onUse:(sRender,tRender,message,source,target) => {
    let selfSkill = source.skill.find(skill => skill.id === 'timeStopSkill');
    if(!selfSkill) {
      source.skill.push(timeStopSkill);
      selfSkill = timeStopSkill;
    }
    message.push(
      <div key={message.length}>
        <span style={{color:'green'}}>{sRender.name}</span>
        使用{selfSkill.name},使
        <span style={{color:'red'}}>{tRender.name}</span>
        时间停止了{selfSkill.levelConfig[selfSkill.level-1]}秒
      </div>
    );
    const timeStop = stateList.timeStop;
    timeStop.restTurn = selfSkill.levelConfig[selfSkill.level-1];
    stateAdd(target,timeStop);
    source.pow -= selfSkill.cost;
    selfSkill.restCd = selfSkill.cd;
  }
};

const baijinzhi:skill = {
  id:'baijinzhi',
  name:'白金之指',
  desc:'NP:30,CD:4,白金之星利用手指突刺造成自身与敌方距离之差的伤害，系数为1.5/2/3',
  cost:30,
  restCd:0,
  cd:4,
  level:1,
  levelConfig:[1.5,2,3],
  onUse:(sRender,tRender,message,source,target) => {
    const diff = relatePosite( (source.process || 0)-(target.process || 0));
    let selfSkill = source.skill.find(skill => skill.id === 'baijinzhi') || baijinzhi;
    const atk = numberToInt((sRender.atk + diff) * selfSkill.levelConfig[selfSkill.level-1]);
    const damage = calculateDamage({...sRender,atk},tRender,message,selfSkill.name);
    renderDamage(damage,source,target,message,sRender,tRender,'skill');
    source.pow -= selfSkill.cost;
    selfSkill.restCd = selfSkill.cd + 1;
  }
};

const baijinzhixing:skill = {
  id:'baijinzhixing',
  name:'白金之星',
  desc:'被动技能,承太郎每打出一发普通攻击，白金之星就有20/30/40%的概率打出一拳，最多额外打三拳',
  cost:999999999,
  restCd:0,
  cd:1,
  level:1,
  levelConfig:[20,30,40],
  onEndAttack:(sRender,tRender,message,source,target) => {
    let selfSkill = source.skill.find(skill => skill.id === 'baijinzhixing') || baijinzhixing;
    for (let i=0;i<3;i++) {
      if(getRandomResultByRate(selfSkill.levelConfig[selfSkill.level-1])) {
        const damage = calculateDamage(sRender,tRender,message,selfSkill.name);
        renderDamage(damage,source,target,message,sRender,tRender,'skill');
        source.pow += sRender.powGet;
      } else {
        break
      }
    }
  }
};

const lindao_meilin:skill = {
  id:'lindao_meilin',
  name:'梦幻的领导力',
  desc:'NP:0,CD:6,为亚瑟王辅佐的梅林通过梦幻般的领导力为队友提供30/40/50%的攻击力，20的NP，持续4/5/6回合',
  cost:0,
  restCd:0,
  cd:6,
  level:1,
  levelConfig:[4,5,6],
  onUse:(sRender,tRender,message,source,target) => {
    let selfSkill = source.skill.find(skill => skill.id === 'lindao_meilin') || lindao_meilin;
    const lindao_state = stateList.lindao_meilin;
    lindao_state.restTurn = selfSkill.levelConfig[selfSkill.level-1]+1;
    lindao_state.rate = 1.2 + selfSkill.level*0.1;
    stateAdd(source,lindao_state);
    source.pow += 20;
    if(source.pow > 100) source.pow = 100;
    selfSkill.restCd = selfSkill.cd + 1;
  }
};

const huansu_meilin:skill = {
  id:'huansu_meilin',
  name:'幻术',
  desc:'NP:60,CD:7,梅林通过幻术保护队友，迷惑对方，使己方暂时闪避并额外提供30%NP获取，持续2/3/4回合',
  cost:60,
  restCd:0,
  cd:7,
  level:1,
  levelConfig:[2,3,4],
  onUse:(sRender,tRender,message,source,target) => {
    let selfSkill = source.skill.find(skill => skill.id === 'huansu_meilin') || huansu_meilin;
    const huansu_state = stateList.huansu_meilin;
    huansu_state.restTurn = selfSkill.levelConfig[selfSkill.level-1]+1;
    stateAdd(source,huansu_state);
    selfSkill.restCd = selfSkill.cd + 1;
    source.pow -= selfSkill.cost;
  }
};

const hero_meilin:skill = {
  id:'hero_meilin',
  name:'英雄作成EX',
  desc:'NP:60,CD:6,梅林以人为的方式让王诞生，并对其进行培养的技术，提供30%攻击，30%的生命上限，50%/100%/150%的爆伤加成，持续4/5/6回合',
  cost:60,
  restCd:0,
  cd:7,
  level:1,
  levelConfig:[1.5,2,2.5],
  onUse:(sRender,tRender,message,source,target) => {
    let selfSkill = source.skill.find(skill => skill.id === 'hero_meilin') || hero_meilin;
    const hero_state = stateList.hero_meilin;
    hero_state.restTurn = selfSkill.level+4;
    hero_state.rate = selfSkill.levelConfig[selfSkill.level-1];
    stateAdd(source,hero_state);
    selfSkill.restCd = selfSkill.cd + 1;
    source.pow -= selfSkill.cost;
  }
};

const awalong_meilin:skill = {
  id:'awalong_meilin',
  name:'已被永久关闭的幻想乡',
  desc:'NP:100,CD:3,将至今仍把梅林囚禁在其中的『塔』再现出来，提供友方每秒5%的NP，5%的生命回复，并随机获得0-300%的暴击加成，持续5/7/9回合',
  cost:100,
  restCd:0,
  cd:3,
  level:1,
  levelConfig:[5,7,9],
  onUse:(sRender,tRender,message,source,target) => {
    let selfSkill = source.skill.find(skill => skill.id === 'awalong_meilin') || awalong_meilin;
    const awalong_state = stateList.awalong_meilin;
    awalong_state.restTurn =selfSkill.levelConfig[selfSkill.level-1]+1;
    stateAdd(source,awalong_state);
    selfSkill.restCd = selfSkill.cd + 1;
    source.pow -= selfSkill.cost;
  }
};

const tuchi:skill = {
  id:'tuchi',
  name:'突刺',
  desc:'NP:30,CD:5,剑士利用刀向前突刺造成自身攻击1.5/2/3的悲伤害，并有60%的概率给与对方破防',
  cost:30,
  restCd:0,
  cd:5,
  level:1,
  levelConfig:[1.5,2,3],
  onUse:(sRender,tRender,message,source,target) => {
    let selfSkill = source.skill.find(skill => skill.id === 'tuchi') || tuchi;
    const atk = numberToInt(sRender.atk  * selfSkill.levelConfig[selfSkill.level-1]);
    const damage = calculateDamage({...sRender,atk},tRender,message,selfSkill.name);
    renderDamage(damage,source,target,message,sRender,tRender,'skill');
    if(getRandomResultByRate(60)) {
      const lose_diff = stateList.lose_def;
      lose_diff.restTurn += 1;
      stateAdd(target,lose_diff);
    }
    source.pow -= selfSkill.cost;
    selfSkill.restCd = selfSkill.cd + 1;
  }
};

const badaozhan:skill = {
  id:'badaozhan',
  name:'拔刀斩',
  desc:'NP:70,CD:4,迅速向前进行拔刀斩，提高100%的暴击率，并造成1.5/2/3的攻击力伤害，并有40%概率使对方流血',
  cost:70,
  restCd:0,
  cd:4,
  level:1,
  levelConfig:[1.5,2,3],
  onUse:(sRender,tRender,message,source,target) => {
    let selfSkill = source.skill.find(skill => skill.id === 'badaozhan') || badaozhan;
    const atk = numberToInt(sRender.atk * selfSkill.levelConfig[selfSkill.level-1]);
    const cri = numberToInt(sRender.cri * 2);
    const damage = calculateDamage({...sRender,atk,cri},tRender,message,selfSkill.name);
    renderDamage(damage,source,target,message,sRender,tRender,'skill');
    if(getRandomResultByRate(40)) {
      const liuxue = stateList.liuxue;
      liuxue.restTurn += 1;
      stateAdd(target,liuxue);
    }
    source.pow -= selfSkill.cost;
    selfSkill.restCd = selfSkill.cd + 1;
  }
};

const skillList = {
  oula,
  timeStopSkill,
  baijinzhi,
  baijinzhixing,
  lindao_meilin,
  huansu_meilin,
  hero_meilin,
  awalong_meilin,
  badaozhan,
  tuchi,
};

export default skillList;

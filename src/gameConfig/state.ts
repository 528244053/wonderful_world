import { liveThings } from '@/gameConfig/role';
import { getRandomRange, getSelf, numberToInt } from '@/utils/fightUtils';


export interface state {
  id:string,
  name:string,
  desc:string,
  color:string,
  restTurn:number,
  rate?:number,
  onRender?: (renderSateA:liveThings,message:any[],stateA:liveThings) => any,
  onEndTurn?: (renderSateA:liveThings,message:any[],stateA:liveThings) => any,
}

const timeStop:state = {
  id:'timeStop',
  name:'时间静止',
  desc: '该单位时间被停止',
  restTurn:5,
  color:'red',
  onRender: (renderSate,message,source) => {
    const timeStops = getSelf(renderSate,'state','timeStop');
    if(timeStops && timeStops.restTurn > 0) {
      timeStops.restTurn -= 1;
      renderSate.speed = 0;
      renderSate.miss = 0;
    }
  }
};

const lindao_meilin:state = {
  id:'lindao_meilin',
  name:'攻击力提升',
  desc: '该单位攻击力得到上升',
  restTurn:5,
  color:'red',
  rate:1.3,
  onRender: (renderSate,message,source) => {
    const selfState = getSelf(renderSate,'state','lindao_meilin');
    if(selfState && selfState.restTurn > 0) {
      renderSate.atk = numberToInt(renderSate.atk * (selfState.rate || 1.3));
    }
  },
  onEndTurn: (renderSate,message,source) => {
    const selfState = getSelf(renderSate,'state','lindao_meilin');
    if(selfState && selfState.restTurn > 0) {
      selfState.restTurn -= 1;
    }
  },
};

const huansu_meilin:state = {
  id:'huansu_meilin',
  name:'幻术',
  desc: '该单位在幻术隐藏下闪避、NP获取得到大幅提升',
  restTurn:3,
  color:'blue',
  onRender: (renderSate,message,source) => {
    const selfState = getSelf(renderSate,'state','huansu_meilin');
    if(selfState && selfState.restTurn > 0) {
      renderSate.miss = 100;
      renderSate.powGet = numberToInt(renderSate.powGet * 1.5);
    }
  },
  onEndTurn: (renderSate,message,source) => {
    const selfState = getSelf(renderSate,'state','huansu_meilin');
    if(selfState && selfState.restTurn > 0) {
      selfState.restTurn -= 1;
    }
  },
};

const hero_meilin:state = {
  id:'hero_meilin',
  name:'英雄作成',
  desc: '该单位得到梅林辅佐，攻击、生命上限、暴击伤害得到大幅提升',
  restTurn:4,
  color:'red',
  rate:1.5,
  onRender: (renderSate,message,source) => {
    const selfState = getSelf(source,'state','hero_meilin');
    if(selfState && selfState.restTurn > 0) {
      renderSate.atk = numberToInt(renderSate.atk * 1.3);
      renderSate.criDamage =renderSate.criDamage * selfState.rate;
      renderSate.lifeMax = numberToInt(renderSate.lifeMax * 1.3);
    }
  },
  onEndTurn: (renderSate) => {
    const selfState = getSelf(renderSate,'state','hero_meilin');
    if(selfState && selfState.restTurn > 0) {
      selfState.restTurn -= 1;
    }
  },
};

const awalong_meilin:state = {
  id:'awalong_meilin',
  name:'绝世独立的幻想乡',
  desc: '在幻想乡中，单位每秒钟能够回复5%的血量，获得5%的np,获得0到300%的暴击率提升',
  restTurn: 5,
  color:'pink',
  onRender: (renderSate,message,source) => {
    const selfState = getSelf(source,'state','awalong_meilin');
    if(selfState && selfState.restTurn > 0) {
      source.life += numberToInt(renderSate.lifeMax * 0.05);
      if(source.life>renderSate.lifeMax) source.life = renderSate.lifeMax;
      source.pow += 5;
      if(source.pow>100) source.pow = 100;
      renderSate.cri = numberToInt(renderSate.cri * getRandomRange(1,4));
    }
  },
  onEndTurn: (renderSate) => {
    const selfState = getSelf(renderSate,'state','awalong_meilin');
    if(selfState && selfState.restTurn > 0) {
      selfState.restTurn -= 1;
    }
  },
};

const lose_def:state = {
  id:'lose_def',
  name:'破防',
  desc: '该单位防御力减少',
  restTurn:4,
  color:'red',
  rate: 0.7,
  onRender: (renderSate,message,source) => {
    const selfState = getSelf(source,'state','lose_def');
    if(selfState && selfState.restTurn > 0) {
      renderSate.def = numberToInt(renderSate.def * selfState.rate);
    }
  },
  onEndTurn: (renderSate,message,source) => {
    const selfState = getSelf(renderSate,'state','lose_def');
    if(selfState && selfState.restTurn > 0) {
      selfState.restTurn -= 1;
    }
  },
};

const slow_down:state = {
  id:'slow_down',
  name:'缓慢',
  desc: '该单位速度减少',
  restTurn:3,
  color:'red',
  rate: 0.7,
  onRender: (renderSate,message,source) => {
    const selfState = getSelf(source,'state','lose_def');
    if(selfState && selfState.restTurn > 0) {
      renderSate.speed = numberToInt(renderSate.speed * selfState.rate);
    }
  },
  onEndTurn: (renderSate,message,source) => {
    const selfState = getSelf(renderSate,'state','lose_def');
    if(selfState && selfState.restTurn > 0) {
      selfState.restTurn -= 1;
    }
  },
};

const liuxue:state = {
  id:'liuxue',
  name:'流血',
  desc: '该单位正在流血，每秒失去5%的生命',
  restTurn:5,
  color:'red',
  onRender: (renderSate,message,source) => {
    const self = getSelf(renderSate,'state','liuxue');
    if(self && self.restTurn > 0) {
      source.life -= numberToInt(renderSate.lifeMax * 0.05);
      self.restTurn --;
    }
  }
};

const defaultOnEndTurn = (renderSate:liveThings,message:string[],source:liveThings,id:string) => {
  const selfState = getSelf(renderSate,'state',id);
  if(selfState && selfState.restTurn > 0) {
    selfState.restTurn -= 1;
  }
};

const stateList = {
  timeStop,
  lindao_meilin,
  huansu_meilin,
  hero_meilin,
  awalong_meilin,
  slow_down,
  lose_def,
  liuxue,
};

export default stateList;

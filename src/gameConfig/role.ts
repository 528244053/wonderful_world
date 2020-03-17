import skillList, { skill } from '@/gameConfig/skill';
import { state } from '@/gameConfig/state';

const rolePicPath = '/role/pic';

export interface liveThings {
  id:string,
  name:string,
  life:number,
  lifeMax:number,
  atk:number,
  def:number,
  speed:number,
  desc:string,
  pow:number,
  powGet:number,
  cri:number,
  criDamage:number,
  miss:number,
  suck:number,
  process?:number,
  skill: skill[],
  state: state[],
}

export interface Role extends liveThings{
  level:number,
  imgUrl:string,
}


const jojo:Role = {
  id:'jojo',
  name:'空条承太郎',
  desc:'空条承太郎',
  level:1,
  life:680,
  lifeMax:680,
  atk:60,
  def:30,
  pow:0,
  powGet:15,
  speed:30,
  cri:20,
  criDamage:1.8,
  miss:10,
  suck:0,
  skill:[skillList.oula,skillList.timeStopSkill,skillList.baijinzhi,skillList.baijinzhixing],
  state:[],
  imgUrl: rolePicPath+'/jojo.jpg',
};

const meilin:Role = {
  id:'meilin',
  name:'梅林',
  desc:'乐园的放浪者。登场于亚瑟王传说中的兼备导师及预言家身份的宫廷魔术师。对击败了无数敌人克服了无数苦难的亚瑟王时而进行引导、时而令其困扰，时而伸出援手。虽身为贤人，但基本上是非人类。毕竟他是梦魔与人类的混血儿。',
  level:1,
  life:630,
  lifeMax:630,
  atk:50,
  def:28,
  pow:0,
  powGet:20,
  speed:28,
  cri:20,
  criDamage:1.8,
  miss:10,
  suck:0,
  skill:[skillList.lindao_meilin,skillList.huansu_meilin,skillList.hero_meilin,skillList.awalong_meilin],
  state:[],
  imgUrl: rolePicPath+'/meilin.png',
};


const roleList = {
  jojo,
  meilin,
};

export default roleList;

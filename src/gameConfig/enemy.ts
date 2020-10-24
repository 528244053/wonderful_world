import { liveThings } from '@/gameConfig/role';
import skillList from '@/gameConfig/skill';


interface enemy extends liveThings{

}


const slime:enemy = {
  id:'slime',
  name:'史莱姆',
  desc:'一种弱小的魔物',
  life:100,
  lifeMax:100,
  atk:20,
  def:30,
  pow:0,
  powGet:10,
  speed:20,
  cri:10,
  criDamage:1.8,
  miss:0,
  suck:0,
  skill:[skillList.tuchi,skillList.badaozhan,skillList.baijinzhixing],
  state:[],
};

const sword:enemy = {
  id:'juge',
  name:'剑士',
  desc:'屑一郎',
  life:500,
  lifeMax:500,
  atk:40,
  def:5,
  pow:0,
  powGet:16,
  speed:35,
  cri:30,
  criDamage:2,
  miss:20,
  suck:10,
  skill:[skillList.badaozhan,skillList.tuchi],
  state:[],
};

const enemyList = {
  slime,
  sword,
};

export default enemyList;

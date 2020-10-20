import enemyList from '@/gameConfig/enemy';


export interface node {
  stage:number,
  eventType:"fight" | "personJoin" | "addEquip",
  target:object,
}

const Map:node[] = [
  {
    stage:1,
    eventType:"fight",
    target:enemyList.slime,
  },
  {
    stage:2,
    eventType:"personJoin",
    target:{}
  },
  {
    stage:3,
    eventType:"fight",
    target:enemyList.sword,
  },
];

export default Map;


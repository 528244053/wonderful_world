import { Role } from '@/gameConfig/role';


export const getRoleInfoList= (role:Role):string  => {
  return (`${role.name}\n攻击:${role.atk}\n防御:${role.def}\n速度:${role.speed}`)
};

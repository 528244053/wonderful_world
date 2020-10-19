import roleList from '@/gameConfig/role';
import { message } from 'antd/lib/index';
import enemyList from '@/gameConfig/enemy';
import { routerRedux } from 'dva';

export default {
  namespace:'gameModel',
  state:{
    enemy: enemyList.slime,
    roleList:[],
  },
  subscriptions:{},
  effects:{
    *init({ payload },{ put }) {
      const { roleId } = payload;
      const role = Object.values(roleList).find(role => role.id === roleId);
      if(!role) {
        message.error("获取角色失败");
      }
      yield put({ type:'updateRoleList',payload:[ role ] });
      yield put(routerRedux.push({
        pathname:'/GameInterface'
      }));
    },
    *fightEnemy({ payload },{ put }) {
      yield put({
        type:'updateEnemy',
        payload:payload.enemy,
      });
      yield put(routerRedux.push({
        pathname:'/FightInterface'
      }))
    }
  },
  reducers:{
    updateEnemy(state,{ payload }) {
      return {
        ...state,
        enemy:payload
      }
    },
    updateRoleList(state,{ payload }) {
      return {
        ...state,
        roleList:payload
      }
    },
  }

}




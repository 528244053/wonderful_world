import roleList from '@/gameConfig/role';
import { message } from 'antd/lib/index';
import enemyList from '@/gameConfig/enemy';
import { routerRedux } from 'dva';

const defaultSystemInfo = {
  stage:1
};

export default {
  namespace:'gameModel',
  state:{
    enemy: enemyList.slime,
    roleList:[],
    systemInfo:defaultSystemInfo,
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
      yield put({ type:'updateSystemInfo',payload:defaultSystemInfo });
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
    },
    *fightVictory({ payload },{ put }) {
      yield put({ type:'upgradeStage',payload:defaultSystemInfo });
      yield put(routerRedux.push({
        pathname:'/GameInterface'
      }));
    },
    *personJoin({ payload },{ put,select }) {
      const { roleList = []  } = yield select(_ => _.gameModel);
      if(roleList.length === 4) {
        message.error("该团队已经有四个人，不能再添加");
        return;
      }
      yield put({ type:'addRoleList',payload  });
      yield put({ type:'upgradeStage',payload:defaultSystemInfo });
    },
  },
  reducers:{
    upgradeStage(state) {
      const { systemInfo } = state;
      systemInfo.stage += 1;
      return {
        ...state
      }
    },
    updateSystemInfo(state,{ payload }) {
      return {
        ...state,
        systemInfo:payload,
      }
    },
    updateEnemy(state,{ payload }) {
      return {
        ...state,
        enemy:payload
      }
    },
    addRoleList(state,{ payload }) {
      return {
        ...state,
        roleList:[...state.roleList,payload]
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




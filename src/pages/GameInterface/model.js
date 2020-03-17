import roleList from '@/gameConfig/role';
import { message } from 'antd';
import enemyList from '@/gameConfig/enemy';
import { routerRedux } from 'dva';

export default {
  namespace:'gameModel',
  state:{
    enemy: enemyList.slime
  },
  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(params => {
        const { pathname, query } = params;
        if (pathname === '/GameInterface') {
          dispatch({ type: 'init', payload: { ...query } });
        }
      });
    },
  },
  effects:{
    *init({ payload },{ put,select }) {
      const { load=false,roleId } = payload;
      const { role } = select(_ => _.gameModel);
      if(!load && !role) {
        const role = Object.values(roleList).filter(role => role.id === roleId);
        if(role.length > 0) {
          yield put({ type:'updateRole',payload:role[0] })
        } else {
          message.error("通过角色id无法获取到角色");
        }
      }
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
    updateRole(state,{ payload }) {
      return {
        ...state,
        role:payload
      }
    },
  }

}



